import Head from "next/head";
import {useEffect, useState} from "react";
import {WebMidi} from "webmidi";
import Soundfont from "soundfont-player";
import Button from "../components/Button";
import DeviceSelectionModal from "../components/DeviceSelectionModal";
import OptionsModal from "../components/OptionsModal";
import PageContent from "../components/PageContent";
import Score from "../components/Score";
import {DeviceInput, LoadingState, MidiContextProvider, Note} from "../util/MidiContext";
import {defaultClefs, defaultKeys, defaultNoteTypes} from "../util/types";

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
        setChord(CHORDS[chordKeys[rand]]);
        setNotes([]);
    }

    const newRandomKey = () => {
        const chosenKeys = Object.entries(keys)
            .filter(([k, v]) => !!v)
            .map(([k, v]) => k);
        setNextKey(chosenKeys[Math.floor(Math.random() * chosenKeys.length)]);
    }

    const [startTime, setStartTime] = useState(Date.now());

    const [realStartTime, setRealStartTime] = useState(Date.now());

    const [currentTime, setNowTime] = useState(Date.now());


    const resetTimer = () => {
        setStartTime(Date.now());
    }


    useEffect(() => {
        WebMidi
            .enable()
            .then(() => {
                setLoadState(LoadingState.SELECTING_DEVICE);
                setDevices(WebMidi.inputs.slice());
            })
            .catch(err => alert(err));
        newRandomChord();
        Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then(function (piano) {
            window.navigator.requestMIDIAccess().then(function (midiAccess) {
                midiAccess.inputs.forEach(function (midiInput) {
                  piano.listenToMidi(midiInput)
                })
              })
        })
    }, [])

    useEffect(() => {
        setRealStartTime(Date.now)
        const id = setInterval(() => {
            setNowTime(Date.now())
        }, 10)
        return () => clearInterval(id);
    }, [])

    // generate new chord after connecting MIDI device
    useEffect(() => {
        if (deviceId && !modalOpen) {
            newRandomChord();
        }
    }, [deviceId, modalOpen]);

    const adjustNote = (note: string) => {
        switch (note) {
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
                setCanInput(false);
                setTotal(total + 1);
                setText("Incorrect...");
                setTimeout(() => {// 1s delay before continuing
                    newRandomKey();
                    newRandomChord();
                    setText("");
                    setCanInput(true);
                }, 1000);
            }
        });
        if (adjustedChord.every(note => notes.includes(adjustNote(note)))) {// correct
            setCanInput(false);
            setSuccesses(successes + 1);
            setTotal(total + 1);
            setText("Correct!");
            setTimeout(() => {// 1s delay before continuing
                newRandomKey();
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
                    <p>{((currentTime - startTime)/1000).toFixed(2)}s</p>
                    <p>Mean Time: {((currentTime - realStartTime)/(1000 * (total + 1))).toFixed(2)}s</p>
                    <p>{successes}/{total}</p>
                    <p>{isNaN(successes / total) ? "0" : Math.round(100 * successes / total)}%</p>
                </div>

                <p className="text-xl">
                    {text}
                </p>

                <div className="flex flex-col justify-center">
                    <MidiContextProvider value={{modalOpen, setModalOpen, loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                        <PageContent />
                        <DeviceSelectionModal isOpen={modalOpen} setIsOpen={setModalOpen}/>
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
