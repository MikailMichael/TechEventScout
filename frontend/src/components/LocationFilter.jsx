function LocationFilter({ locations, selected, onChange }) {
  return (
    <div className="space-y-2 p-4.5 bg-background-2 rounded-lg">
      <h3 className="font-semibold text-left">Locations</h3>
      <ul className="space-y-1">
        <li>
          <button
            className={`w-full text-left px-2 py-1 rounded ${selected === "" ? "bg-gradient-to-br from-grad-purp-start to-grad-purp-end text-white" : "hoverbg-gray-800"}`}
            onClick={() => onChange("")}
          >All Locations</button>
        </li>
        {locations.map((loc) => (
          <li key={loc}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${selected === loc ? "bg-gradient-to-br from-grad-purp-start to-grad-purp-end text-white" : "hoverbg-gray-800"}`}
              onClick={() => onChange(loc)}
            >{loc}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationFilter;