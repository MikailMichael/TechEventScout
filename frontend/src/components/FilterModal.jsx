import { useState } from 'react';

function FilterModal({ show, onClose, locations, tags, onFilter }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

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
    onFilter({ location: selectedLocation, tags: selectedTags });
    onClose();
  }

  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black/75 z-50 flex items-center justify-center'>
      <div className='bg-gray-100 p-6 rounded-lg w-[90%] max-w-md shadow-lg relative'>
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
            <option value="">All Tags</option>
            {tags.filter(tag => !selectedTags.includes(tag)).map((tag, i) => (
              <option key={i} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Selected Tags Pills */}
        {selectedTags.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {selectedTags.map((tag, index) => (
              <span key={index} className='bg-neutral-300 text-neutral-900 text-sm px-2 py-1 rounded-full flex items-center gap-2'>
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className='text-neuitral-700 hover:text-neutral-900 text-xs'
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Apply Button */}
        <button onClick={handleSubmit} className='bg-neutral-700 text-white px-4 py-2 rounded hover:bg-neutral-800 w-full'>Apply Filters</button>
      </div>
    </div>
  );
}

export default FilterModal;