import {useContext, useEffect} from "react";
import {NoteMessageEvent, WebMidi} from "webmidi";
import {LoadingState, MidiContext} from "../util/MidiContext";

export default function MidiContent() {
    const {setLoadState, deviceId, setDeviceId, notes, setNotes} = useContext(MidiContext);

    useEffect(() => {
        const midi = WebMidi.getInputById(deviceId);
        if (typeof midi === "undefined") {  // in case MIDI device suddenly disconnects
            setDeviceId("");
            setLoadState(LoadingState.SELECTING_DEVICE);
        } else {
            const callback = (e: NoteMessageEvent) => {
                if (!notes.includes(e.note.identifier)) {
                    setNotes((prevState) => [
                        ...prevState, e.note.identifier
                    ]);
                }
            }
            midi.channels.forEach(channel => channel.addListener("noteon", callback));
            return () => {
                midi.channels.forEach(channel => channel.removeListener("noteon", callback));
            }
        }
    }, [deviceId, notes, setDeviceId, setLoadState, setNotes])

    return <div>
        {/* <h2 className="text-center text-3xl font-bold">Notes</h2>
        <ul>{notes.map((note, idx) => <li key={idx}>{note}</li>)}</ul> */}
    </div>
}