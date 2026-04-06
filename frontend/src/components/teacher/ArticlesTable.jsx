import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiBook, FiSearch } from "react-icons/fi";
import { useArticles } from "../../hooks/useArticles";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useTable } from "../../hooks/useTable"; // 🔥 NEW
import Loading from "../ui/Loading";
import ConfirmModal from "../ui/ConfirmModal";
import toast from "react-hot-toast";


const ArticlesTable = () => {
  const { data: articles = [], isLoading, deleteArticle } = useArticles();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting...");

    try {
      setLoading(true);

      await deleteArticle(deleteId);

      toast.success("Deleted successfully", {
        id: loadingToast,
      });

      setDeleteId(null);

    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || "Delete failed",
        { id: loadingToast }
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 🔥 HEADER */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <FiBook />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Articles
              </h2>
              <div className="flex gap-2">
                <p className="flex text-xs text-gray-400">
                  {filtered.length} {filtered.length === 0 || filtered.length === 1 ? "article" : "articles"}
                </p>
                <p className="flex text-xs text-gray-500">
                  {totalPages} {totalPages === 0 || totalPages === 1 ? "page" : "pages"}
                </p>
              </div>
            </div>
          </div>

          {/* 🔥 FILTER BAR */}
          <div className="flex flex-wrap gap-3 items-center">

            <div className="w-60">
              <Input
                label="Search"
                icon={<FiSearch />}
                type="text"
                placeholder="Search Articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 text-sm border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
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
              className="flex items-center gap-2 shadow-md hover:scale-[1.03] transition"
            >
              <FiBook />
              Create Article
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
            <div className="bg-white hidden md:block overflow-x-auto rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              <table className="w-full">

                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-6 py-4">Article</th>
                    <th className="text-left px-4">Category</th>
                    <th className="text-left px-4">Date</th>
                    <th className="text-right px-6">Actions</th>
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
                            onClick={() => setDeleteId(article._id)}
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
                      onClick={() => setDeleteId(article._id)}
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

        <ConfirmModal
          isOpen={!!deleteId}
          title="Delete Article"
          message="Are you sure you want to delete this article?"
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ArticlesTable;