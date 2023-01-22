import {useContext} from "react";
import {LoadingState, MidiContext} from "../util/MidiContext";
import Button from "./Button";


export default function SummaryContent() {
    const {setLoadState, successes, setSuccesses, total, setTotal, setTimerMs, lastAnswerTime, setLastAnswerTime} = useContext(MidiContext);
    return (
        <>
            <div className="flex flex-row text-xl">
                {
                    total > 0 &&
                    <>
                        <div className="flex flex-col m-3">
                            <h2 className="text-3xl font-semibold">Score</h2>
                            <p>{successes} correct out of {total} {(100 * successes / total).toFixed(2)}%</p>
                        </div>
                        <div className="flex flex-col m-3">
                            <h2 className="text-3xl font-semibold">Time</h2>
                            <p>You spent {(lastAnswerTime / 1000).toFixed(2)}s identifying notes.</p>
                            <p>Each answer took an average of {(lastAnswerTime / total / 1000).toFixed(2)}s each.</p>
                            {successes > 0 && <p>Each correct answer took an average of {(lastAnswerTime / successes / 1000).toFixed(2)}s each.</p>}
                            {successes === 0 && <p>You had no correct answers.</p>}
                        </div>
                    </>
                }
                {
                    total == 0 && <p>{"You didn't play anything!"}</p>
                }
            </div>
            <Button text={"Restart"} onClick={() => {
                setLoadState(LoadingState.DEVICE_SELECTED);
                setSuccesses(0);
                setTotal(0);
                setTimerMs(0);
                setLastAnswerTime(0);
            }
            } canSubmit={true}/>
        </>
    )
}