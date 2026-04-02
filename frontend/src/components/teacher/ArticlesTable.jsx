import React from "react";
import { FiEdit2, FiTrash2, FiPlus, FiBook, FiSearch } from "react-icons/fi";
import { useArticles } from "../../hooks/useArticles";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useTable } from "../../hooks/useTable"; // 🔥 NEW

const ArticlesTable = () => {
  const { data: articles = [], isLoading, deleteArticle } = useArticles();
  const navigate = useNavigate();

  // 🔥 GLOBAL STATE (Redux)
  const {
    search,
    category,
    page,
    totalPages,
    filtered,
    paginated,
    setSearch,
    setCategory,
    setPage,
  } = useTable(articles, "title", "category");

  const handleDelete = (id) => {
    if (!window.confirm("Delete this article?")) return;
    deleteArticle(id);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="h-40 animate-pulse bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl mt-3 shadow border border-gray-100">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FiBook />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Articles</h2>
            <p className="text-xs text-gray-500">
              {filtered.length} results
            </p>
          </div>
        </div>

        {/* 🔥 SEARCH + FILTER */}
        <div className="flex flex-wrap gap-2 items-center">

          {/* SEARCH */}
          <Input
            label="Search"
            icon={<FiSearch />}
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FILTER */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-3.5 text-sm border rounded-lg"
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

          <Button
            onClick={() => navigate("/teacher/create-article")}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Create
          </Button>

        </div>
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No articles found 🚫
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {/* 🔥 DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">

              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left px-14">Article</th>
                  <th className="text-left px-4">Category</th>
                  <th className="text-left px-4">Date</th>
                  <th className="text-right pr-10">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((article) => (
                  <tr
                    key={article._id}
                    className="bg-white shadow-sm hover:shadow-md transition rounded-xl"
                  >

                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">
                        {article.title}
                      </p>
                    </td>

                    <td>
                      <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                        {article.category}
                      </span>
                    </td>

                    <td className="text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>

                    <td className="pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => navigate(`/teacher/edit-article/${article._id}`)}
                          variant="warning"
                        >
                          <FiEdit2 />
                        </Button>

                        <Button
                          onClick={() => handleDelete(article._id)}
                          variant="danger"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔥 MOBILE */}
          <div className="md:hidden space-y-4">
            {paginated.map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
              >

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {article.title}
                    </h3>
                  </div>

                  <span className="text-sm text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full">
                    {article.category}
                  </span>
                </div>

                <div className="border-t my-3"></div>

                <div className="flex justify-between gap-2">
                  <Button
                    onClick={() => navigate(`/teacher/edit-article/${article._id}`)}
                    variant="warning"
                  >
                    <FiEdit2 />
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDelete(article._id)}
                    variant="danger"
                  >
                    <FiTrash2 />
                    Delete
                  </Button>
                </div>

              </div>
            ))}
          </div>

          {/* 🔥 PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-6">

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
        </>
      )}

    </div>
  );
};

export default ArticlesTable;