import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css'
import EventCard from './EventCard';
import FilterButton from './FilterButton';
import SearchBar from './SearchBar';
import useHighlight from '../hooks/useHighlight';
import FavoritesButton from './FavoritesButton';
import FilterModal from './FilterModal';
import Pagination from './Pagination';
import Auth from './Auth';
import FavouritesModal from './FavouritesModal';
import { toast } from 'react-hot-toast';


function Home() {
  const [allEvents, setAllEvents] = useState([]); // All events, caches all the events, prevents excessive backend calls
  const [events, setEvents] = useState([]); // Current list of tech events, function to update, initializes as an empty array
  const [searchTerm, setSearchTerm] = useState(""); // Tracks user input
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [activeMatchAll, setActiveMatchAll] = useState(false);
  const [highlightReady, setHighlightReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showExpired, setShowExpired] = useState(false);
  const prevUserIdRef = useRef(null);
  const navigate = useNavigate();
  const EVENTS_PER_PAGE = 10;

  useHighlight(highlightReady ? searchTerm : '', '.grid');

  useEffect(() => {
    // Reset ready state when page changes so useHighlight doesn't fire early
    setHighlightReady(false);
  }, [currentPage]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    }
  }, []);

  // Fetch only after a user is known
  useEffect(() => {
    if (user && prevUserIdRef.current === user.id) return;

    prevUserIdRef.current = user?.id ?? "anonymous";

    const fetchEvents = async () => {
      setLoading(true);

      // Check localStorage for cache
      const cached = localStorage.getItem("cachedEvents");
      const cachedTime = localStorage.getItem("cachedEventsTimestamp");

      if (cached && cachedTime) {
        const ageInMinutes = (Date.now() - parseInt(cachedTime)) / 60000;

        if (ageInMinutes < 60) {
          // Use cached data if under 60 mins old
          const events = JSON.parse(cached);
          setEvents(events);
          setAllEvents(events);
          setLoading(false);
          return;
        }
      }

      // Fetch from Supabase if no fresh cache

      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true }).order('time', { ascending: true });
      setLoading(false);

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        // Save to state and localStorage
        setEvents(data);
        setAllEvents(data);
        localStorage.setItem("cachedEvents", JSON.stringify(data));
        localStorage.setItem("cachedEventsTimestamp", Date.now().toString());
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchFavourites = async () => {
      const { data, error } = await supabase
        .from('favourites')
        .select('event_id')
        .eq('user_id', user.id);
      if (data) {
        setFavourites(data.map(f => f.event_id));
      }
    }

    fetchFavourites();
  }, [user]);

  // Runs when currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    let filtered = [...allEvents];

    // Apply location filter
    if (currentLocation) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase() === currentLocation.toLowerCase()
      );
    }

    // Apply tags filter
    if (currentTags.length > 0) {
      filtered = filtered.filter(event => {
        const eventTags = event.tags.map(t => t.toLowerCase());
        if (activeMatchAll) {
          return currentTags.every(tag => eventTags.includes(tag.toLowerCase()));
        } else {
          return currentTags.some(tag => eventTags.includes(tag.toLowerCase()));
        }
      });
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(lower) ||
        event.location.toLowerCase().includes(lower) ||
        event.tags.some(tag => tag.toLowerCase().includes(lower)) ||
        event.date.toLowerCase().includes(lower)
      );
    }

    // Apply data filter
    if (!showExpired) filtered = filtered.filter(event => new Date(`${event.date}T${event.time}`) >= new Date());

    setEvents(filtered);
    setCurrentPage(1);
  }, [searchTerm, currentLocation, currentTags, activeMatchAll, allEvents, showExpired]);

  useEffect(() => {
    if (user && pendingAction?.type === 'favourite') {
      handleFavouriteToggle(pendingAction.eventId, pendingAction.title);
      setPendingAction(null);
    } else if (user && pendingAction?.type === 'favourite-modal') {
      setShowFavourites(true);
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  const handleSearch = (text) => setSearchTerm(text);

  const handleFilter = ({ location, tags, matchAll }) => {
    setCurrentLocation(location);
    setCurrentTags(tags);
    setActiveMatchAll(matchAll);
  };

  const handleFavouriteToggle = async (eventId, title) => {
    if (!user) {
      setPendingAction({ type: 'favourite', eventId, title });
      toast("Login or sign up to save favourites!", { icon: "🔐" });
      setShowAuthModal(true);
      return;
    }

    if (favourites.includes(eventId)) {
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);
      setFavourites(favourites.filter(id => id !== eventId));
      toast.success(`Removed "${title}" from favourites`);
    } else {
      await supabase
        .from('favourites')
        .insert({ user_id: user.id, event_id: eventId });
      setFavourites([...favourites, eventId]);
      toast.success(`Added "${title}" to favourites`);
    }
  };

  const handleRemoveFavourite = (eventId) => {
    setFavourites(prev => prev.filter(id => id !== eventId));
  };

  const handleAuth = async () => {
    setShowAuthModal(false);
    const { data } = await supabase.auth.getSession();
    const loggedInUser = data?.session?.user || null;
    setUser(loggedInUser);
  };

  const handleFavouritesButton = () => {
    if (!user) {
      setPendingAction({ type: 'favourite-modal' });
      toast("Login or sign up to save favourites!", { icon: "🔐" });
      setShowAuthModal(true);
      return;
    }

    setShowFavourites(true);
  };

  const handleLogOut = async () => {
    const toastId = toast.loading("Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    setFavourites([]);
    toast.dismiss(toastId);
    toast.success("Logged out successfully");
  };

  const handleShowAuth = () => {
    toast("Create an account to save your favourites!", { icon: "🔐" });
    setShowAuthModal(true);
  };

  const allLocations = [...new Set(allEvents.map(e => e.location))];
  const allTags = [...new Set(allEvents.flatMap(e => e.tags))];

  const indexOfLastEvent = currentPage * EVENTS_PER_PAGE;
  const indexOfFirstEvent = indexOfLastEvent - EVENTS_PER_PAGE;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const favouriteEventDetails = allEvents.filter(e => favourites.includes(e.id));

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);

  return (
    <div className='p-6 bg-neutral-900 mx-10'>
      <div id='banner' className='flex flex-col h-auto mb-4 border-b border-gray-100 py-4 lg:py-0 lg:h-[100px] lg:flex-row lg:items-center lg:justify-between lg:gap-4'>
        <h1 className='text-3xl font-bold mb-4 truncate text-gray-100'>London Tech Events</h1>
        <div className="flex items-center gap-4 justify-center">
          <SearchBar onSearch={handleSearch} />
          <FilterButton onClick={() => setShowModal(true)} />
          <FavoritesButton onClick={handleFavouritesButton} />
          {user ? (
            <button onClick={handleLogOut} className='text-sm text-gray-100 btn font-bold py-2 px-4 border border-gray-100 bg-neutral-800 rounded-md focus:outline-none focus:ring-2 hover:ring-1 transition'>Log out</button>
          ) : (
            <button onClick={handleShowAuth} className='text-sm text-gray-100 btn font-bold py-2 px-4 border border-gray-100 bg-neutral-800 rounded-md focus:outline-none focus:ring-2 hover:ring-1 transition'>Login / Sign up</button>
          )}
          <button
            onClick={() => setShowExpired(prev => !prev)}
            className='text-sm text-gray-100 btn font-bold py-2 px-4 border border-gray-100 bg-neutral-800 rounded-md focus:outline-none focus:ring-2 hover:ring-1 transition'
          >{showExpired ? 'Hide Past Events' : 'Show Past Events'}</button>
        </div>
      </div>

      {loading ? (
        <div className='spinner-container flex justify-center items-center py-10'>
          <div className='spinner animate-spin rounded-full h-10 w-10 border-t-4 border-gray-200' />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage} // triggers re-animation on page change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            onAnimationComplete={() => setHighlightReady(true)}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-6'>
            {currentEvents.length > 0 ? (
              currentEvents.map((event, idx) => (
                <EventCard
                  key={idx}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  link={event.link}
                  tags={event.tags.join(", ")}
                  onFavourite={handleFavouriteToggle}
                  isFavourited={favourites.includes(event.id)}
                />
              ))
            ) : (
              <div className='col-span-full text-center text-2xl font-bold text-gray-600'>
                No events found.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Filter Modal */}
      <FilterModal
        show={showModal}
        onClose={() => setShowModal(false)}
        locations={allLocations}
        tags={allTags}
        onFilter={handleFilter}
        currentLocation={currentLocation}
        currentTags={currentTags}
        activeMatchAll={activeMatchAll}
      />

      {/* Favourites Modal */}
      <FavouritesModal
        show={showFavourites}
        onClose={() => setShowFavourites(false)}
        favouriteEventIds={favourites}
        favouriteEvents={favouriteEventDetails}
        onRemoveFavourite={handleRemoveFavourite}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <Auth onAuthSuccess={handleAuth} onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  )
}

export default Home;
