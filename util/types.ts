export type ChordSets = {
    major: boolean,
    minor: boolean,
    majorSeventh: boolean,
    minorSeventh: boolean,
}

export type Clefs = {
    treble: boolean,
    bass: boolean,
}

export type Keys = {
    C: boolean,
    G: boolean,
    D: boolean,
    A: boolean,
    E: boolean,
    B: boolean,
    Fs: boolean,
    Cs: boolean,
    F: boolean,
    Bb: boolean,
    Eb: boolean,
    Ab: boolean,
    Db: boolean,
    Gb: boolean,
    Cb: boolean,
}

export type NoteTypes = {
    single: boolean,
    chords: boolean,
    // inversions: boolean,
}

export const defaultChordSets = {
    major: true,
    minor: true,
    majorSeventh: false,
    minorSeventh: false,
}

export const defaultClefs = {
    treble: true,
    bass: false,
}

export const defaultKeys = {
    C: true,
    G: false,
    D: false,
    A: false,
    E: false,
    B: false,
    Fs: false,
    Cs: false,
    F: false,
    Bb: false,
    Eb: false,
    Ab: false,
    Db: false,
    Gb: false,
    Cb: false,
}

export const defaultNoteTypes = {
    single: false,
    chords: true,
    // inversions: false,
}

export type Note = string;

export const NOTES: Note[] = [
    "c/4", "c#/4", "db/4", "d/4", "d#/4", "eb/4", "e/4", "e#/4", "fb/4", "f/4",
    "f#/4", "g/4", "g#/4", "ab/4", "a/4", "a#/4", "bb/4", "b/4", "b#/4", "cb/5",
    "c/5", "c#/5", "db/5", "d/5", "d#/5", "eb/5", "e/5", "e#/5", "fb/5", "f/5",
    "f#/5", "g/5", "g#/5", "ab/5", "a/5", "a#/5", "bb/5", "b/5", "b#/5", "c/6",
]

export type Chord = string[];

export const CHORDS: { [q: string]: { [x: string]: Chord } } = {
    major: {
        A: ["a/4", "c#/5", "e/5"],
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
    },
    minor: {
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
    },
    majorSeventh: {
        A: ["a/4", "c#/5", "e/5", "g#/5"],
        B: ["b/4", "d#/5", "f#/5", "a#/5"],
        C: ["c/4", "e/4", "g/4", "b/4"],
        D: ["d/4", "f#/4", "a/4", "c#/5"],
        E: ["e/4", "g#/4", "b/4", "d#/5"],
        F: ["f/4", "a/4", "c/5", "e/5"],
        G: ["g/4", "b/4", "d/5", "f/5"],
        Ab: ["ab/4", "c/5", "eb/5", "g/5"],
        Bb: ["bb/4", "d/5", "f/5", "a/5"],
        Cb: ["cb/5", "eb/5", "gb/5", "bb/5"],
        Db: ["db/4", "f/4", "ab/4", "c/5"],
        Eb: ["eb/4", "g/4", "bb/4", "d/5"],
        Gb: ["gb/4", "bb/4", "db/5", "f/5"],
        Cs: ["c#/4", "e#/4", "g#/4", "b#/4"],
        Fs: ["f#/4", "a#/4", "c#/5", "e#/5"],
    },
    minorSeventh: {
        a: ["a/4", "c/5", "e/5", "g/5"],
        b: ["b/4", "d/5", "f#/5", "a/5"],
        c: ["c/4", "eb/4", "g/4", "bb/4"],
        d: ["d/4", "f/4", "a/4", "c/5"],
        e: ["e/4", "g/4", "b/4", "d/5"],
        f: ["f/4", "ab/4", "c/5", "eb/5"],
        g: ["g/4", "bb/4", "d/5", "f/5"],
        ab: ["ab/4", "cb/5", "eb/5", "gb/5"],
        bb: ["bb/4", "db/5", "f/5", "ab/5"],
        eb: ["eb/4", "gb/4", "bb/4", "db/5"],
        as: ["a#/4", "c#/5", "e#/5", "g#/5"],
        cs: ["c#/4", "e/4", "g#/4", "b/4"],
        ds: ["d#/4", "f#/4", "a#/4", "c#/5"],
        fs: ["f#/4", "a/4", "c#/5", "e/5"],
        gs: ["g#/4", "b/4", "d#/5", "f#/5"],
    },
}
