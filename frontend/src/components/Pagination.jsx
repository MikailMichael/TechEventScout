// Pagination.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Pagination({ totalPages, currentPage, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const maxVisibleButtons = window.innerWidth < 1080 ? 4 : 8;
  const pageNumbers = [];
  const sideButtons = Math.floor(maxVisibleButtons / 2);

  let startPage = Math.max(1, currentPage - sideButtons);
  let endPage = Math.min(totalPages, currentPage + sideButtons);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }
  }

  const addButton = (page) => (
    <button
      key={page}
      className={`px-4 py-2 font-bold rounded-md border focus:outline-none transition disabled:opacity-50 ${currentPage === page ? 'ring-2 ring-gray-300 bg-neutral-700 text-gray-100 border-gray-100' : 'bg-neutral-800 text-gray-200 border-gray-100 hover:ring-1'}`}
      onClick={() => setCurrentPage(page)}
    >{page}</button>
  );

  if (startPage > 1) {
    pageNumbers.push(addButton(1));
    if (startPage > 2) pageNumbers.push(<span key="start-ellipsis" className="px-2 text-gray-400">...</span>);
  }

  for (let i = startPage; i <=endPage; i++) {
    pageNumbers.push(addButton(i));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbers.push(<span key="end-ellipsis" className="px-2 text-gray-400">...</span>);
    pageNumbers.push(addButton(totalPages));
  }

  return (
    <div className='flex justify-center items-center gap-2 mt-8 flex-wrap'>
      <button
        className="px-3 py-2 text-sm text-gray-300 hover:text-white disabled:opacity-50"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      ><FontAwesomeIcon icon={faArrowLeft} /></button>
      {pageNumbers}
      <button
        className="px-3 py-2 text-sm text-gray-300 hover:text-white disabled:opacity-50"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      ><FontAwesomeIcon icon={faArrowRight} /></button>
    </div>
  );
}

export default Pagination;