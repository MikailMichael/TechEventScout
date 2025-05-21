// Pagination.jsx

function Pagination({ totalPages, currentPage, setCurrentPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className='flex justify-center gap-2 mt-8'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`text-gray-100 font-bold rounded-md border border-gray-100 focus:outline-none focus:ring-2 hover:ring-1 transition disabled:opacity-50 ${currentPage === i + 1
                ? 'ring-2 ring-gray-300 bg-gray-800 text-white'
                : 'bg-gray-700 text-gray-200'
              }`}
              onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
    );
}

export default Pagination;