import TagPill from "./TagPill";
import BookmarkButton from "./BookmarkButton";

function EventCard({ id, title, img, description, date, time, location, link, tags, onFavourite, isFavourited }) {
  return (
    <div className='flex bg-neutral-800 rounded-xl overflow-hidden border border-gray-700 hover:ring-1 transition'>
      {/* Image */}
      {img && (
        <img
          src={img}
          alt={title}
          className="w-70 h-70 object-cover flex-shrink-0 rounded-lg"
        />
      )}

      {/* Content */}

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(`${date}T${time}`).toLocaleString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}{" • "}
            {location}
          </p>
          <p className="mt-2 text-gray-200 text-sm line-clamp-2">{description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.split(",").map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">Go to Event</a>
        </div>
      </div>

      {/* Favorite Button */}
      <div className="p-2 flex items-start">
            <BookmarkButton isFavourited={isFavourited} onClick={() => onFavourite(id, title)} />
      </div>
    </div>
  )
}

export default EventCard;
