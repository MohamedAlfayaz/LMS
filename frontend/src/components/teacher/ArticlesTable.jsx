import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useArticles } from "../../hooks/useArticles";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const ArticlesTable = () => {
  const { data: articles = [], isLoading, deleteArticle, updateArticle } = useArticles();
  const navigate = useNavigate();
  const [editingArticle, setEditingArticle] = useState(null);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this article?")) return;
    deleteArticle(id);
  };

  const handleUpdate = () => {
    if (!editingArticle?._id) return;

    updateArticle({
      _id: editingArticle._id,
      title: editingArticle.title,
      category: editingArticle.category,
    });

    setEditingArticle(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="h-40 animate-pulse bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6  rounded-2xl shadow border border-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-400">{articles.length} total articles</p>
        </div>

        <Button
          onClick={() => navigate("/teacher/create-article")}
          variant="primary"
        >
          <FiPlus />
          Create Article
        </Button>
      </div>

      {/* EMPTY STATE */}
      {articles.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No articles found 🚫
        </div>
      )}

      {/* TABLE / CARD RESPONSIVE */}
      {articles.length > 0 && (
        <>
          {/* ================= DESKTOP + TABLET TABLE ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="py-3">Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 font-medium text-gray-800">
                      {article.title}
                    </td>

                    <td>
                      <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                        {article.category}
                      </span>
                    </td>

                    <td className="text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>

                    <td className="text-right">
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

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className="md:hidden space-y-4">
            {articles.map((article) => (
              <div
                key={article._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4"
              >
                {/* TOP SECTION */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight">
                    {article.title}
                  </h3>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* CATEGORY */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full">
                    {article.category}
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-100 mb-3"></div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">Manage Article</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/teacher/edit-article/${article._id}`)}
                      variant="warning"
                    >
                      <FiEdit2 size={16} />
                    </Button>

                    <Button
                      onClick={() => handleDelete(article._id)}
                      variant="danger"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

            <h3 className="text-lg font-semibold mb-4">Edit Article</h3>

            <input
              type="text"
              value={editingArticle.title}
              onChange={(e) =>
                setEditingArticle({ ...editingArticle, title: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <select
              value={editingArticle.category}
              onChange={(e) =>
                setEditingArticle({ ...editingArticle, category: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="Computer">Computer</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesTable;