export default function ToggleButton(props: {
    isOn: boolean,
    callback: () => void,
    text: string,
}) {
    const {isOn, callback, text} = props;

    return (
        <button
            onClick={() => {callback()}}
            className={"duration-200 rounded-lg px-4 py-2 cursor-pointer "
                + (isOn ? "bg-green-300 hover:bg-green-400 " : "bg-gray-200 hover:bg-gray-300 ")}
        >
            {text}
        </button>
    )
}