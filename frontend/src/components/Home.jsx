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
import FilterSidebar from './FilterSidebar';
// import Pagination from './Pagination';
import Auth from './Auth';
import Header from './Header';
import FavouritesModal from './FavouritesModal';
import { toast } from 'react-hot-toast';
import successIcon from '../assets/toast-success.png';
import errorIcon from '../assets/toast-error.png';
import menuIcon from '../assets/menu-icon.png';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faFilter } from '@fortawesome/free-solid-svg-icons';


function Home() {
  const EVENTS_PER_PAGE = 10;
  const [allEvents, setAllEvents] = useState([]); // All events, caches all the events, prevents excessive backend calls
  const [events, setEvents] = useState([]); // Current list of tech events, function to update, initializes as an empty array
  const [searchTerm, setSearchTerm] = useState(""); // Tracks user input
  const [currentDate, setCurrentDate] = useState("all");
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const prevUserIdRef = useRef(null);
  const loaderRef = useRef(null);
  //const hasStarted = useRef(false);
  const navigate = useNavigate();

  useHighlight(highlightReady ? searchTerm : '', '.grid');

  useEffect(() => {
    // Reset ready state when page changes so useHighlight doesn't fire early
    setHighlightReady(false);
  }, [searchTerm, currentLocation, currentDate, currentTags, activeMatchAll]);

  useEffect(() => {
    /*
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });
    */

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id ?? null;
      switch (event) {
        case 'INITIAL_SESSION':
          prevUserIdRef.current = newUserId;
          break;
        case 'SIGNED_IN':
          if (prevUserIdRef.current !== newUserId) {
            toast.success('Logged in successfully!', {
              className: 'toast-success',
              icon: <img src={successIcon} alt="Success" className="h-5 w-5" />,
            })
            setShowAuthModal(false)
            setUser(session.user)
          }
          // always update our “previous” pointer
          prevUserIdRef.current = newUserId;
          break;
        case 'SIGNED_OUT':
          prevUserIdRef.current = null;
          setUser(null);
          break;
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleCount < events.length) {
        setLoadingMore(true);
        setVisibleCount((v) => Math.min(v + EVENTS_PER_PAGE, events.length));
      }
    }, { rootMargin: "200px" });

    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [loaderRef.current, visibleCount, events.length]);


  useEffect(() => {
    if (!loadingMore) return;
    const id = setTimeout(() => setLoadingMore(false), 300);
    return () => clearTimeout(id);
  }, [loadingMore]);


  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!user) return;

    // Only fetch if users favourites haven't been cached recently
    const cachedUserId = localStorage.getItem("cachedFavouritesUserId");
    const cachedFavourites = localStorage.getItem("cachedFavourites");
    const cachedTime = localStorage.getItem("cachedFavouritesTimestamp");

    if (cachedUserId === user.id && cachedFavourites && cachedTime && ((Date.now() - parseInt(cachedTime)) < 60 * 60 * 1000)) {
      setFavourites(JSON.parse(cachedFavourites));
      return;
    }

    const fetchFavourites = async () => {
      console.log("Fetching favourites for user:", user?.id);
      const { data, error } = await supabase
        .from('favourites')
        .select('event_id')
        .eq('user_id', user.id);
      if (data) {
        setFavourites(data.map(f => f.event_id));
      } else {
        console.error("Error fetching favourites:", error.message);
        return;
      }

      // Cache to localStorage
      localStorage.setItem("cachedFavourites", JSON.stringify(data.map(f => f.event_id)));
      localStorage.setItem("cachedFavouritesTimestamp", Date.now().toString());
      localStorage.setItem("cachedFavouritesUserId", user.id);
    };

    fetchFavourites();
  }, [user?.id]);

  // Runs when filters change
  /*
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, currentLocation, currentDate, currentTags, activeMatchAll]);
  */


  useEffect(() => {
    let filtered = [...allEvents];

    // Apply location filter
    if (currentLocation) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase() === currentLocation.toLowerCase()
      );
    }

    // Apply date filter
    const now = new Date();
    if (currentDate === "today") {
      filtered = filtered.filter(evt => {
        const d = new Date(`${evt.date}T${evt.time}`);
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      });
    } else if (currentDate === "week") {
      const oneWeekFromNow = new Date(now);
      oneWeekFromNow.setDate(now.getDate() + 7);
      filtered = filtered.filter(evt => {
        const d = new Date(`${evt.date}T${evt.time}`);
        return d >= now && d <= oneWeekFromNow;
      });
    } else if (currentDate === "month") {
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(now.getMonth() + 1);
      filtered = filtered.filter(evt => {
        const d = new Date(`${evt.date}T${evt.time}`);
        return d >= now && d <= oneMonthFromNow;
      });
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
    setVisibleCount(EVENTS_PER_PAGE);
  }, [searchTerm, currentLocation, currentDate, currentTags, activeMatchAll, allEvents, showExpired]);

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
      toast.success(`Removed "${title}" from favourites`, { className: "toast-success", icon: <img src={successIcon} alt="Success" className="h-5 w-5" /> });
    } else {
      await supabase
        .from('favourites')
        .insert({ user_id: user.id, event_id: eventId });
      setFavourites([...favourites, eventId]);
      toast.success(`Added "${title}" to favourites`, { className: "toast-success", icon: <img src={successIcon} alt="Success" className="h-5 w-5" /> });
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
      setShowAuthModal(true);
      return;
    }

    setShowFavourites(true);
  };

  const handleLogOut = async () => {
    const toastId = toast.loading("Logging out...", { className: "toast-loading" });
    await supabase.auth.signOut();
    setUser(null);
    setFavourites([]);
    localStorage.removeItem("cachedFavourites");
    localStorage.removeItem("cachedFavouritesTimestamp");
    localStorage.removeItem("cachedFavouritesUserId");
    toast.dismiss(toastId);
    toast.success("Logged out successfully", { className: "toast-success", icon: <img src={successIcon} alt="Success" className="h-5 w-5" /> });
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  const allLocations = [...new Set(allEvents.map(e => e.location))];
  const allTags = [...new Set(allEvents.flatMap(e => e.tags))];

  const visibleEvents = events.slice(0, visibleCount);
  const favouriteEventDetails = allEvents.filter(e => favourites.includes(e.id));

  /* <button
        onClick={() => setShowExpired(prev => !prev)}
        className='text-sm text-gray-100 btn font-bold py-2 px-4 border border-gray-100 bg-neutral-800 rounded-md focus:outline-none focus:ring-2 hover:ring-1 transition'
      >{showExpired ? 'Hide Past Events' : 'Show Past Events'}</button> */

  return (
    <div className='bg-background'>
      <Header user={user} onLogOut={handleLogOut} onShowAuth={handleShowAuth} showFavourites={handleFavouritesButton} />

      {/* SearchBar and Menu Button row */}
      <div className='flex items-center my-6 px-4 sm:px-14.5 gap-4'>
        <button
          className='mid:hidden flex items-center justify-center p-3 rounded-lg border border-border-gray bg-background-2 text-neutral-400 hover:bg-neutral-800'
          onClick={() => setShowMobileFilters(true)}
        >
          <img src={menuIcon} className='' />
        </button>
        <div className='flex-1'>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content */}
      <div className='flex gap-6 my-6 px-4 sm:px-14.5 bg-background'>
        {/* SideBar */}
        <div className='hidden mid:block'>
          <FilterSidebar
            locations={allLocations}
            tags={allTags}
            currentLocation={currentLocation}
            currentDate={currentDate}
            currentTags={currentTags}
            matchAll={activeMatchAll}
            onLocationChange={setCurrentLocation}
            onDateChange={setCurrentDate}
            onTagToggle={(tag) => setCurrentTags((ts) => ts.includes(tag) ? ts.filter((t) => t !== tag) : [...ts, tag])}
            onMatchModeToggle={() => setActiveMatchAll((m) => !m)}
          />
        </div>

        {/* Event List */}
        <div className='flex-1 max-w-full'>
          {loading ? (
            <div className='spinner-container flex justify-center items-center py-10'>
              <div className='spinner animate-spin rounded-full h-10 w-10 border-t-4 border-grad-blue-start' />
            </div>
          ) : (
            <div>
              <p className='text-md text-left text-gray-400'>Found {events.length} {events.length === 1 ? "event" : "events"}</p>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  onAnimationComplete={() => setHighlightReady(true)}
                  className='flex flex-col gap-4 mt-6'>
                  {visibleEvents.length > 0 ? (
                    visibleEvents.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                      >
                        <EventCard
                          id={event.id}
                          title={event.title}
                          img={event.img}
                          description={event.description}
                          date={event.date}
                          time={event.time}
                          location={event.location}
                          link={event.link}
                          tags={event.tags.join(", ")}
                          onFavourite={handleFavouriteToggle}
                          isFavourited={favourites.includes(event.id)}
                          user={user?.id}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className='text-center text-2xl font-bold text-white'>
                      No events found.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-grad-blue-start" />
            </div>
          )}

          {/* Sentinel: Invisible div that triggers loading more */}
          <div ref={loaderRef} />
        </div>
      </div>

      {/* Menu Button */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='fixed inset-y-0 left-0 z-50 w-3/4 sm:w-1/2 mid:hidden bg-background-2 p-6 overflow-y-auto'
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold text-white'>Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className='mid:hidden flex items-center justify-center p-3 rounded-lg border border-border-gray bg-background-2 text-neutral-400 hover:bg-neutral-800'
              >
                <img src={menuIcon} className='' />
              </button>
            </div>
            <FilterSidebar
              locations={allLocations}
              tags={allTags}
              currentLocation={currentLocation}
              currentDate={currentDate}
              currentTags={currentTags}
              matchAll={activeMatchAll}
              onLocationChange={setCurrentLocation}
              onDateChange={setCurrentDate}
              onTagToggle={(tag) => setCurrentTags((ts) => (ts.includes(tag) ? ts.filter((t) => t !== tag) : [...ts, tag]))}
              onMatchModeToggle={() => setActiveMatchAll((m) => !m)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for Menu Button */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-40 bg-black mid:hidden'
            onClick={() => setShowMobileFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Favourites Modal */}
      <FavouritesModal
        show={showFavourites}
        onClose={() => setShowFavourites(false)}
        favouriteEventIds={favourites}
        favouriteEvents={favouriteEventDetails}
        onRemoveFavourite={handleRemoveFavourite}
        user={user?.id}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <Auth onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  )
}

export default Home;
