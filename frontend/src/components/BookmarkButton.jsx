import bookmark from "../assets/bookmark-colour.png";
import bookmarkHover from "../assets/bookmark-colour-hover.png";
import bookmarkActive from "../assets/bookmark-colour-active.png";

function BookmarkButton({ isFavourited, onClick }) {
    return (
        <button onClick={onClick} className='text-xl' title={isFavourited ? "Remove from bookmarks" : "Save to bookmarks"}>
            {isFavourited ? (
                <img src={bookmarkActive} alt="Bookmarked event" className="h-6 w-auto" />
            ) : (
                <img src={bookmark} alt="Icon to bookmark an event" className="h-6 w-auto" />
            )}
        </button>
    )
}

export default BookmarkButton;