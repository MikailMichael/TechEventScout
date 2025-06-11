import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import tagColours from '../utils/tagColours';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from "framer-motion";

function FavouritesModal({ show, onClose, onRemoveFavourite, favouriteEvents = [] }) {

  const handleRemove = async (eventId, title) => {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('event_id', eventId);

    if (!error) {
      toast.success(`Removed "${title}" from favourites`);
      onRemoveFavourite?.(eventId);
    } else {
      toast.error("Failed to remove from favourites")
    }
  };

  if (!show) return null;
  if (!supabase.auth.getUser()) return null;

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
          className="bg-neutral-900 text-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative shadow-xl border border-gray-700"
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
              {favouriteEvents.map(event => {
                const isExpired = new Date(`${event.date}T${event.time}`) < new Date();
                return (
                  <div key={event.id} className={`p-4 rounded-lg border relative ${isExpired ? 'bg-neutral-800 border-red-400' : 'bg-neutral-800 border-gray-700'}`}>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">
                      {new Date(`${event.date}T${event.time}`).toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-300 mb-2">{event.location}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {event.tags.map((tag, idx) => {
                        const colour = tagColours[tag.trim()] || 'bg-zinc-700 text-zinc-200';
                        return (
                          <span key={idx} className={`text-sm px-3 py-1 rounded-full font-medium ${colour}`}>{tag}</span>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >View Event</a>
                      <button
                        onClick={() => handleRemove(event.id, event.title)}
                        className="text-red-400 hover:text-red-300"
                        title="Remove from favourites"
                      ><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                    {isExpired && (
                      <span className="absolute top-2 left-2 text-xs font-semibold text-red-400 bg-red-900 px-2 py-1 rounded">Expired</span>
                    )}
                  </div>
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