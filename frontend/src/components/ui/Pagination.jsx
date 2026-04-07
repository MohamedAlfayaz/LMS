import Button from "./Button";

export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-center items-center gap-2 my-3">

      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        variant="lightgray"
      >
        Prev
      </Button>

      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;

        return (
          <button
            key={i}
            onClick={() => setPage(pageNum)}
            className={`px-3 py-1 text-xs border rounded-lg
              ${page === pageNum
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            {pageNum}
          </button>
        );
      })}

      <Button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        variant="lightgray"
      >
        Next
      </Button>

    </div>
  );
}