import { useEffect, useState } from 'react';
import axios from 'axios'; // library for making HTTP requests
import './App.css'
import EventCard from './components/EventCard';
import FilterButton from './components/FilterButton';
import SearchBar from './components/SearchBar';
import useHighlight from './hooks/useHighlight';
import FavoritesButton from './components/FavoritesButton';


function App() {
  const [allEvents, setAllEvents] = useState([]); // All events, needed for when text gets deleted, or events won't reappear
  const [events, setEvents] = useState([]); // Current list of tech events, function to update, initializes as an empty array
  const [searchTerm, setSearchTerm] = useState(""); // Tracks user input

  useHighlight(searchTerm, '.grid'); // Only highlights inside cards

  // Runs once when component first loads
  useEffect(() => {
    axios.get("http://localhost:3001/events") // GET request to backend /events route
      .then(res => {
        setEvents(res.data);
        setAllEvents(res.data);
      }) // success, update events state
      .catch(err => console.error(err)); // failure, log error
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text); 
    if(!text) {
      setEvents(allEvents);
    } else {
      const lower = text.toLowerCase();
      const filtered = allEvents.filter(event => 
        event.title.toLowerCase().includes(lower) ||
        event.location.toLowerCase().includes(lower) || 
        event.tags.some(tag => tag.toLowerCase().includes(lower))
      );
      setEvents(filtered);
    }
  }

  return (
    <div className='p-6'>
      <div id='banner' className='h-[100px] flex items-center justify-between mb-4 border-b border-gray-300'>      
        <h1 className='text-3xl font-bold mb-4'>London Tech Events</h1>
        <div className="flex items-center gap-4">
          <SearchBar onSearch={handleSearch} />
          <FilterButton />
          <FavoritesButton />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
        {events.length > 0 ? (
          events.map((event, idx) => (
          <EventCard
            key={idx}
            title={event.title}
            date={event.date}
            location={event.location}
            tags={event.tags.join(", ")}
          />
        ))
        ) : (
          <div className='col-span-full text-center text-2xl font-bold text-gray-600'>
            No events found.
          </div>
        )}
      </div>

    </div>
  )
}

export default App
