import Head from "next/head";
import { useEffect } from "react";
import {WebMidi} from "webmidi";



export default function Midi() {
  useEffect(doStuff,[]);

  return (
    <div>
      <Head>
        <title>MIDI PAGE</title>
        <meta name="description" content="Funny Site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container pt-4">
        <h1 className="text-center text-5xl font-bold text-red-500">
          MIDI
        </h1>
      </main>
    </div>
  )
}

const doStuff = () => {
  WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));

  // Function triggered when WEBMIDI.js is ready
  function onEnabled() {

  // Display available MIDI input devices
  if (WebMidi.inputs.length < 1) {
    document.body.innerHTML+= "No device detected.";
  } else {
    WebMidi.inputs.forEach((device, index) => {
      document.body.innerHTML+= `${index}: ${device.name} <br>`;
    });
  }

  const midi = WebMidi.inputs[0];
  
  midi.channels[1].addListener("noteon", e => {
    document.body.innerHTML+= `${e.note.identifier + Math.floor(e.note.number / 12 - 1)} <br>`;
  });

  }
};