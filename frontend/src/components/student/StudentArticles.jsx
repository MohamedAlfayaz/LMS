import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import { setCategory, setSearch } from "../../store/highlightSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Loading from "../ui/Loading";
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
    return <Loading type="cards" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 🔥 HEADER + FILTER BAR */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Explore Articles
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Discover curated learning content
            </p>
          </div>

          {/* RIGHT (FILTERS) */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            {/* SEARCH */}
            <div className="w-full">
              <Input
                label="Search"
                type="text"
                placeholder="Search articles..."
                icon={<FiSearch />}
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
            </div>

            {/* CATEGORY */}
            <select
              className="w-full sm:w-44 border border-gray-200 px-4 py-2 rounded-xl bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
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

        {/* 🔥 RESULT COUNT */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filtered.length} articles found
          </p>
        </div>

        {/* 🔥 EMPTY STATE */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed shadow-sm">

            <div className="text-6xl mb-4">📭</div>

            <p className="text-lg font-semibold text-gray-700">
              No articles found
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Try different search or category
            </p>

          </div>
        ) : (

          /* 🔥 GRID */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filtered.map((article) => (
              <div
                key={article._id}
                className="group relative bg-white rounded-3xl border border-gray-100 p-5 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >

                {/* 🔥 HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-indigo-50 to-transparent" />

                <div className="relative z-10">

                  {/* TOP */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-semibold">
                      {article.category}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h2 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-indigo-600 transition">
                    {article.title}
                  </h2>

                  {/* PREVIEW */}
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    Click to read full article content...
                  </p>

                </div>

                {/* ACTION */}
                <div className="mt-5 relative z-10">
                  <Button
                    onClick={() =>
                      navigate(`/student/article/${article._id}`)
                    }
                    variant="primary"
                    className="w-full py-2.5 text-sm group-hover:scale-[1.02] transition"
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