function EventCard({ title, date, location, url, tags }) {
  return (
    <div className='bg-white rounded-lg shadow p-4 m-4'>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600">{date}</p>
        <p className="text-gray-600">{location}</p>
        <p className="text-gray-600">{url}</p>
        <p className="text-gray-600">{tags}</p>
    </div>
  )
}

export default EventCard;
