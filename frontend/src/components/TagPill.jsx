import tagColours from "../utils/tagColours";

function TagPill({ tag }) {
    const colourClass = tagColours[tag.trim()] || "border-[#8B8589]";
    return (
        <span className={`text-xs px-2 py-1 rounded-lg border border-2 border-[${colourClass}]`}>{tag.trim()}</span>
    );
}

export default TagPill;