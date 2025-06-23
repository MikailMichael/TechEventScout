import { useState } from "react";
import bookmark from "../assets/bookmark-colour.png";
import bookmarkHover from "../assets/bookmark-colour-hover.png";
import bookmarkActive from "../assets/bookmark-colour-active.png";

function BookmarkButton({ isFavourited, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  let iconSrc;
  if (isFavourited) iconSrc = bookmarkActive;
  else if (isHovered) iconSrc = bookmarkHover;
  else iconSrc = bookmark;

  return (
    <button 
      onClick={onClick} 
      className='text-xl' 
      title={isFavourited ? "Remove from bookmarks" : "Save to bookmarks"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={iconSrc} alt="Bookmark icon" className="h-6 w-auto" />
    </button>
  )
}

export default BookmarkButton;