import { useEffect, useState } from 'react'; 
import axios from 'axios'; // library for making HTTP requests
import './App.css'

function App() {
  const [events, setEvents] = useState([]); // Current list of tech events, function to update, initializes as an empty array

  // Runs once when component first loads
  useEffect(() => {
    axios.get("http://localhost:3001/events") // GET request to backend /events route
    .then(res => setEvents(res.data)) // success, update eventss state
    .catch(err => console.error(err)); // failure, log error
  }, []);

  return (
    <div className='p-6'>
      <h1 className='text-3x1 font-bold mb-4'>London Tech Events</h1>
      {events.map((event, idx) => (
        <div key={idx} className='mb-4 p-4 border rounded shadow'>
          <h2 className='text-xl font-semibold'>{event.title}</h2>
          <p>{new Date(event.date).toLocaleString()}</p>
          <p>{event.location}</p>
          <a href={event.url} target='_blank' className='text-blue-500'>View Event</a>
          <div className='mt-1 text-sm text-gray-600'>Tags: {event.tags.join(", ")}</div>
        </div>
      ))}
    </div>
  )
}

export default App
