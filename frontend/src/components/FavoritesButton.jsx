import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function FavoritesButton({ }) {
  return (
    <button type="button" className="btn text-white font-bold py-2 px-4 rounded">
      <FontAwesomeIcon icon={faStar} />
    </button>
  )
}

export default FavoritesButton;