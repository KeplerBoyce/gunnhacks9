import { ChordSets, Clefs, Keys, NoteTypes } from "../util/types";
import CenteredModal from "./CenteredModal";
import ToggleButton from "./ToggleButton";
import ToggleButtonGroup from "./ToggleButtonGroup";
import Button from "./Button";

export default function OptionsModal(props: {
    isOpen: boolean,
    setIsOpen: (x: boolean) => void,
    chordSets: ChordSets,
    setChordSets: (x: ChordSets) => void,
    clefs: Clefs,
    setClefs: (x: Clefs) => void,
    keys: Keys,
    setKeys: (x: Keys) => void,
    noteTypes: NoteTypes,
    setNoteTypes: (x: NoteTypes) => void,
}) {
    const {isOpen, setIsOpen, chordSets, setChordSets, clefs, setClefs, keys, setKeys, noteTypes, setNoteTypes} = props;

    const setAllChordSets = () => {
        if (Object.values(chordSets).every(v => v)) {
            setChordSets({
                major: false,
                minor: false,
                majorSeventh: false,
                minorSeventh: false,
            });
        } else {
            setChordSets({
                major: true,
                minor: true,
                majorSeventh: true,
                minorSeventh: true,
            });
        }
    }

    const setAllClefs = () => {
        if (Object.values(clefs).every(v => v)) {
            setClefs({
                treble: false,
                bass: false,
            });
        } else {
            setClefs({
                treble: true,
                bass: true,
            });
        }
    }

    // const setAllKeys = () => {
    //     if (Object.values(keys).every(v => v)) {
    //         setKeys({
    //             C: false,
    //             G: false,
    //             D: false,
    //             A: false,
    //             E: false,
    //             B: false,
    //             Fs: false,
    //             Cs: false,
    //             F: false,
    //             Bb: false,
    //             Eb: false,
    //             Ab: false,
    //             Db: false,
    //             Gb: false,
    //             Cb: false,
    //         });
    //     } else {
    //         setKeys({
    //             C: true,
    //             G: true,
    //             D: true,
    //             A: true,
    //             E: true,
    //             B: true,
    //             Fs: true,
    //             Cs: true,
    //             F: true,
    //             Bb: true,
    //             Eb: true,
    //             Ab: true,
    //             Db: true,
    //             Gb: true,
    //             Cb: true,
    //         });
    //     }
    // }

    const setAllNoteTypes = () => {
        if (Object.values(noteTypes).every(v => v)) {
            setNoteTypes({
                single: false,
                chords: false,
                // inversions: false,
            });
        } else {
            setNoteTypes({
                single: true,
                chords: true,
                // inversions: true,
            });
        }
    }

    return (
        <CenteredModal isOpen={isOpen} setIsOpen={setIsOpen} clickToClose>
            <div className="bg-white px-8 py-6 rounded-lg flex flex-col gap-6 w-1/3">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-5 text-5xl">
                    ×
                </button>
                <h1 className="text-xl font-bold">
                    Options
                </h1>
                <ToggleButtonGroup
                    title="All chord types"
                    isOn={Object.values(chordSets).every(v => v)}
                    callback={setAllChordSets}
                >
                    <ToggleButton
                        isOn={chordSets.major}
                        callback={() => setChordSets({...chordSets, major: !chordSets.major})}
                        text="Major"
                    />
                    <ToggleButton
                        isOn={chordSets.minor}
                        callback={() => setChordSets({...chordSets, minor: !chordSets.minor})}
                        text="Minor"
                    />
                    <ToggleButton
                        isOn={chordSets.majorSeventh}
                        callback={() => setChordSets({...chordSets, majorSeventh: !chordSets.majorSeventh})}
                        text="Major Seventh"
                    />
                    <ToggleButton
                        isOn={chordSets.minorSeventh}
                        callback={() => setChordSets({...chordSets, minorSeventh: !chordSets.minorSeventh})}
                        text="Minor Seventh"
                    />
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    title="All clefs"
                    isOn={Object.values(clefs).every(v => v)}
                    callback={setAllClefs}
                >
                    <ToggleButton
                        isOn={clefs.treble}
                        callback={() => setClefs({...clefs, treble: !clefs.treble})}
                        text="Treble"
                    />
                    <ToggleButton
                        isOn={clefs.bass}
                        callback={() => setClefs({...clefs, bass: !clefs.bass})}
                        text="Bass"
                    />
                </ToggleButtonGroup>
                {/* <ToggleButtonGroup
                    title="All keys"
                    isOn={Object.values(keys).every(v => v)}
                    callback={setAllKeys}
                >
                    <ToggleButton
                        isOn={keys.C}
                        callback={() => setKeys({...keys, C: !keys.C})}
                        text="C"
                    />
                    <ToggleButton
                        isOn={keys.G}
                        callback={() => setKeys({...keys, G: !keys.G})}
                        text="G"
                    />
                    <ToggleButton
                        isOn={keys.D}
                        callback={() => setKeys({...keys, D: !keys.D})}
                        text="D"
                    />
                    <ToggleButton
                        isOn={keys.A}
                        callback={() => setKeys({...keys, A: !keys.A})}
                        text="A"
                    />
                    <ToggleButton
                        isOn={keys.E}
                        callback={() => setKeys({...keys, E: !keys.E})}
                        text="E"
                    />
                    <ToggleButton
                        isOn={keys.B}
                        callback={() => setKeys({...keys, B: !keys.B})}
                        text="B"
                    />
                    <ToggleButton
                        isOn={keys.Fs}
                        callback={() => setKeys({...keys, Fs: !keys.Fs})}
                        text="F#"
                    />
                    <ToggleButton
                        isOn={keys.Cs}
                        callback={() => setKeys({...keys, Cs: !keys.Cs})}
                        text="C#"
                    />
                    <ToggleButton
                        isOn={keys.F}
                        callback={() => setKeys({...keys, F: !keys.F})}
                        text="F"
                    />
                    <ToggleButton
                        isOn={keys.Bb}
                        callback={() => setKeys({...keys, Bb: !keys.Bb})}
                        text="Bb"
                    />
                    <ToggleButton
                        isOn={keys.Eb}
                        callback={() => setKeys({...keys, Eb: !keys.Eb})}
                        text="Eb"
                    />
                    <ToggleButton
                        isOn={keys.Ab}
                        callback={() => setKeys({...keys, Ab: !keys.Ab})}
                        text="Ab"
                    />
                    <ToggleButton
                        isOn={keys.Db}
                        callback={() => setKeys({...keys, Db: !keys.Db})}
                        text="Db"
                    />
                    <ToggleButton
                        isOn={keys.Gb}
                        callback={() => setKeys({...keys, Gb: !keys.Gb})}
                        text="Gb"
                    />
                    <ToggleButton
                        isOn={keys.Cb}
                        callback={() => setKeys({...keys, Cb: !keys.Cb})}
                        text="Cb"
                    />
                </ToggleButtonGroup> */}
                <ToggleButtonGroup
                    title="All note types"
                    isOn={Object.values(noteTypes).every(v => v)}
                    callback={setAllNoteTypes}
                >
                    <ToggleButton
                        isOn={noteTypes.single}
                        callback={() => setNoteTypes({...noteTypes, single: !noteTypes.single})}
                        text="Single"
                    />
                    <ToggleButton
                        isOn={noteTypes.chords}
                        callback={() => setNoteTypes({...noteTypes, chords: !noteTypes.chords})}
                        text="Chords"
                    />
                    {/* <ToggleButton
                        isOn={noteTypes.inversions}
                        callback={() => setNoteTypes({...noteTypes, inversions: !noteTypes.inversions})}
                        text="Chords + Inversions"
                    /> */}
                </ToggleButtonGroup>

                <Button text="Save and Close" onClick={() => setIsOpen(false)} canSubmit={true}/>
            </div>
        </CenteredModal>
    )
}