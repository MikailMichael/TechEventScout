import { motion } from "framer-motion";
import tagColours from "../utils/tagColours";
import MatchModeToggle from "./MatchModeToggle";
import tag from '../assets/tag.png';

function TagFilter({ tags, selectedTags, matchAll, onToggleTag, onMatchModeToggle }) {
  return (
    <div className="space-y-3 p-4.5 bg-background-2 rounded-lg">
      <div className='flex space-x-2'>
        <img src={tag} alt="Bookmark icon" className="h-6 w-auto" />
        <h3>Tags</h3>
      </div>

      <MatchModeToggle matchAll={matchAll} onToggle={onMatchModeToggle} />
      <div className="text-xs text-neutral-400 text-left">
        Available:
      </div>
      <div className="overflow-y-auto gap-2 space-y-1 space-x-1 text-left">
        {tags.map((tag) => {
          const isSel = selectedTags.includes(tag);
          const base = tagColours[tag] || "border-[#8B8589] hover:bg-[#8B8589]";

          return (
            <motion.button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`
                text-xs px-2 py-1 rounded-lg border border-2 border-[${base}] hover:bg-[${base}]
                ${isSel
                  ? `font-semibold bg-[${base}]`
                  : ""
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