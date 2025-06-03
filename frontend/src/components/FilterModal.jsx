import { useState } from 'react';

function FilterModal({ show, onClose, locations, tags, onFilter }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [matchAllTags, setMatchAllTags] = useState(false);

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

        {/* Toggle Switch */}
        <div className='flex items-center gap-2 mb-4'>
          <label className='text-neutral-900 font-semibold'>Match All Tags</label>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only-peer'
              checked={matchAllTags}
              onChange={() => setMatchAllTags(prev => !prev)}
            />
            <div className='w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-neutral-700 relative transition-colors'>
              <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform'></div>
            </div>

            <span className="text-sm text-neutral-600 italic">
              {matchAllTags ? 'Filtering: All tags must match' : 'Filtering: Any tag can match'}
            </span>
          </label>
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