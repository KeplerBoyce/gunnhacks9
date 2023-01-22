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
    inversions: boolean,
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
    inversions: false,
}
