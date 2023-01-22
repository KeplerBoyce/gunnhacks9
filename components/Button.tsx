export default function Button(props: {text: string, onClick: () => void, canSubmit: boolean}) {
    const {text, onClick, canSubmit} = props;

    return (
        <button
            onClick={onClick}
            className={"duration-200 rounded-lg px-4 py-2 cursor-pointer "
                + (canSubmit ? "bg-blue-300 hover:bg-blue-400" : "bg-gray-200 hover:bg-gray-300")}
        >
            {text}
        </button>
    )
}