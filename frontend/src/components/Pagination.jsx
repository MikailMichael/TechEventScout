// Pagination.jsx

function Pagination({ totalPages, currentPage, setCurrentPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className='flex justify-center gap-2 mt-8'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`text-gray-100 px-4 py-2 font-bold rounded-md border border-gray-100 focus:outline-none focus:ring-2 hover:ring-1 transition disabled:opacity-50 ${currentPage === i + 1
                ? 'ring-2 ring-gray-300 bg-neutral-700 text-gray-100'
                : 'bg-neutral-800 text-gray-200'
              }`}
              onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
    );
}

export default Pagination;