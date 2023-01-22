import { ReactNode } from "react";
import ToggleButton from "./ToggleButton";

export default function ToggleButtonGroup(props: {
    title: string,
    isOn: boolean,
    callback: () => void,
    children: ReactNode[],
}) {
    const {title, isOn, callback, children} = props;

    return (
        <div className="flex gap-1 flex-wrap">
            <ToggleButton isOn={isOn} callback={() => {callback()}} text={title} />
            {...children}
        </div>
    )
}