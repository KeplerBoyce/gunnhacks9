import Button from "./Button";
import CenteredModal from "./CenteredModal";
import {useContext} from "react";
import {LoadingState, MidiContext} from "../pages"
import {WebMidi} from "webmidi";

export default function DeviceSelectionModal(props: {isOpen: boolean, setIsOpen: (x: boolean) => void}) {
    const {devices, setDevices, setDeviceId, setLoadState, setModalOpen} = useContext(MidiContext)
    const handleSubmit = (submittedDeviceId: string) => {
        setDeviceId(submittedDeviceId);
        setLoadState(LoadingState.DEVICE_SELECTED);
        setModalOpen(false);
    }

    return (
        <CenteredModal isOpen={props.isOpen} setIsOpen={props.setIsOpen} clickToClose={false}>
            <div className="flex flex-col gap-4 bg-white px-8 py-6 rounded-lg">
                <h1 className="text-xl font-bold">
                    Select a MIDI device
                </h1>
                <div className="flex flex-col">
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