import { useState, useEffect } from 'react';
import tagColours from "../utils/tagColours";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function FilterModal({ show, onClose, locations, tags, onFilter, currentLocation, currentTags, activeMatchAll }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [matchAllTags, setMatchAllTags] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  // When modal opens, sync to current filter state
  useEffect(() => {
    if (show) {
      setSelectedLocation(currentLocation || '');
      setSelectedTags(currentTags || []);
      setMatchAllTags(activeMatchAll || false);
    }
  }, [show, currentLocation, currentTags, activeMatchAll])

  const hasActiveFilters = selectedLocation || selectedTags.length > 0 || matchAllTags;

  useEffect(() => {
    let timeout;

    if (hasActiveFilters) timeout = setTimeout(() => setShowResetButton(true), 300);
    else setShowResetButton(false);

    return () => clearTimeout(timeout);
  }, [hasActiveFilters]);

  const handleTagSelect = (e) => {
    const newTag = e.target.value;
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    onFilter({ location: selectedLocation, tags: selectedTags, matchAll: matchAllTags });
    onClose();
  };

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedTags([]);
    setMatchAllTags(false);
    toast.success(`Reset Filters.`);
  };

  if (!show) return null;

  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/75 z-50 flex items-center justify-center'>
      <div onClick={(e) => e.stopPropagation()} className='bg-gray-100 p-6 rounded-lg w-[90%] max-w-md shadow-lg relative'>
        <button
          className='absolute top-2 right-2 text-neutral-900 hover:text-black'
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className='text-2xl font-semibold mb-4 text-neutral-900'>Filter Events</h2>

        {/* Location Dropdown */}
        <div className='mb-4'>
          <label className='block text-neutral-900 font-semibold mb-1'>Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className='w-full border border-neutral-900 rounded px-3 py-2 text-neutral-900'
          >
            <option value="">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Tag Selector */}
        <div className='mb-2'>
          <label className='block text-neutral-900 font-semibold mb-1'>Tag</label>
          <select
            value=""
            onChange={handleTagSelect}
            className='w-full border border-neutral-900 rounded px-3 py-2 text-neutral-900'
          >
            <option value="">Select a tag</option>
            {tags.filter(tag => !selectedTags.includes(tag)).map((tag, i) => (
              <option key={i} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Toggle Switch */}
        <div className='flex items-center gap-2 mb-4'>
          <label className='text-neutral-900 font-semibold'>Match All Tags</label>
          <label className='inline-flex items-center cursor-pointer relative'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={matchAllTags}
              onChange={() => setMatchAllTags(prev => !prev)}
            />

            <div className='w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-neutral-700 relative transition-colors'></div>
            <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5'></div>

            <span className="ml-2 text-sm text-neutral-600 italic">
              {matchAllTags ? 'Filtering: All tags must match' : 'Filtering: Any tag can match'}
            </span>
          </label>
        </div>


        {/* Selected Tags Pills */}
        {selectedTags.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {selectedTags.map((tag, index) => (
              <span key={index} className={`text-sm px-3 py-1 rounded-full font-medium ${tagColours[tag.trim()] || 'bg-zinc-700 text-zinc-200'}`}>
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className='text-gray-300 hover:text-gray-100 text-xs px-1'
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Reset Filters Button */}
        {/* Only shows if there are any active filters */}
        <AnimatePresence>
          {showResetButton && (
            <motion.button
              key='reset filters'
              onClick={handleReset}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className='text-sm text-neutral-700 hover:text-black flex items-center gap-2 mb-4'
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              Reset Filters
            </motion.button>
          )}
        </AnimatePresence>

        {/* Apply Button */}
        <button onClick={handleSubmit} className='bg-neutral-700 text-white px-4 py-2 rounded hover:bg-neutral-800 w-full'>Apply Filters</button>
      </div>
    </div>
  );
}

export default FilterModal;