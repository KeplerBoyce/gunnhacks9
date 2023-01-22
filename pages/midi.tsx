import Head from "next/head";
import {Input, WebMidi} from "webmidi";
import {createContext, useContext, useState} from "react";

type DeviceInput = Input;
type Note = string;

enum LoadingState {
    WAITING, NO_DEVICE, SELECTING_DEVICE, DEVICE_SELECTED
}

type AllProps = {
    loadState: LoadingState, setLoadState: (x: LoadingState) => void,
    deviceId: string, setDeviceId: (x: string) => void
    devices: DeviceInput[],
    notes: Note[], setNotes: (arg: Note[] | ((x: Note[]) => Note[])) => void,
}

const MidiContext = createContext<AllProps>({
    loadState: LoadingState.WAITING, setLoadState(): void {},
    deviceId: "", setDeviceId(): void {},
    devices: [],
    notes: [], setNotes: () => {}
});
const MidiContextProvider = MidiContext.Provider;
function MidiContent() {
    const {devices, deviceId, notes, setNotes} = useContext(MidiContext);
    
    const midi = WebMidi.getInputById(deviceId)
    midi.channels[1].addListener("noteon", e => {
        setNotes((prevState) => [
            ...prevState, e.note.identifier + Math.floor(e.note.number / 12 - 1)
        ]);
    });
    return <div>
        <h2 className="text-center text-3xl font-bold">Devices</h2>
        <ol>
            {devices.map(device => device.name)}
        </ol>

        <h2 className="text-center text-3xl font-bold">Notes</h2>
        <ul>{notes}</ul>
    </div>
}

function DeviceSelectForm() {
    const {devices, setLoadState, setDeviceId} = useContext(MidiContext);
    return (
        <form onSubmit={() => setLoadState(LoadingState.DEVICE_SELECTED)}>
            {devices.map(device => (
                <div key={device.name}>
                    <input type="radio" required onChange={() => setDeviceId(device.id)} />
                    <label>{device.name}</label>
                </div>
            ))}
            <button type="submit">Select Device</button>
        </form>
    );
}

function PageContent() {
    const {loadState} = useContext(MidiContext);
    switch (loadState) {
        case LoadingState.WAITING:
            return <p>Loading...</p>
        case LoadingState.NO_DEVICE:
            return <p>No device found</p>
        case LoadingState.SELECTING_DEVICE:
            return <DeviceSelectForm/>
        case LoadingState.DEVICE_SELECTED:
            return <MidiContent/>;
    }
}

export default function Midi() {
    const [loadState, setLoadState] = useState(LoadingState.WAITING);
    const [devices, setDevices] = useState<DeviceInput[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [deviceId, setDeviceId] = useState("");

    function onEnabled() {
        // Display available MIDI input devices
        if (WebMidi.inputs.length >= 1) {
            setLoadState(LoadingState.SELECTING_DEVICE);
            setDevices(WebMidi.inputs);
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
                <MidiContextProvider value={{loadState, setLoadState, deviceId, setDeviceId, devices, notes, setNotes}}>
                    <PageContent />
                </MidiContextProvider>
            </main>
        </div>
    )
}