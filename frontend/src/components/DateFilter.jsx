const OPTIONS = [
  ["all", "All Dates"],
  ["today", "Today"],
  ["week", "This Week"],
  ["month", "This Month"]
];

function DateFilter({ selected, onChange }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Date</h3>
      <ul className="space-y-1">
        {OPTIONS.map(([value, label]) => (
          <li key={value}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${selected === value
                  ? "bg-gradient-to-br from-grad-purp-start to-grad-purp-end text-white"
                  : "hover:bg-gray-800"
                }`}
              onClick={() => onChange(value)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DateFilter;