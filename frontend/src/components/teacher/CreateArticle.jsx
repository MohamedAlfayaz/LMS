import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import API from "../../api/api";


const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Science");
  const [blocks, setBlocks] = useState([]);

  // Add Block
  const addBlock = (type) => {
    setBlocks([...blocks, { type, value: "" }]);
  };

  // Update Block Content
  const updateBlock = (index, value) => {
    const updated = [...blocks];
    updated[index].value = value;
    setBlocks(updated);
  };

  // Remove Block
  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);
  };

  // Handle File Upload
  const handleFileUpload = async (index, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/articles/upload", formData);

      updateBlock(index, res.data.fileUrl);

    } catch (err) {
      alert("Image upload failed");
    }
  };


  // Publish (for now just console)
  const handlePublish = async () => {
    try {
      await API.post("/articles", {
        title,
        category,
        contentBlocks: blocks,
      });

      alert("Article Created Successfully");
      setTitle("");
      setBlocks([]);
    } catch (err) {
      alert("Failed to create article");
    }
  };

  return (
    <div className="bg-gray-50 shadow-2xl rounded-2xl px-6 mt-5 py-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Create Article
          </h2>

          <button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Publish
          </button>
        </div>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Article Title..."
          className="w-full text-3xl font-semibold border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent pb-3 mb-8"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CATEGORY */}
        <div className="mb-8 flex items-center justify-between">

          {/* LEFT - LABEL */}
          <label className="text-sm font-semibold text-gray-700">
            Category
          </label>

          {/* RIGHT - SELECT */}
          <div className="relative w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 px-4 py-3 pr-10 rounded-xl 
      shadow-sm text-gray-800 font-medium
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
      hover:border-gray-300 transition"
            >
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="computer">Computer</option>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ADD BLOCK BUTTONS */}
        <div className="flex gap-4 flex-wrap mb-10">
          {["text", "image", "video", "3d"].map((type) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition"
            >
              + Add {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* BLOCKS */}
        <div className="space-y-8">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >

              {/* DELETE */}
              <button
                onClick={() => removeBlock(index)}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition"
              >
                <FiTrash2 size={20} />
              </button>

              {/* TEXT */}
              {block.type === "text" && (
                <textarea
                  placeholder="Write your content..."
                  className="w-full text-lg leading-8 border-none focus:outline-none resize-none"
                  rows="5"
                  value={block.value}
                  onChange={(e) => updateBlock(index, e.target.value)}
                />
              )}

              {/* IMAGE */}
              {block.type === "image" && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="mb-4"
                    onChange={(e) =>
                      handleFileUpload(index, e.target.files[0])
                    }
                  />

                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    className="w-full border p-3 rounded-xl mb-4"
                    value={block.value}
                    onChange={(e) => updateBlock(index, e.target.value)}
                  />

                  {block.value && (
                    <img
                      src={block.value}
                      alt="preview"
                      className="rounded-2xl max-h-80 object-contain shadow-sm"
                    />
                  )}
                </>
              )}

              {/* VIDEO */}
              {block.type === "video" && (
                <>
                  <input
                    type="text"
                    placeholder="Paste video URL"
                    className="w-full border p-3 rounded-xl mb-4"
                    value={block.value}
                    onChange={(e) => updateBlock(index, e.target.value)}
                  />

                  {block.value && (
                    <video
                      controls
                      src={block.value}
                      className="rounded-2xl max-h-80 shadow-sm"
                    />
                  )}
                </>
              )}

              {/* 3D */}
              {block.type === "3d" && (
                <>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    className="mb-4"
                    onChange={(e) =>
                      handleFileUpload(index, e.target.files[0])
                    }
                  />

                  <input
                    type="text"
                    placeholder="Or paste 3D model URL"
                    className="w-full border p-3 rounded-xl mb-3"
                    value={block.value}
                    onChange={(e) => updateBlock(index, e.target.value)}
                  />

                  {block.value && (
                    <p className="text-sm text-gray-500">
                      3D Model added successfully
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM PUBLISH (mobile safety) */}
        <div className="mt-12 md:hidden">
          <button
            onClick={handlePublish}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
          >
            Publish Article
          </button>
        </div>

      </div>
    </div>
  );

};

export default CreateArticle;
