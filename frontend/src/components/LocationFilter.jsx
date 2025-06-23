import filter from '../assets/filter.png';

function LocationFilter({ locations, selected, onChange }) {
  return (
    <div className="space-y-3 p-4.5 bg-background-2 rounded-lg">
      <div className='flex space-x-2'>
        <img src={filter} alt="Bookmark icon" className="h-6 w-auto" />
        <h3 className="font-semibold text-left">Locations</h3>
      </div>

      <ul className="space-y-3">
        <li>
          <button
            className={`w-full text-left px-2 py-1 rounded-lg ${selected === "" ? "bg-gradient-to-br from-grad-purp-start to-grad-purp-end text-white" : "hover:bg-gray-800"}`}
            onClick={() => onChange("")}
          >
            All Locations</button>
        </li>
        {locations.map((loc) => (
          <li key={loc}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${selected === loc ? "bg-gradient-to-br from-grad-purp-start to-grad-purp-end text-white" : "hover:bg-gray-800"}`}
              onClick={() => onChange(loc)}
            >{loc}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationFilter;