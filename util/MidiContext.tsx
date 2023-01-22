import {Input} from "webmidi";
import {createContext} from "react";


export enum LoadingState {
    WAITING, SELECTING_DEVICE, DEVICE_SELECTED, SESSION_ENDED
}

export type DeviceInput = Input;
export type Note = string;
type LoadStateSetter = (x: LoadingState) => void;
type DevicesSetter = (x: DeviceInput[]) => void;
type NoteSetter = (arg: Note[] | ((x: Note[]) => Note[])) => void;
type NumberSetter = (x: number) => void;

type AllProps = {
    modalOpen: boolean, setModalOpen: (x: boolean) => void,
    loadState: LoadingState, setLoadState: LoadStateSetter,
    deviceId: string, setDeviceId: (x: string) => void
    devices: DeviceInput[], setDevices: DevicesSetter,
    notes: Note[], setNotes: NoteSetter,
    successes: number, setSuccesses: NumberSetter,
    total: number, setTotal: NumberSetter,
    timerMs: number, setTimerMs: NumberSetter,
    lastAnswerTime: number, setLastAnswerTime: NumberSetter
}

export const MidiContext = createContext<AllProps>({
    modalOpen: true, setModalOpen: () => {},
    loadState: LoadingState.WAITING, setLoadState(): void {},
    deviceId: "", setDeviceId(): void {},
    devices: [], setDevices(): void {},
    notes: [], setNotes: () => {},
    successes: 0, setSuccesses: () => {},
    total: 0, setTotal: () => {},
    timerMs: 0, setTimerMs: () => {},
    lastAnswerTime: 0, setLastAnswerTime: () => {}
});

export const MidiContextProvider = MidiContext.Provider;