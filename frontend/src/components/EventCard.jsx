import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

function EventCard({ title, date, location, url, tags }) {
  return (
    <div className='bg-[#2f2f2f] rounded-xl p-6 space-y-4 border border-gray-100 hover:ring-1'>
        <h2 className="text-xl font-bold text-gray-100 mb-1">{title}</h2>
        <p className="text-gray-400 text-sm mb-1">
          {new Date(date).toLocaleString(undefined, {
            weekday: 'short',
            month:'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="text-gray-100 text-sm">{location}</p>
        <div className="flex flex-wrap gap-2">
          {tags.split(',').map((tag, i) => (
            <span key={i} className="bg-blue-800/30 text-gray-100 text-xs font-medium px-3 py-1 rounded-full">{tag.trim()}</span>
          ))}
        </div>

        <a
          href={url}
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
