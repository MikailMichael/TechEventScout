import TagPill from "./TagPill";
import BookmarkButton from "./BookmarkButton";
import calender from "../assets/date-transparent.png";
import clock from "../assets/clock.png";

function EventCard({ id, title, img, description, date, time, location, link, tags, onFavourite, isFavourited }) {
  return (
    <div className='flex bg-background-2 rounded-lg'>
      {/* Image */}
      {img && (
        <img
          src={img}
          alt={title}
          className="w-70 h-70 object-cover flex-shrink-0 rounded-lg"
        />
      )}

      {/* Content */}
      <div className="flex-1 py-4 px-5 flex flex-col justify-between">
        <div className="space-y-2">
          <h2 className="text-white text-left">{title}</h2>
          <p className="text-neutral-400 text-sm line-clamp-2 text-left ">{description}</p>
          <div className="flex space-x-16">
            <div className="flex space-x-1 items-center">
              <img src={calender} alt="Calender icon" className="h-6 w-auto" />
              <p className="text-sm text-neutral-400">{new Date(date).toLocaleDateString('en-GB', {
                weekday:  'short',
                day:      '2-digit',
                month:    'short'
              })}</p>
            </div>
            <div className="flex space-x-1 items-center">
              <img src={clock} alt="Time icon" className="h-6 w-auto" />
              <p className="text-sm text-neutral-400">{time}</p>
            </div>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            {new Date(`${date}T${time}`).toLocaleString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}{" • "}
            {location}
          </p>

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
