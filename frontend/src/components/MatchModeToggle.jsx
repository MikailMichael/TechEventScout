import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MatchModeToggle({ matchAll, onToggle }) {
  return (
    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="matchMode"
          checked={matchAll}
          onChange={() => onToggle(true)}
          className="appearance-none w-4 h-4 rounded-full 
          border border-border-gray 
          checked:bg-gradient-to-br checked:from-grad-blue-start checked:to-grad-blue-end 
          checked:border-1 checked:border-grad-blue-start checked:shadow-[inset_0_0_0_3px_background]"
        />
        <span className={`${matchAll ? "text-white" : "text-neutral-500"} text-xs`}>Include All</span>
      </label>

      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="matchMode"
          checked={!matchAll}
          onChange={() => onToggle(false)}
          className="appearance-none w-4 h-4 rounded-full 
          border border-border-gray 
          checked:bg-gradient-to-br checked:from-grad-blue-start checked:to-grad-blue-end 
          checked:border-1 checked:border-grad-blue-start checked:shadow-[inset_0_0_0_3px_background]"
        />
        <span className={`${!matchAll ? "text-white" : "text-neutral-500"} text-xs`}>Include Any</span>
      </label>
    </div>
  );
}

export default MatchModeToggle;