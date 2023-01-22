import Head from "next/head";
import {Input, NoteMessageEvent, WebMidi} from "webmidi";
import {createContext, MouseEventHandler, useContext, useEffect, useState} from "react";
import CenteredModal from "../components/CenteredModal";
import Button from "../components/Button";
import Score from "../components/Score";

type Chord = string[];

// b = flat, s = sharp, uppercase = major, lowercase = minor
const chords: {[name: string]: Chord} = {
    A: ["a/4", "c/5", "e/5"],
    B: ["b/4", "d#/4", "f#/4"],
    C: ["c/4", "e/4", "g/4"],
    D: ["d/4", "f#/4", "a/4"],
    E: ["e/4", "g#/4", "b/4"],
    F: ["f/4", "a/4", "c/5"],
    G: ["g/4", "b/4", "d/5"],
    Ab: ["ab/4", "c/5", "eb/5"],
    Bb: ["bb/4", "d/5", "f/5"],
    Cb: ["cb/4", "eb/4", "gb/4"],
    Db: ["db/4", "f/4", "ab/4"],
    Eb: ["eb/4", "g/4", "bb/4"],
    Gb: ["gb/4", "bb/4", "db/5"],
    Cs: ["c#/4", "e#/4", "g#/4"],
    Fs: ["f#/4", "a#/4", "c#/5"],
    a: ["a/4", "c/5", "e/5"],
    b: ["b/4", "d/4", "f#/4"],
    c: ["c/4", "eb/4", "g/4"],
    d: ["d/4", "f/4", "a/4"],
    e: ["e/4", "g/4", "b/4"],
    f: ["f/4", "ab/4", "c/5"],
    g: ["g/4", "bb/4", "d/5"],
    ab: ["ab/4", "cb/5", "eb/5"],
    bb: ["bb/4", "db/4", "f/4"],
    eb: ["eb/4", "gb/4", "bb/4"],
    as: ["a#/4", "c#/5", "e#/5"],
    cs: ["c#/4", "e/4", "g#/4"],
    ds: ["d#/4", "f/4", "a#/4"],
    fs: ["f#/4", "a/4", "c#/5"],
    gs: ["g#/4", "b/4", "d#/5"],
}

type DeviceInput = Input;
type Note = string;
type LoadStateSetter = (x: LoadingState) => void;
type DevicesSetter = (x: DeviceInput[]) => void;
type NoteSetter = (arg: Note[] | ((x: Note[]) => Note[])) => void;

enum LoadingState {
    WAITING, NO_DEVICE, SELECTING_DEVICE, DEVICE_SELECTED
}

type AllProps = {
    modalOpen: boolean, setModalOpen: (x: boolean) => void,
    loadState: LoadingState, setLoadState: LoadStateSetter,
    deviceId: string, setDeviceId: (x: string) => void
    devices: DeviceInput[], setDevices: DevicesSetter,
    notes: Note[], setNotes: NoteSetter
}

const MidiContext = createContext<AllProps>({
    modalOpen: true, setModalOpen: () => {},
    loadState: LoadingState.WAITING, setLoadState(): void {},
    deviceId: "", setDeviceId(): void {},
    devices: [], setDevices(): void {},
    notes: [], setNotes: () => {}
});
const MidiContextProvider = MidiContext.Provider;

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
        <h2 className="text-center text-3xl font-bold">Notes</h2>
        <ul>{notes.map((note, idx) => <li key={idx}>{note}</li>)}</ul>
    </div>
}

function DeviceSelectForm() {
    const {modalOpen, setModalOpen, devices, setLoadState, setDevices, deviceId, setDeviceId} = useContext(MidiContext);
    console.log("Devices:")
    console.log(devices)

    const handleSubmit = () => {
        setLoadState(LoadingState.DEVICE_SELECTED);
        setModalOpen(false);
    }

    return (
        <CenteredModal isOpen={modalOpen} setIsOpen={setModalOpen} clickToClose={false}>
            <div className="flex flex-col gap-4 bg-white px-8 py-6 rounded-lg">
                <h1 className="text-xl font-bold">
                    Select a MIDI device
                </h1>
                <div className="flex flex-col">
                    {devices.map(device => (
                        <button
                            onClick={() => setDeviceId(device.id)}
                            key={device.id}
                            className={"duration-200 px-2 py-1 rounded-lg cursor-pointer "
                                + (deviceId === device.id ? "bg-blue-300 hover:bg-blue-400" : "hover:bg-gray-200")}
                        >
                            {device.name}
                        </button>
                    ))}
                </div>
                <Button onClick={() => handleSubmit()} text="Select" canSubmit={!!deviceId} />
                <Button onClick={() => checkForInputs(setLoadState, setDevices)} text="Rescan" canSubmit />
            </div>
        </CenteredModal>
    );
}

function PageContent() {
    const {setModalOpen, loadState, setLoadState, setDevices} = useContext(MidiContext);
    switch (loadState) {
        case LoadingState.WAITING:
            return <p>Loading...</p>
        case LoadingState.NO_DEVICE:
            return (
                <div>
                    <p>No device found.</p>
                    <Button onClick={() => checkForInputs(setLoadState, setDevices)} text="Rescan" canSubmit />
                </div>
            )
        case LoadingState.SELECTING_DEVICE:
            setModalOpen(true);
            return <DeviceSelectForm/>
        case LoadingState.DEVICE_SELECTED:
            return <>
                <DeviceSelectForm/>
                <MidiContent/>
            </>;
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
    const [modalOpen, setModalOpen] = useState(false);

    const [chord, setChord] = useState<Chord>();

    const randomChord = () => {
        const chordKeys = Object.keys(chords);
        const rand = Math.floor(Math.random() * Object.keys(chords).length);
        setChord(chords[chordKeys[rand]]);
    }

    useEffect(() => {
        WebMidi
            .enable()
            .then(() => checkForInputs(setLoadState, setDevices))
            .catch(err => alert(err));
        randomChord();
    }, [])
    
    return (
        <div>
            <Head>
                <title>Sightreading Practice</title>
                <meta name="description" content="Funny Site"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="container pt-4">
                <h1 className="text-center text-5xl font-bold">
                    Sightreading Practice
                </h1>

                {chord &&
                    <div className="flex justify-center">
                        <Score
                            className="w-1/2 h-full"
                            keySignature="C"
                            staves={[
                                [{
                                    keys: chord,
                                    duration: "1",
                                }],
                            ]}
                        />
                    </div>
                }

                <MidiContextProvider value={{modalOpen, setModalOpen, loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                    <PageContent />
                </MidiContextProvider>
            </main>
        </div>
    )
}
