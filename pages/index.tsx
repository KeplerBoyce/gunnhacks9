import Head from "next/head";
import {Input, NoteMessageEvent, WebMidi} from "webmidi";
import {createContext, useContext, useEffect, useState} from "react";
import CenteredModal from "../components/CenteredModal";
import Button from "../components/Button";
import Score from "../components/Score";
import OptionsModal from "../components/OptionsModal";
import {defaultClefs, defaultKeys, defaultNoteTypes} from "../util/types";
import Soundfont from "soundfont-player"

type Chord = string[];

const CHORDS: { [name: string]: Chord } = {
    A: ["a/4", "c/5", "e/5"],
    B: ["b/4", "d#/5", "f#/5"],
    C: ["c/4", "e/4", "g/4"],
    D: ["d/4", "f#/4", "a/4"],
    E: ["e/4", "g#/4", "b/4"],
    F: ["f/4", "a/4", "c/5"],
    G: ["g/4", "b/4", "d/5"],
    Ab: ["ab/4", "c/5", "eb/5"],
    Bb: ["bb/4", "d/5", "f/5"],
    Cb: ["cb/5", "eb/5", "gb/5"],
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
    WAITING, SELECTING_DEVICE, DEVICE_SELECTED
}

type AllProps = {
    modalOpen: boolean, setModalOpen: (x: boolean) => void,
    loadState: LoadingState, setLoadState: LoadStateSetter,
    deviceId: string, setDeviceId: (x: string) => void
    devices: DeviceInput[], setDevices: DevicesSetter,
    notes: Note[], setNotes: NoteSetter,
}

const MidiContext = createContext<AllProps>({
    modalOpen: true, setModalOpen: () => {},
    loadState: LoadingState.WAITING, setLoadState(): void {},
    deviceId: "", setDeviceId(): void {},
    devices: [], setDevices(): void {},
    notes: [], setNotes: () => {},
});
const MidiContextProvider = MidiContext.Provider;

function MidiContent() {
    const {deviceId, notes, setNotes} = useContext(MidiContext);

    useEffect(() => {
        const midi = WebMidi.getInputById(deviceId)
        const callback = (e: NoteMessageEvent) => {
            if (!notes.includes(e.note.identifier)) {
                setNotes((prevState) => [
                    ...prevState, e.note.identifier
                ]);
            }
        }
        midi.channels.forEach(channel => channel.addListener("noteon", callback));
        return () => {
            midi.channels.forEach(channel => channel.removeListener("noteon", callback));
        }
    }, [deviceId, notes, setNotes])

    return <div>
        {/* <h2 className="text-center text-3xl font-bold">Notes</h2>
        <ul>{notes.map((note, idx) => <li key={idx}>{note}</li>)}</ul> */}
    </div>
}

function DeviceSelectForm() {
    const {modalOpen, setModalOpen, devices, setLoadState, setDevices, deviceId, setDeviceId} = useContext(MidiContext);
    // console.log("Devices:")
    // console.log(devices)

    const handleSubmit = (submittedDeviceId: string) => {
        setDeviceId(submittedDeviceId);
        setLoadState(LoadingState.DEVICE_SELECTED);
        setModalOpen(false);
    }

    return (
        <CenteredModal isOpen={modalOpen} setIsOpen={setModalOpen} clickToClose={false}>
            <div className="flex flex-col gap-4 bg-white px-8 py-6 rounded-lg">
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-0 right-2 text-5xl">
                    ×
                </button>
                <h1 className="text-xl font-bold">
                    Select a MIDI device
                </h1>
                <div className="flex flex-col gap-1">
                    {devices.length > 0 && devices.map(device => (
                        <button
                            onClick={() => handleSubmit(device.id)}
                            key={device.id}
                            className="px-2 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 duration-200"
                        >
                            {device.name}
                        </button>
                    ))}
                    {devices.length == 0 && <p className="text-center">No devices found</p>}
                </div>
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
        case LoadingState.SELECTING_DEVICE:
            return <>
                <p className="text-center">No device selected</p>
                <Button
                    onClick={() => setModalOpen(true)}
                    text="Select MIDI device"
                    canSubmit
                    className="mt-4 text-xl"
                />
            </>
        case LoadingState.DEVICE_SELECTED:
            return <MidiContent/>
    }
}

function checkForInputs(setLoadState: LoadStateSetter, setDevices: DevicesSetter) {
    // console.log("Inputs:")
    // console.log(WebMidi.inputs)
    // Display available MIDI input devices

    setLoadState(LoadingState.SELECTING_DEVICE);
    setDevices(WebMidi.inputs.slice()); // use a copy so that the references are different and a rerender is triggered
}

