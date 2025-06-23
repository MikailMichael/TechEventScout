import tagColours from "../utils/tagColours";

function TagPill({ tag }) {
    const hex = tagColours[tag.trim()] || "#8B8589";
    return (
        <span style={{"--tag-colour": hex}} className={`text-xs px-2 py-1 rounded-lg tag-pill`}>{tag.trim()}</span>
    );
}

export default TagPill;