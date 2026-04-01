import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import { setCategory, setSearch } from "../../store/highlightSlice";
import Button from "../ui/Button";
import Input from "../ui/Input"
import { FiSearch } from "react-icons/fi";

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
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Explore Articles
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Discover and read curated content
            </p>
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-2  gap-3 w-full lg:w-auto">
            {/* SEARCH */}
            <Input
              type="text"
              label="Search"
              placeholder="Search articles..."
              icon={<FiSearch />}
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
            {/* CATEGORY */}
            <select
              className="w-full sm:w-48 border border-gray-200 px-4 py-2 rounded-xl bg-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              value={categoryFilter}
              onChange={(e) => dispatch(setCategory(e.target.value))}
            >
              <option value="All">All</option>
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="Computer">Computer</option>
            </select>

          </div>
        </div>

        {/* ================= EMPTY ================= */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No articles found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try changing filters or search
            </p>
          </div>
        ) : (

          /* ================= GRID ================= */
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filtered.map((article) => (
              <div
                key={article._id}
                className="group bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                {/* TOP */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                      {article.category}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mt-2 leading-snug group-hover:text-indigo-600 transition">
                    {article.title}
                  </h2>

                  {/* OPTIONAL PREVIEW */}
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    Click to read full article content...
                  </p>
                </div>

                {/* BUTTON */}
                <div className="mt-4">
                  <Button
                    onClick={() =>
                      navigate(`/student/article/${article._id}`)
                    }
                    variant="primary"
                    className="w-full text-sm py-2.5"
                  >
                    Read Article
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentArticles;