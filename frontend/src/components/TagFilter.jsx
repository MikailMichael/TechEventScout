import { motion } from "framer-motion";
import tagColours from "../utils/tagColours";
import MatchModeToggle from "./MatchModeToggle";

function TagFilter({ tags, selectedTags, matchAll, onToggleTag, onMatchModeToggle }) {
  return (
    <div className="space-y-3 p-4.5 bg-background-2 rounded-lg">
      <MatchModeToggle matchAll={matchAll} onToggle={onMatchModeToggle} />
      <div className="text-sm italic text-gray-400">
        {matchAll ? "Must match all tags" : "Match any tag"}
      </div>
      <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
        {tags.map((tag) => {
          const isSel = selectedTags.includes(tag);
          const base  = tagColours[tag] || "bg-gray-700 text-gray-200";
          return (
            <motion.button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`
                text-xs px-2 py-1 rounded-full border
                ${isSel
                  ? `${base.replace("text-", "text-white ")}`
                  : "border-gray-500 text-gray-300"
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default TagFilter;