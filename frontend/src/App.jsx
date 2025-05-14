import { useEffect, useState } from 'react';
import axios from 'axios'; // library for making HTTP requests
import './App.css'
import EventCard from './components/EventCard';
import FilterButton from './components/FilterButton';
import SearchBar from './components/SearchBar';
import useHighlight from './hooks/useHighlight';
import FavoritesButton from './components/FavoritesButton';
import FilterModal from './components/FilterModal';


function App() {
  const [allEvents, setAllEvents] = useState([]); // All events, caches all the events, prevents excessive backend calls
  const [events, setEvents] = useState([]); // Current list of tech events, function to update, initializes as an empty array
  const [searchTerm, setSearchTerm] = useState(""); // Tracks user input
  const [showModal, setShowModal] = useState(false);

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

  const handleFilter = ({ location, tag }) => {
    let filtered = [...allEvents];
    
    if(location) {
      filtered = filtered.filter(event => 
        event.locations.toLowerCase() === location.toLowerCase()
      );
    }

    if(tag) {
      filtered = filtered.filter(event =>
        event.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      );
    }
    setEvents(filtered);
  }

  const allLocations = [...new Set(allEvents.map(e => e.location))];
  const allTags = [...new Set(allEvents.flatMap(e => e.tags))];

  return (
    <div className='p-6'>
      <div id='banner' className='flex flex-col h-auto mb-4 border-b border-gray-300 py-4 lg:py-0 lg:h-[100px] lg:flex-row lg:items-center lg:justify-between lg:gap-4'>      
        <h1 className='text-3xl font-bold mb-4 truncate'>London Tech Events</h1>
        <div className="flex items-center gap-4 justify-center">
          <SearchBar onSearch={handleSearch} />
          <FilterButton onClick={() => setShowModal(true)} />
          <FavoritesButton />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
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

      {/* Filter Modal */}
      <FilterModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        locations={allLocations}
        tags={allTags}
        onFilter={handleFilter}
      />

    </div>
  )
}

export default App
