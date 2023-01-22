import Head from "next/head";
import {Input, NoteMessageEvent, WebMidi} from "webmidi";
import {createContext, MouseEventHandler, useContext, useEffect, useState} from "react";
import CenteredModal from "../components/CenteredModal";
import Button from "../components/Button";

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
            <div className="flex flex-col gap-4 bg-white p-8 rounded-lg">
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
                <MidiContextProvider value={{modalOpen, setModalOpen, loadState, setLoadState, deviceId, setDeviceId, devices, setDevices, notes, setNotes}}>
                    <PageContent />
                </MidiContextProvider>
            </main>
        </div>
    )
}
