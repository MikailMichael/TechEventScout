import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from "framer-motion";
import successIcon from '../assets/toast-success.png';
import errorIcon from '../assets/toast-error.png';
import EventCard from "./EventCard";
import { showSuccessToast, showLoadingToast, showErrorToast } from './CustomToast';

function FavouritesModal({ show, onClose, onRemoveFavourite, favouriteEvents = [], user }) {

  const handleRemove = async (eventId, title) => {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('event_id', eventId);

    if (!error) {
      showSuccessToast(`Removed "${title}" from favourites`);
      onRemoveFavourite?.(eventId);
    } else {
      showErrorToast("Failed to remove from favourites")
    }
  };

  if (!show) return null;
  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-background-2 text-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[24px] sm:p-6 p-2 relative shadow-xl border border-border-gray"
          initial={{ scale: 0.90, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>

          <h2 className="text-2xl font-bold mb-4">Your Saved Events</h2>

          {favouriteEvents.length === 0 ? (
            <p className="text-gray-400">No saved events.</p>
          ) : (
            <div className="space-y-4">
              {favouriteEvents.map((event, idx) => {
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                  >
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      img={event.img}
                      description={event.description}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      link={event.link}
                      tags={event.tags.join(",")}
                      onFavourite={handleRemove}
                      isFavourited={true}
                      user={user}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FavouritesModal;