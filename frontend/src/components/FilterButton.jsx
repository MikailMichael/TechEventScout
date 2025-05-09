import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

function FilterButton({ }) {
  return (
    <button type="button" className="btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <FontAwesomeIcon icon={faFilter} />
    </button>
  )
}

export default FilterButton;