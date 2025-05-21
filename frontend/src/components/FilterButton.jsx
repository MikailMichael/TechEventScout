import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

function FilterButton({ onClick }) {
  return (
    <button onClick={onClick} type="button" className="btn text-gray-100 font-bold py-2 px-4 border border-gray-100 rounded-md focus:outline-none focus:ring-2 hover:ring-1 transition">
      <FontAwesomeIcon icon={faFilter} />
    </button>
  )
}

export default FilterButton;