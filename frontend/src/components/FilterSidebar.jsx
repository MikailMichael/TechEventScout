import { useState, useEffect, act } from 'react';
import tagColours from "../utils/tagColours";
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import LocationFilter from "./LocationFilter";
import DateFilter from "./DateFilter";
import MatchModeToggle from "./MatchModeToggle";
import TagFilter from "./TagFilter";

function FilterSidebar({ locations, tags, currentLocation, currentTags, currentDate, matchAll, onLocationChange, onDateChange, onTagToggle, onMatchModeToggle }) {
  const [loc, setLoc] = useState('');
  const [date, setDate] = useState("all");
  const [selTags, setSelTags] = useState([]);
  const [matchAll, setMatchAll] = useState(false);
  /*
  // Sync when sidebar mounts or filters change externally
  useEffect(() => {
    setLoc(currentLocation || "");
    setDate(currentDate || "all");
    setSelTags(currentTags || []);
    setMatchAll(activeMatchAll || false);
  }, [currentLocation, currentDate, currentTags, activeMatchAll]);

  // Whenever any of our local state changes, push up
  useEffect(() => {
    onFilter({ location: loc, date, tags: selTags, matchAll });
  }, [loc, date, selTags, matchAll]);

  const toggleTag = (tag) =>
    setSelTags((ts) =>
      ts.includes(tag) ? ts.filter((t) => t !== tag) : [...ts, tag]
    ); */

  return (
    <aside className='w-64 flex-shrink-0 space-y-6 p-4 bg-neutral-900 text-white rounded-lg'>
      {/* Location */}
      <LocationFilter locations={locations} selected={currentLocation} onChange={onLocationChange} />

      {/* Date */}
      <DateFilter selected={currentDate} onChange={onDateChange} />
      {/*
      <div className='space-y-2'>
        <h3 className='font-semibold'>Date</h3>
        {[
          ["all",     "All Dates"],
          ["today",   "Today"],
          ["week",    "This Week"],
          ["month",   "This Month"]
        ].map(([value, label]) => (
          <label key={value} className='flex items-center space-x-2'>
            <input 
              type='radio'
              className='form-radio'
              name="filterDate"
              value={value}
              checked={date === value}
              onChange={() => setDate(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      */}

      {/* Tags & match mode */}
      <MatchModeToggle matchAll={matchAll} onToggle={onMatchModeToggle} />
      <TagFilter tags={tags} selectedTags={currentTags} matchAll={matchAll} onToggleTag={onTagToggle} />
      {/*
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>Tags</h3>
          <button
            onClick={() => setMatchAll((m) => !m)}
            className='text-xs px-2 py-1 bg-gray-800 rounded'
          >
            {matchAll ? "Include All" : "Include Any"}
          </button>
        </div>
        <div className='max-h-64 overflow-y-auto grid-grid-cols-2 gap-2'>
          {tags.map((tag) => {
            const selected = selTags.includes(tag);
            const base = tagColours[tag] || "bg-gray-700";
            return (
              <motion.button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded-full border ${selected ? base + "text-white" : "border-gray-500 text-gray-300"}`}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>
      </div>
      */}
    </aside>
  );
}

export default FilterSidebar;