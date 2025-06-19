import tagColours from "../utils/tagColours";

function TagPill({ tag }) {
    const colourClass = tagColours[tag.trim()] || "bg-zinc-700 text-zinc-200";
    return (
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${colourClass}`}>{tag.trim()}</span>
    );
}

export default TagPill;