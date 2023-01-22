import Head from "next/head";
import {Input, NoteMessageEvent, WebMidi} from "webmidi";
import {createContext, MouseEventHandler, useContext, useEffect, useState} from "react";
import CenteredModal from "../components/CenteredModal";
import Button from "../components/Button";
import Score from "../components/Score";

type Chord = string[];

const CHORDS: {[name: string]: Chord} = {
    A: ["a/4", "c/5", "e/5"],
    B: ["b/4", "d#/5", "f#/5"],
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
    b: ["b/4", "d/5", "f#/5"],
    c: ["c/4", "eb/4", "g/4"],
    d: ["d/4", "f/4", "a/4"],
    e: ["e/4", "g/4", "b/4"],
    f: ["f/4", "ab/4", "c/5"],
    g: ["g/4", "bb/4", "d/5"],
    ab: ["ab/4", "cb/5", "eb/5"],
    bb: ["bb/4", "db/5", "f/5"],
    eb: ["eb/4", "gb/4", "bb/4"],
    as: ["a#/4", "c#/5", "e#/5"],
    cs: ["c#/4", "e/4", "g#/4"],
    ds: ["d#/4", "f#/4", "a#/4"],
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
        {/* <h2 className="text-center text-3xl font-bold">Notes</h2>
        <ul>{notes.map((note, idx) => <li key={idx}>{note}</li>)}</ul> */}
    </div>
}

function DeviceSelectForm() {
    const {modalOpen, setModalOpen, devices, setLoadState, setDevices, deviceId, setDeviceId} = useContext(MidiContext);
    // console.log("Devices:")
    // console.log(devices)

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
                <Button
                    onClick={() => handleSubmit()}
                    text="Select"
                    canSubmit={!!deviceId}
                />
                <Button
                    onClick={() => checkForInputs(setLoadState, setDevices)}
                    text="Rescan"
                    canSubmit
                />
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
            return <>
                <p>No device found.</p>
                <Button
                    onClick={() => checkForInputs(setLoadState, setDevices)}
                    text="Rescan"
                    canSubmit
                />
            </>
        case LoadingState.SELECTING_DEVICE:
            return <>
                <Button
                    onClick={() => setModalOpen(true)}
                    text="Select MIDI device"
                    canSubmit
                    className="mt-4 text-xl"
                />
                <DeviceSelectForm/>
            </>
        case LoadingState.DEVICE_SELECTED:
            return <>
                <DeviceSelectForm/>
                <MidiContent/>
            </>
    }
}

function checkForInputs(setLoadState: LoadStateSetter, setDevices: DevicesSetter) {
    // console.log("Inputs:")
    // console.log(WebMidi.inputs)
    // Display available MIDI input devices

    if (WebMidi.inputs.length >= 1) setLoadState(LoadingState.SELECTING_DEVICE);
    else setLoadState(LoadingState.NO_DEVICE);

    setDevices(WebMidi.inputs.slice()); // use a copy so that the references are different and a rerender is triggered
}

export default function Midi() {
    const [loadState, setLoadState] = useState(LoadingState.WAITING);
    const [devices, setDevices] = useState<DeviceInput[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [deviceId, setDeviceId] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [chord, setChord] = useState<Chord>();
    const [successes, setSuccesses] = useState(0);
    const [total, setTotal] = useState(0);

    const newRandomChord = () => {
        const chordKeys = Object.keys(CHORDS);
        const rand = Math.floor(Math.random() * Object.keys(CHORDS).length);
        setChord(CHORDS[chordKeys[rand]]);
        setNotes([]);
    }

    useEffect(() => {
        WebMidi
            .enable()
            .then(() => checkForInputs(setLoadState, setDevices))
            .catch(err => alert(err));
        newRandomChord();
    }, [])

    // generate new chord after connecting MIDI device
    useEffect(() => {
        if (deviceId && !modalOpen) {
            newRandomChord();
        }
    }, [modalOpen]);

    const adjustNote = (note: string) => {
        switch (note) {
            case "ab/4":
            case "Ab4":
                return "G#4";
            case "bb/4":
            case "Bb4":
                return "A#4";
            case "cb/4":
                return "B3";
            case "db/4":
            case "Db4":
                return "C#4";
            case "eb/4":
            case "Eb4":
                return "D#4";
            case "fb/4":
                return "E4";
            case "gb/4":
            case "Gb4":
                return "F#4";
            case "cb/5":
                return "B4";
            case "db/5":
            case "Db5":
                return "C#5";
            case "eb/5":
            case "Eb5":
                return "D#5";
            default:
                return note[0].toUpperCase() + note.slice(1).split("/").join("");
        }
    }

    useEffect(() => {
        if (!chord) return;
        let adjustedChord = chord.map(note => adjustNote(note));
        notes.forEach(note => {
            if (!adjustedChord.includes(adjustNote(note))) {
                console.log(adjustNote(note), adjustedChord)
                setTotal(total + 1);
                newRandomChord();
            }
        });
        if (adjustedChord.every(note => notes.includes(adjustNote(note)))) {
            setSuccesses(successes + 1);
            setTotal(total + 1);
            newRandomChord();
        }
    }, [notes]);
    
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

                <div className="flex justify-center gap-4 text-xl">
                    <p>{successes}/{total}</p>
                    <p>{isNaN(successes/total) ? "0%" : Math.round(100 * successes/total)}%</p>
                </div>

                <div className="flex justify-center">
                    <MidiContextProvider value={{modalOpen, setModalOpen, loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                        <PageContent />
                    </MidiContextProvider>
                </div>
            </main>
        </div>
    )
}
