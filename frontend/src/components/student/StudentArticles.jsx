import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import { setCategory, setSearch } from "../../store/highlightSlice";

const StudentArticles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: articles = [], isLoading } = useArticles();
  const search = useSelector((state) => state.highlight.search);
  const categoryFilter = useSelector((state) => state.highlight.category);

  const filtered = articles.filter((article) => {
    const matchCategory =
      categoryFilter === "All" || article.category === categoryFilter;

    const matchSearch = article.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Explore Articles
          </h1>

          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search articles..."
              className="flex-1 md:w-64 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />

            <div className="relative w-48">
              <select
                className="appearance-none w-full bg-white border border-gray-200 px-4 py-3 pr-10 rounded-xl text-gray-700 font-medium shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                hover:border-gray-300 transition"
                value={categoryFilter}
                onChange={(e) => dispatch(setCategory(e.target.value))}
              >
                <option value="All">All Categories</option>
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Art">Art</option>
                <option value="Computer">Computer</option>
              </select>

              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-md border border-dashed border-gray-300">
            <p className="text-lg text-gray-500">
              No articles found.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <div
                key={article._id}
                className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                    {article.category}
                  </span>

                  <h2 className="text-xl font-semibold text-gray-900 mt-4 group-hover:text-indigo-600 transition">
                    {article.title}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    navigate(`/student/article/${article._id}`)
                  }
                  className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition font-medium"
                >
                  Read Article →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentArticles;
