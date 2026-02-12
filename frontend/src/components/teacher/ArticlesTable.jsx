import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const ArticlesTable = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      const res = await API.get("/articles");
      setArticles(res.data);
    } catch {
      console.error("Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;

    try {
      await API.delete(`/articles/${id}`);
      setArticles(articles.filter((a) => a._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/articles/${editingArticle._id}`, {
        title: editingArticle.title,
        category: editingArticle.category,
      });

      setEditingArticle(null);
      fetchArticles();
    } catch {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-md">
        <div className="h-40 animate-pulse bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Articles
        </h2>
        <span className="text-sm text-gray-400">
          {articles.length} total
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="py-4">Title</th>
              <th>Category</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article) => (
              <tr
                key={article._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-5 font-medium text-gray-800">
                  {article.title}
                </td>

                <td>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                    {article.category}
                  </span>
                </td>

                <td className="text-gray-500 text-sm">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>

                <td className="text-right space-x-3">
                  <button
                    onClick={() => setEditingArticle(article)}
                    className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(article._id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* EDIT MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

            <h3 className="text-xl font-semibold mb-6">
              Edit Article
            </h3>

            <input
              type="text"
              value={editingArticle.title}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  title: e.target.value,
                })
              }
              className="w-full border border-gray-200 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={editingArticle.category}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  category: e.target.value,
                })
              }
              className="w-full border border-gray-200 px-4 py-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Science</option>
              <option>Math</option>
              <option>English</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
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
