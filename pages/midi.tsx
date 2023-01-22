import Head from "next/head";
import {Input, NoteMessageEvent, WebMidi} from "webmidi";
import {createContext, MouseEventHandler, useContext, useEffect, useState} from "react";

type DeviceInput = Input;
type Note = string;
type LoadStateSetter = (x: LoadingState) => void;
type DevicesSetter = (x: DeviceInput[]) => void;
type NoteSetter = (arg: Note[] | ((x: Note[]) => Note[])) => void;

enum LoadingState {
    WAITING, NO_DEVICE, SELECTING_DEVICE, DEVICE_SELECTED
}

type AllProps = {
    loadState: LoadingState, setLoadState: LoadStateSetter,
    deviceId: string, setDeviceId: (x: string) => void
    devices: DeviceInput[], setDevices: DevicesSetter,
    notes: Note[], setNotes: NoteSetter
}

const MidiContext = createContext<AllProps>({
    loadState: LoadingState.WAITING, setLoadState(): void {},
    deviceId: "", setDeviceId(): void {},
    devices: [], setDevices(): void {},
    notes: [], setNotes: () => {}
});
const MidiContextProvider = MidiContext.Provider;

function GenericButton(props: {onClick: MouseEventHandler<HTMLButtonElement>, children: any, type?: "button" | "submit"}) {
    return (
        <button className="rounded-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 hover:cursor-pointer m-1" {...props} />
    )
}

function ScanAgainButton() {
    const {setLoadState, setDevices} = useContext(MidiContext);
    return (  // set type="button" so it doesn't submit any forms it's in
        <GenericButton onClick={() => checkForInputs(setLoadState, setDevices)} type="button">
            Scan again
        </GenericButton>
    )
}

function MidiContent() {
    const {devices, deviceId, notes, setNotes} = useContext(MidiContext);
    
    useEffect(() => {
        const midi = WebMidi.getInputById(deviceId)
        const callback = (e: NoteMessageEvent) => {
            setNotes((prevState) => [
                ...prevState, e.note.identifier
            ]);
        }
        midi.channels.forEach(channel => channel.addListener("noteon", callback));
        return () => {
            midi.channels.forEach(channel => channel.removeListener("noteon", callback));
        }
    }, [deviceId, setNotes])
    
    return <div>
        <h2 className="text-center text-3xl font-bold">Devices</h2>
        <ol>
            {devices.map(device => <li key={device.id}>{device.name}</li>)}
        </ol>

        <h2 className="text-center text-3xl font-bold">Notes</h2>
        <ul>{notes.map((note, idx) => <li key={idx}>{note}</li>)}</ul>
    </div>
}

function DeviceSelectForm() {
    const {devices, setLoadState, deviceId, setDeviceId} = useContext(MidiContext);
    console.log("Devices:")
    console.log(devices)
    return (
        <form onSubmit={() => setLoadState(LoadingState.DEVICE_SELECTED)}>
            {devices.map(device => (
                <div key={device.id}>
                    <label>
                        <input
                            type="radio"
                            checked={deviceId === device.id}
                            onChange={() => setDeviceId(device.id)}
                        />
                        {device.name}
                    </label>
                </div>
            ))}
            <GenericButton onClick={() => {}}>Select Device</GenericButton>
            <ScanAgainButton/>
        </form>
    );
}

function PageContent() {
    const {loadState} = useContext(MidiContext);
    switch (loadState) {
        case LoadingState.WAITING:
            return <p>Loading...</p>
        case LoadingState.NO_DEVICE:
            return (
                <div>
                    <p>No device found.</p>
                    <ScanAgainButton/>
                </div>
            )
        case LoadingState.SELECTING_DEVICE:
            return <DeviceSelectForm/>
        case LoadingState.DEVICE_SELECTED:
            return <MidiContent/>;
    }
}

function checkForInputs(setLoadState: LoadStateSetter, setDevices: DevicesSetter) {
    console.log("Inputs:")
    console.log(WebMidi.inputs)
    // Display available MIDI input devices

    if (WebMidi.inputs.length >= 1) setLoadState(LoadingState.SELECTING_DEVICE);
    else setLoadState(LoadingState.NO_DEVICE);

    setDevices(WebMidi.inputs.slice());  // use a copy so that the references are different and a rerender is triggered
}

export default function Midi() {
    const [loadState, setLoadState] = useState(LoadingState.WAITING);
    const [devices, setDevices] = useState<DeviceInput[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        WebMidi
            .enable()
            .then(() => checkForInputs(setLoadState, setDevices))
            .catch(err => alert(err));
    }, [])
    
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
                <MidiContextProvider value={{loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                    <PageContent />
                </MidiContextProvider>
            </main>
        </div>
    )
}
