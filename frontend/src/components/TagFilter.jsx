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
          const hex = tagColours[tag] || "#8B8589";
          const isSel = selectedTags.includes(tag);

          return (
            <motion.button
              key={tag}
              onClick={() => onToggleTag(tag)}
              style={{"--tag-colour": hex }}
              className={`
                text-xs px-2 py-1 rounded-lg tag-button
                ${isSel
                  ? `font-semibold selected`
                  : ""
                }`}
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