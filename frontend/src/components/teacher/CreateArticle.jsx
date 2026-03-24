import React, { useEffect } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import {
  createArticle,
  uploadArticleFile,
  getArticleById,
  updateArticle,
} from "../../api/articleApi";

import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  setCategory,
  addBlock,
  updateBlock,
  removeBlock,
  resetArticle,
  setAllBlocks,
} from "../../store/createArticleSlice";
import { FiX } from "react-icons/fi"
import { useParams, useNavigate } from "react-router-dom";

const CreateArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { title, category, blocks } = useSelector(
    (state) => state.createArticle
  );

  useEffect(() => {
    if (id) {
      getArticleById(id).then((res) => {
        const article = res?.article || res?.data?.article || res?.data || res;

        dispatch(setTitle(article.title || ""));
        dispatch(setCategory(article.category || ""));

        const formattedBlocks = (article.contentBlocks || []).map((b) =>
          typeof b === "string" ? { type: "text", value: b } : b
        );

        dispatch(setAllBlocks(formattedBlocks));
      });
    }
  }, [id, dispatch]);

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    const res = await uploadArticleFile(file);
    dispatch(updateBlock({ index, value: res.fileUrl }));
  };

  const handleSubmit = async () => {
    const payload = { title, category, contentBlocks: blocks };

    if (id) {
      await updateArticle(id, payload);
      alert("Updated");
    } else {
      await createArticle(payload);
      alert("Created");
      dispatch(resetArticle());
    }

    navigate("/teacher");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      <div className="max-w-4xl mx-auto space-y-4 mt-20">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {id ? "Edit Article" : "Create Article"}
          </h1>

          <div className="flex items-center gap-3">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                const confirmLeave = window.confirm(
                  "You have unsaved changes. Are you sure you want to leave?"
                );

                if (confirmLeave) {
                  dispatch(resetArticle());   // 🔥 FIX
                  navigate("/teacher");
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
            >
              <FiX size={20} />
            </button>

            {/* MAIN CTA */}
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow"
            >
              {id ? "Update" : "Publish"}
            </button>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow">
            <input
              type="text"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
              className="w-full text-2xl font-semibold outline-none"
            />
          </div>

          {/* CATEGORY */}
          <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
            <span className="font-medium text-gray-600">Category</span>

            <select
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className="border px-4 py-2 rounded-lg"
            >
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

        {/* TITLE */}


        {/* ADD BLOCK */}
        <div className="flex flex-wrap gap-3">
          {["text", "image", "video", "pdf", "document"].map((type) => (
            <button
              key={type}
              onClick={() => dispatch(addBlock(type))}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-gray-50"
            >
              <FiPlus size={14} />
              <span className="text-gray-800">{type}</span>
            </button>
          ))}
        </div>

        {/* BLOCKS */}
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow relative"
            >
              <button
                onClick={() => dispatch(removeBlock(index))}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FiTrash2 />
              </button>

              {/* TEXT */}
              {block.type === "text" && (
                <textarea
                  placeholder="Write something..."
                  value={block.value}
                  onChange={(e) =>
                    dispatch(updateBlock({ index, value: e.target.value }))
                  }
                  className="w-full min-h-[120px] outline-none"
                />
              )}

              {/* FILE BLOCKS */}
              {["image", "video", "pdf", "document"].includes(block.type) && (
                <div className="space-y-3">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(index, e.target.files[0])
                    }
                    className="block w-full text-sm"
                  />

                  {block.value && (
                    <div className="border rounded-xl p-3">
                      {block.type === "image" && (
                        <img src={block.value} className="rounded-xl" />
                      )}

                      {block.type === "video" && (
                        <video controls className="w-full rounded-xl">
                          <source src={block.value} />
                        </video>
                      )}

                      {block.type === "pdf" && (
                        <iframe
                          src={block.value}
                          className="w-full h-[400px]"
                        />
                      )}

                      {block.type === "document" && (
                        <a
                          href={block.value}
                          target="_blank"
                          className="text-indigo-600"
                        >
                          Open Document
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CreateArticle;