import Head from "next/head";
import {WebMidi} from "webmidi";
import {useState} from "react";

enum LoadingState {
  WAITING, NO_DEVICE, DEVICE_FOUND
}

function MidiContent(props: { devices: JSX.Element[], notes: JSX.Element[] }) {
  return <div>
    <h2 className="text-center text-3xl font-bold">Devices</h2>
    <ul>{props.devices}</ul>

    <h2 className="text-center text-3xl font-bold">Notes</h2>
    <ul>{props.notes}</ul>
  </div>
}

function PageContent(props: { loadState: LoadingState, devices: JSX.Element[], notes: JSX.Element[] }) {
  switch (props.loadState) {
    case LoadingState.WAITING:
      return <p>Loading...</p>
    case LoadingState.NO_DEVICE:
      return <p>No device found</p>
    case LoadingState.DEVICE_FOUND:
      return <MidiContent devices={props.devices} notes={props.notes}/>;
  }
}

export default function Midi() {
  const [loadState, setLoadState] = useState(LoadingState.WAITING);
  const [devices, setDevices] = useState<JSX.Element[]>([]);
  const [notes, setNotes] = useState<JSX.Element[]>([]);

  function onEnabled() {
    // Display available MIDI input devices
    if (WebMidi.inputs.length >= 1) {
      setLoadState(LoadingState.DEVICE_FOUND);

      setDevices(WebMidi.inputs.map((device, index) => <li key={index}>{index}: {device.name}</li>));

      const midi = WebMidi.inputs[0];
      midi.channels[1].addListener("noteon", e => {
        setNotes(prevState => [
          ...prevState, <li key="a">{e.note.identifier + Math.floor(e.note.number / 12 - 1)}</li>
        ]);
      });
    } else setLoadState(LoadingState.NO_DEVICE);
  }

  WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
  return (
    <div>
      <Head>
        <title>MIDI PAGE</title>
        <meta name="description" content="Funny Site"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="container pt-4">
        <h1 className="text-center text-5xl font-bold text-red-500">
          MIDI
        </h1>
        <PageContent loadState={loadState} devices={devices} notes={notes}/>
      </main>
    </div>
  )
}