export default function Home() {
    const [loadState, setLoadState] = useState(LoadingState.WAITING);
    const [devices, setDevices] = useState<DeviceInput[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [deviceId, setDeviceId] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);

    const [chord, setChord] = useState<Chord>();
    const [successes, setSuccesses] = useState(0);
    const [total, setTotal] = useState(0);
    const [text, setText] = useState("");
    const [canInput, setCanInput] = useState(true);

    const [clefs, setClefs] = useState(defaultClefs);
    const [keys, setKeys] = useState(defaultKeys);
    const [noteTypes, setNoteTypes] = useState(defaultNoteTypes);
    const [nextClef, setNextClef] = useState("treble");
    const [nextKey, setNextKey] = useState("C");

    const newRandomChord = () => {
        const chordKeys = Object.keys(CHORDS);
        const rand = Math.floor(Math.random() * Object.keys(CHORDS).length);
        let tempChord = CHORDS[chordKeys[rand]];
        if (nextClef === "bass") {
            tempChord = tempChord.map(note =>
                note.slice(0, note.length - 1) + (parseInt(note.slice(note.length - 1)) - 2)
            );
        }
        setChord(tempChord);
        setNotes([]);
    }

    const newRandomClef = () => {
        const chosenClefs = Object.entries(clefs)
            .filter(([k, v]) => !!v)
            .map(([k, v]) => k);
        setNextClef(chosenClefs[Math.floor(Math.random() * chosenClefs.length)]);
    }

    const newRandomKey = () => {
        const chosenKeys = Object.entries(keys)
            .filter(([k, v]) => !!v)
            .map(([k, v]) => k);
        setNextKey(chosenKeys[Math.floor(Math.random() * chosenKeys.length)]);
    }

    useEffect(() => {
        WebMidi
            .enable()
            .then(() => checkForInputs(setLoadState, setDevices))
            .catch(err => alert(err));
        newRandomChord();
        Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano', {gain: 600}).then(function (piano) {
            window.navigator.requestMIDIAccess().then(function (midiAccess) {
                midiAccess.inputs.forEach(function (midiInput) {
                    piano.listenToMidi(midiInput)
                })
            })
        })
    }, [])

    // generate new chord after connecting MIDI device
    useEffect(() => {
        if (deviceId && !modalOpen) {
            newRandomChord();
        }
    }, [deviceId, modalOpen]);

    const adjustNote = (note: string) => {
        switch (note) {
            case "ab/2":
            case "AB2":
                return "G#2";
            case "bb/2":
            case "Bb2":
                return "A#2";
            case "B#/2":
            case "B#2":
                return "C3";
            case "db/2":
            case "Db2":
                return "C#2";
            case "eb/2":
            case "Eb2":
                return "D#2";
            case "fb/2":
                return "E2";
            case "e#/2":
            case "E#2":
                return "F2";
            case "gb/2":
            case "Gb2":
                return "F#2";
            case "ab/3":
            case "AB3":
                return "G#3";
            case "bb/3":
            case "Bb3":
                return "A#3";
            case "B#/3":
            case "B#3":
                return "C4";
            case "db/3":
            case "Db3":
                return "C#3";
            case "eb/3":
            case "Eb3":
                return "D#3";
            case "fb/3":
                return "E3";
            case "e#/3":
            case "E#3":
                return "F3";
            case "gb/3":
            case "Gb3":
                return "F#3";
            case "ab/4":
            case "Ab4":
                return "G#4";
            case "bb/4":
            case "Bb4":
                return "A#4";
            case "B#/4":
            case "B#4":
                return "C5";
            case "db/4":
            case "Db4":
                return "C#4";
            case "eb/4":
            case "Eb4":
                return "D#4";
            case "fb/4":
                return "E4";
            case "e#/4":
            case "E#4":
                return "F4";
            case "gb/4":
            case "Gb4":
                return "F#4";
            case "cb/5":
                return "B4";
            case "ab/5":
            case "Ab5":
                return "G#5";
            case "B#/5":
            case "B#5":
                return "C6";
            case "db/5":
            case "Db5":
                return "C#5";
            case "eb/5":
            case "Eb5":
                return "D#5";
            case "fb/5":
            case "Fb5":
                return "E5";
            case "e#/5":
            case "E#5":
                return "F5";
            case "gb/5":
            case "Gb5":
                return "F#5";
            default:
                return note[0].toUpperCase() + note.slice(1).split("/").join("");
        }
    }

    const checkFlats = (note: string) => {
        let str = note.slice(1).split("");
        str.splice(note.slice(1).length - 1, 0, "/");
        let str2 = note[0].toLowerCase() + str.join("");
        if (!chord) return str2;
        let str3 = "";
        switch (str2) {
            case "a#/4":
                str3 = "bb/4";
                break;
            case "b/4":
                str3 = "cb/5";
                break;
            case "b#/4":
                str3 = "c/5";
                break;
            case "c#/4":
                str3 = "db/4";
                break;
            case "d#/4":
                str3 = "eb/4";
                break;
            case "e/4":
                str3 = "fb/4";
                break;
            case "e#/4":
                str3 = "f/4";
                break;
            case "f/4":
                str3 = "e#/4";
                break;
            case "f#/4":
                str3 = "gb/4";
                break;
            case "g#/4":
                str3 = "ab/4";
                break;
            case "a#/5":
                str3 = "bb/5";
                break;
            case "b/5":
                str3 = "cb/6";
                break;
            case "b#/5":
                str3 = "c/6";
                break;
            case "c/5":
                str3 = "b#/5";
                break;
            case "c#/5":
                str3 = "db/5";
                break;
            case "d#/5":
                str3 = "eb/5";
                break;
            case "e/5":
                str3 = "fb/5";
                break;
            case "e#/5":
                str3 = "f/5";
                break;
            case "f/5":
                str3 = "e#/5";
                break;
            case "f#/5":
                str3 = "gb/5";
                break;
            case "c/6":
                str3 = "b#/5";
                break;
        }
        if (chord.includes(str3)) {
            return str3;
        }
        return str2;
    }

    useEffect(() => {
        if (!chord || !canInput) return;
        let adjustedChord = chord.map(note => adjustNote(note));
        notes.forEach(note => {
            if (!adjustedChord.includes(adjustNote(note))) {// incorrect
                newRandomClef();
                newRandomKey();
                setCanInput(false);
                setTotal(total + 1);
                setText("Incorrect...");
                setTimeout(() => {// 1s delay before continuing
                    newRandomChord();
                    setText("");
                    setCanInput(true);
                }, 1000);
            }
        });
        if (adjustedChord.every(note => notes.includes(adjustNote(note)))) {// correct
            newRandomClef();
            newRandomKey();
            setCanInput(false);
            setSuccesses(successes + 1);
            setTotal(total + 1);
            setText("Correct!");
            setTimeout(() => {// 1s delay before continuing
                newRandomChord();
                setText("");
                setCanInput(true);
            }, 1000);
        }
    }, [canInput, chord, newRandomKey, notes, successes, total]);

    return (
        <div>
            <Head>
                <title>Sightreading Practice</title>
                <meta name="description" content="Sightreading Practice"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="container pt-8 flex flex-col gap-2 items-center">
                <h1 className="text-center text-5xl font-bold">
                    Sightreading Practice
                </h1>

                <Button
                    onClick={() => setOptionsOpen(true)}
                    text="Options"
                    canSubmit
                    className="mt-4"
                />

                {chord &&
                    <Score
                        className="w-1/2 h-full"
                        clef={nextClef}
                        keySignature={nextKey}
                        staves={notes.length === 0 ? [
                            [{
                                keys: chord,
                                duration: "1",
                            }],
                        ] : [
                            [{
                                keys: chord,
                                duration: "1",
                            }],
                            [{
                                keys: notes.map(checkFlats),
                                duration: "1",
                            }],
                        ]}
                    />
                }

                <div className="flex justify-center gap-4 text-xl">
                    <p>{successes}/{total}</p>
                    <p>{isNaN(successes / total) ? "0" : Math.round(100 * successes / total)}%</p>
                </div>

                <p className="text-xl">
                    {text}
                </p>

                <div className="flex flex-col justify-center">
                    <MidiContextProvider value={{modalOpen, setModalOpen, loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                        <PageContent />
                        <DeviceSelectForm />
                    </MidiContextProvider>
                </div>

                <OptionsModal
                    isOpen={optionsOpen}
                    setIsOpen={setOptionsOpen}
                    clefs={clefs}
                    setClefs={setClefs}
                    keys={keys}
                    setKeys={setKeys}
                    noteTypes={noteTypes}
                    setNoteTypes={setNoteTypes}
                />
            </main>
        </div>
    )
}
