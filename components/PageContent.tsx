import {useContext} from "react";
import {LoadingState, MidiContext} from "../util/MidiContext";
import Button from "./Button";
import MidiContent from "./MidiContent";
import SummaryContent from "./SummaryContent";


export default function PageContent() {
    const {setModalOpen, loadState} = useContext(MidiContext);
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
        case LoadingState.SESSION_ENDED:
            return <SummaryContent/>
    }
}