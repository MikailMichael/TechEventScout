import { useEffect, useState } from 'react';
import axios from 'axios'; // library for making HTTP requests
import './App.css'
import EventCard from './components/EventCard';
import FilterButton from './components/FilterButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [allEvents, setAllEvents] = useState([]); // All events
  const [events, setEvents] = useState([]); // Current list of tech events, function to update, initializes as an empty array

  // Runs once when component first loads
  useEffect(() => {
    axios.get("http://localhost:3001/events") // GET request to backend /events route
      .then(res => {
        setEvents(res.data);
        setAllEvents(res.data);
      }) // success, update eventss state
      .catch(err => console.error(err)); // failure, log error
  }, []);

  const handleSearch = (text) => {

  }

  return (
    <div className='p-6'>

      <div id='banner' className='flex itens-center justify-between mb-4'>      
        <h1 className='text-3xl font-bold mb-4'>London Tech Events</h1>
        <FilterButton />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
        {events.map((event, idx) => (
          <EventCard
            key={idx}
            title={event.title}
            date={event.date}
            location={event.location}
            tags={event.tags.join(", ")}
          />
        ))}
      </div>

    </div>
  )
}

export default App
