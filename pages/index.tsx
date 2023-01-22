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
import {Chord, CHORDS, defaultChordSets, defaultClefs, defaultKeys, defaultNoteTypes} from "../util/types";

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

    const [chordSets, setChordSets] = useState(defaultChordSets);
    const [clefs, setClefs] = useState(defaultClefs);
    const [keys, setKeys] = useState(defaultKeys);
    const [noteTypes, setNoteTypes] = useState(defaultNoteTypes);
    const [nextClef, setNextClef] = useState("treble");
    const [nextKey, setNextKey] = useState("C");

    const newRandomClef = () => {
        const chosenClefs = Object.entries(clefs)
            .filter(([k, v]) => !!v)
            .map(([k, v]) => k);
        setNextClef(chosenClefs[Math.floor(Math.random() * chosenClefs.length)]);
    }

    const newRandomChord = () => {
        let selectedChords: Chord[] = [];
        Object.entries(chordSets)
            .filter(([k, v]) => !!v)
            .forEach(([k, v]) => {
                Object.values(CHORDS[k]).forEach((c) => {
                    selectedChords.push(c);
                });
            });
        const rand = Math.floor(Math.random() * selectedChords.length);
        let tempChord = selectedChords[rand];
        if (nextClef === "bass") {
            tempChord = tempChord.map(note =>
                note.slice(0, note.length - 1) + (parseInt(note.slice(note.length - 1)) - 2)
            );
        }
        setChord(tempChord);
        setNotes([]);
    }

    const newRandomKey = () => {
        const chosenKeys = Object.entries(keys)
            .filter(([k, v]) => !!v)
            .map(([k, v]) => k);
        setNextKey(chosenKeys[Math.floor(Math.random() * chosenKeys.length)]);
    }

    const TIMER_INTERVAL = 10;
    const [timerMs, setTimerMs] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timer>();
    const [meanTime, setMeanTime] = useState(NaN);
    const executeTimer = () => setTimerMs(prevState => prevState + TIMER_INTERVAL);
    const startTimer = () => setTimer(setInterval(executeTimer, TIMER_INTERVAL));
    const stopTimer = () => {
        clearInterval(timer);
        setTimer(undefined);
        setMeanTime(total >= 1 ? timerMs / total : NaN);
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
        Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano', {gain: 500}).then(function (piano) {
            window.navigator.requestMIDIAccess().then(function (midiAccess) {
                midiAccess.inputs.forEach(function (midiInput) {
                    piano.listenToMidi(midiInput)
                })
            })
        })
    }, [])

    useEffect(() => {
        newRandomChord();
    }, [nextClef]);

    // generate new chord after connecting MIDI device
    useEffect(() => {
        if (deviceId && !modalOpen) {
            newRandomChord();
        }
    }, [deviceId, modalOpen]);

    const adjustNote = (note: string) => {
        switch (note) {
            case "ab/2":
            case "Ab2":
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
                return "E3";
            case "e#/2":
            case "E#2":
                return "F2";
            case "gb/2":
            case "Gb2":
                return "F#2";
            case "cb/3":
                return "B2";
            case "ab/3":
            case "Ab3":
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
                return "E4";
            case "e#/3":
            case "E#3":
                return "F3";
            case "gb/3":
            case "Gb3":
                return "F#3";
            case "cb/4":
                return "B3";
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
            case "a#/2":
                str3 = "bb/2";
                break;
            case "b/2":
                str3 = "cb/3";
                break;
            case "b#/2":
                str3 = "c/3";
                break;
            case "c#/2":
                str3 = "db/2";
                break;
            case "d#/2":
                str3 = "eb/2";
                break;
            case "e/2":
                str3 = "fb/2";
                break;
            case "e#/2":
                str3 = "f/2";
                break;
            case "f/2":
                str3 = "e#/2";
                break;
            case "f#/2":
                str3 = "gb/2";
                break;
            case "g#/2":
                str3 = "ab/2";
                break;
            case "a#/3":
                str3 = "bb/3";
                break;
            case "b/3":
                str3 = "cb/4";
                break;
            case "b#/3":
                str3 = "c/4";
                break;
            case "c#/3":
                str3 = "db/3";
                break;
            case "d#/3":
                str3 = "eb/3";
                break;
            case "e/3":
                str3 = "fb/3";
                break;
            case "e#/3":
                str3 = "f/3";
                break;
            case "f/3":
                str3 = "e#/3";
                break;
            case "f#/3":
                str3 = "gb/3";
                break;
            case "g#/3":
                str3 = "ab/3";
                break;
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
                stopTimer();
                setTimeout(() => {// 1s delay before continuing
                    newRandomKey();
                    newRandomClef();
                    newRandomChord();
                    setText("");
                    setCanInput(true);
                    startTimer();
                }, 1000);
            }
        });
        if (adjustedChord.every(note => notes.includes(adjustNote(note)))) {// correct
            setCanInput(false);
            setSuccesses(successes + 1);
            setTotal(total + 1);
            setText("Correct!");
            stopTimer();
            setTimeout(() => {// 1s delay before continuing
                newRandomKey();
                newRandomClef();
                newRandomChord();
                setText("");
                setCanInput(true);
                startTimer();
            }, 1000);
        }
    }, [canInput, chord, newRandomKey, notes, startTimer, stopTimer, successes, total]);

    return (
        <>
            <Head>
                <title>Sightreading Practice</title>
                <meta name="description" content="Sightreading Practice"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="container pt-8 flex flex-col gap-2 items-center">
                <h1 className="text-center text-5xl font-bold">
                    Sightreading Practice
                </h1>

                {loadState !== LoadingState.SESSION_ENDED && <>
                    <Button
                        onClick={() => setOptionsOpen(true)}
                        text="Options"
                        canSubmit
                        className="mt-4"
                    />
                    <Button text="End Session" onClick={() => setLoadState(LoadingState.SESSION_ENDED)} canSubmit={true}/>

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

                    <div className="flex flex-col justify-center">
                        <MidiContextProvider value={{modalOpen, setModalOpen, loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                            <PageContent />
                            <DeviceSelectionModal isOpen={modalOpen} setIsOpen={setModalOpen}/>
                        </MidiContextProvider>
                    </div>

                    <OptionsModal
                        isOpen={optionsOpen}
                        setIsOpen={setOptionsOpen}
                        chordSets={chordSets}
                        setChordSets={setChordSets}
                        clefs={clefs}
                        setClefs={setClefs}
                        keys={keys}
                        setKeys={setKeys}
                        noteTypes={noteTypes}
                        setNoteTypes={setNoteTypes}
                    />
                </>}
            </main>
        </>
    )
}
