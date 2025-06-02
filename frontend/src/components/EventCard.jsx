import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import tagColours from "../utils/tagColours";

function EventCard({ id, title, date, time, location, link, tags, onFavourite, isFavourited }) {
  return (
    <div className='relative bg-neutral-800 rounded-xl p-6 border border-gray-100 hover:ring-1 transition'>

      {/* Favorite Button */}
      <button
        onClick={() => onFavourite(id)}
        className="absolute bottom-4 right-4 text-yellow-400 hover:text-yellow-300"
        title="Save to favourites"
      >
        <FontAwesomeIcon icon={isFavourited ? solidStar : regularStar} />
      </button>

      <h2 className="text-xl font-bold text-gray-100 mb-1">{title}</h2>
      <p className="text-gray-400 text-sm mb-1">
        {new Date(`${date}T${time}`).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      <p className="text-gray-100 text-sm mb-2">{location}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.split(',').map((tag, i) => {
          const colorClass = tagColours[tag.trim()] || 'bg-zinc-700 text-zinc-200';
          return (
            <span key={i} className={`text-sm font-medium px-3 py-1 rounded-full ${colorClass}`}>{tag.trim()}</span>
          );
        })}
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
      >
        Link to event
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-2 h-4 w-4" />
      </a>
    </div>
  )
}

export default EventCard;
