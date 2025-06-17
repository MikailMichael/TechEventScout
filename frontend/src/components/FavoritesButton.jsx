import bookmark from "../assets/bookmark.png";

function FavoritesButton({ onClick }) {
  return (
    <button onClick={onClick} type="button" className="text-white text-sm font-semibold py-1.5 px-2 gap-2 flex flex-inline items-center rounded-lg h-9 bg-gradient-to-br from-[#7C82FF] to-[#C355F5]">
      <img src={bookmark} alt="Bookmark icon" className="h-6 w-auto" />
      Bookmarks
    </button>
  )
}

export default FavoritesButton;