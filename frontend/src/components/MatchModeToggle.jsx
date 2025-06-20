import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MatchModeToggle({ matchAll, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">Tags</h3>
      <button
        onClick={onToggle}
        className="text-xs px-2 py-1 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1"
      >
        <FontAwesomeIcon icon={matchAll ? faToggleOn : faToggleOff} />
        {matchAll ? "Include All" : "Include Any"}
      </button>
    </div>
  );
}

export default MatchModeToggle;