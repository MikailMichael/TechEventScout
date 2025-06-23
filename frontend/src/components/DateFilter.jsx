import date from '../assets/date.png';


const OPTIONS = [
  ["all", "All Dates"],
  ["today", "Today"],
  ["week", "This Week"],
  ["month", "This Month"]
];

function DateFilter({ selected, onChange }) {
  return (
    <div className="space-y-3 p-4.5 bg-background-2 rounded-lg">
      <div className='flex space-x-2'>
        <img src={date} alt="Bookmark icon" className="h-6 w-auto" />
        <h3>Date</h3>
      </div>

      <ul className="space-y-3">
        {OPTIONS.map(([value, label]) => (
          <li key={value}>
            <button
              className={`w-full text-sm font-semibold text-left px-2 py-1 rounded-lg ${selected === value
                ? "bg-gradient-to-br from-grad-blue-start to-grad-blue-end text-white"
                : "hover:bg-gradient-to-br hover:from-grad-blue-start-hover hover:to-grad-blue-end-hover"
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