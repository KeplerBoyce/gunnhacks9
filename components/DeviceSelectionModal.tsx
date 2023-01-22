import Button from "./Button";
import CenteredModal from "./CenteredModal";
import {useContext} from "react";
import {WebMidi} from "webmidi";
import {LoadingState, MidiContext} from "../util/MidiContext";

export default function DeviceSelectionModal(props: {isOpen: boolean, setIsOpen: (x: boolean) => void}) {
    const {devices, setDevices, setDeviceId, setLoadState, setModalOpen} = useContext(MidiContext)
    const handleSubmit = (submittedDeviceId: string) => {
        setDeviceId(submittedDeviceId);
        setLoadState(LoadingState.DEVICE_SELECTED);
        setModalOpen(false);
    }

    return (
        <CenteredModal isOpen={props.isOpen} setIsOpen={props.setIsOpen} clickToClose={true}>
            <div className="flex flex-col gap-4 bg-white px-8 py-6 rounded-lg">
                <button
                    onClick={() => props.setIsOpen(false)}
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
                            className="px-2 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-blue-400 duration-200"
                        >
                            {device.name}
                        </button>
                    ))}
                    {devices.length == 0 && <p className="text-center">No devices found</p>}
                </div>
                <Button
                    onClick={() => {
                        setLoadState(LoadingState.SELECTING_DEVICE);
                        setDevices(WebMidi.inputs.slice());
                    }}
                    text="Rescan"
                    canSubmit
                />
            </div>
        </CenteredModal>
    )
}