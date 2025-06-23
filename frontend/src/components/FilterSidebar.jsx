import { useState, useEffect, act } from 'react';
import tagColours from "../utils/tagColours";
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import LocationFilter from "./LocationFilter";
import DateFilter from "./DateFilter";
import TagFilter from "./TagFilter";

function FilterSidebar({ locations, tags, currentLocation, currentTags, currentDate, matchAll, onLocationChange, onDateChange, onTagToggle, onMatchModeToggle }) {
  return (
    <aside className='w-70 flex-shrink-0 space-y-6 text-white'>
      {/* Location */}
      <LocationFilter locations={locations} selected={currentLocation} onChange={onLocationChange} />

      {/* Date */}
      <DateFilter selected={currentDate} onChange={onDateChange} />

      {/* Tags & match mode */}
      <TagFilter tags={tags} selectedTags={currentTags} matchAll={matchAll} onToggleTag={onTagToggle} onMatchModeToggle={onMatchModeToggle} />
    </aside>
  );
}

export default FilterSidebar;