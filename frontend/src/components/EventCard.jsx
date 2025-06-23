import TagPill from "./TagPill";
import BookmarkButton from "./BookmarkButton";
import calender from "../assets/date-transparent.png";
import clock from "../assets/clock.png";
import mapPin from "../assets/map-pin.png";
import tagDark from "../assets/tag-dark.png";
import linkIcon from "../assets/link-icon.png";

function EventCard({ id, title, img, description, date, time, location, link, tags, onFavourite, isFavourited, user }) {
  const isExpired = new Date(`${date}T${time}`) < new Date();

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
      <div className="flex-1 py-4 px-5 flex flex-col justify-between items-start">
        <div className="flex space-x-2">
          <h2 className="text-white text-left">{title}</h2>
          {isExpired && (<span className="text-xs font-semibold text-red-100 bg-red-900 px-2 py-1 rounded">Expired</span>)}
        </div>
        <p className="text-neutral-400 text-sm line-clamp-2 text-left ">{description}</p>

        <div className="flex space-x-16">
          <div className="flex space-x-1 items-center">
            <img src={calender} alt="Calender icon" className="h-6 w-auto" />
            <p className="text-sm text-neutral-400">{new Date(date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short'
            })}</p>
          </div>
          <div className="flex space-x-1 items-center">
            <img src={clock} alt="Time icon" className="h-6 w-auto" />
            <p className="text-sm text-neutral-400">{time}</p>
          </div>
        </div>

        <div className="flex space-x-1 items-center">
          <img src={mapPin} alt="Map pin icon" className="h-6 w-auto" />
          <p className="text-sm text-neutral-400">{location}</p>
        </div>

        <div className="flex space-x-1 items-center">
          <img src={tagDark} alt="Tag icon" className="h-6 w-auto" />
          <p className="text-sm text-neutral-400">Tags</p>
        </div>

        <div className="flex flex-wrap gap-[5px]">
          {tags.split(",").map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        <a href={link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center space-x-1 py-1 px-2 rounded-lg text-sm bg-gradient-to-br from-grad-blue-start to-grad-blue-end hover:from-grad-blue-end hover:to-grad-blue-start">
          <img src={linkIcon} alt="Go to website icon" className="h-5 w-auto" />
          <span className="font-semibold">Go to Event</span>
        </a>
      </div>

      {/* Favorite Button */}
      <div className="pt-3 pr-3 flex items-start">
        {user && (<BookmarkButton isFavourited={isFavourited} onClick={() => onFavourite(id, title)} />)}
      </div>
    </div>
  )
}

export default EventCard;
