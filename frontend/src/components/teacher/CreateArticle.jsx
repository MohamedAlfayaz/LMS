import React, { useEffect } from "react";
import { FiTrash2, FiPlus, FiX, FiFileText, FiImage, FiVideo, FiFile, FiBookOpen } from "react-icons/fi";
import {
  createArticle,
  uploadArticleFile,
  getArticleById,
  updateArticle,
} from "../../api/articleApi";
import Button from "../ui/Button";
import Input from "../ui/Input"
import toast from "react-hot-toast";

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
import { useParams, useNavigate } from "react-router-dom";

const BLOCK_TYPES = [
  { type: "text", label: "Text", icon: FiFileText },
  { type: "image", label: "Image", icon: FiImage },
  { type: "video", label: "Video", icon: FiVideo },
  { type: "pdf", label: "PDF", icon: FiFile },
  { type: "document", label: "Document", icon: FiBookOpen },
];

const CATEGORIES = ["Tamil", "English", "Math", "Science", "History", "Art", "Computer"];

const getYouTubeEmbedUrl = (url) => {
  try {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  } catch {
    return "";
  }
};


const CreateArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { title, category, blocks } = useSelector((state) => state.createArticle);

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

  const validateArticle = () => {
    if (!title.trim()) return "Title is required";

    if (!category) return "Category is required";

    if (blocks.length === 0) return "Add at least one content block";

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      if (block.type === "text" && !block.value?.trim()) {
        return `Text block ${i + 1} is empty`;
      }

      if (block.type === "video") {
        if (!block.value) return `Video URL required in block ${i + 1}`;
        if (!getYouTubeEmbedUrl(block.value)) {
          return `Invalid YouTube URL in block ${i + 1}`;
        }
      }

      if (["image", "pdf", "document"].includes(block.type)) {
        if (!block.value) {
          return `Upload file in block ${i + 1}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateArticle();

    if (error) {
      toast.error(error);
      return;
    }

    const loadingToast = toast.loading(
      id ? "Updating article..." : "Creating article..."
    );

    try {
      const payload = {
        title,
        category,
        content: blocks,
        contentBlocks: blocks,
      };

      if (id) {
        await updateArticle(id, payload);

        toast.success("Article updated successfully", {
          id: loadingToast,
        });
      } else {
        await createArticle(payload);

        toast.success("Article created successfully", {
          id: loadingToast,
        });
      }
      
      dispatch(resetArticle());
      navigate("/teacher/articles");

    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || "Something went wrong",
        { id: loadingToast }
      );
    }
  };

  const handleClose = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          You have unsaved changes. Leave anyway?
        </p>

        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => toast.dismiss(t.id)}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(resetArticle());
              navigate("/teacher/articles");
            }}
            variant="danger"
          >
            Leave
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-2 py-2 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* LEFT: MAIN CONTENT */}
        <div className="flex flex-col gap-5">

          {/* Status + Block Count */}
          <div className="grid grid-col-1 md:grid-cols-2 gap-2">
            <div className="bg-white rounded-2xl px-8 h-14 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 ">
                <div className={`w-2 h-2 rounded-full ${id ? "bg-yellow-500" : "bg-green-500"}`} />
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-700">
                  {id ? "Editing Article" : "New Article"}
                </span>
              </div>
              <Button onClick={handleClose} variant="secondary">
                <FiX size={14} /> Cancel
              </Button>
            </div>
            <div className="bg-white rounded-2xl px-8 h-14 flex items-center justify-between shadow-lg">
              <span className="text-xs text-gray-400 font-medium">Total Blocks</span>
              <span className="text-base font-bold text-gray-800">{blocks.length}</span>
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
              Article Title
            </label>
            <input
              type="text"
              placeholder="Enter a compelling title..."
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
              className="w-full text-2xl font-bold text-gray-900 outline-none border-b-2 border-gray-200 pb-2 focus:border-blue-500 transition-colors bg-transparent placeholder-gray-300"
            />
          </div>

          {/* Empty State */}
          {blocks.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
              <FiPlus size={28} className="text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm font-medium">No content blocks yet</p>
              <p className="text-gray-300 text-xs mt-1">Use the panel on the right to add blocks</p>
            </div>
          )}

          {/* Blocks */}
          {blocks.map((block, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              {/* Block Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                  {block.type} block
                </span>
                <Button
                  onClick={() => dispatch(removeBlock(index))}
                  variant="danger"
                >
                  <FiTrash2 size={14} />
                </Button>
              </div>

              <div className="border-t border-gray-100 mb-4" />

              {/* TEXT */}
              {block.type === "text" && (
                <textarea
                  placeholder="Write your content here..."
                  value={block.value}
                  onChange={(e) => dispatch(updateBlock({ index, value: e.target.value }))}
                  className="w-full min-h-[140px] resize-y border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 placeholder-gray-300"
                />
              )}

              {/* VIDEO - URL only, no file upload */}
              {block.type === "video" && (
                <div className="flex flex-col gap-4">
                  <Input
                    label="Youtube Video URL"
                    icon={<FiVideo />}
                    type="text"
                    placeholder="Paste YouTube URL here... (e.g. https://youtube.com/watch?v=...)"
                    value={block.value}
                    onChange={(e) => dispatch(updateBlock({ index, value: e.target.value }))}
                  />

                  {block.value && getYouTubeEmbedUrl(block.value) && (
                    <div className="rounded-xl overflow-hidden aspect-video border border-gray-200">
                      <iframe
                        src={getYouTubeEmbedUrl(block.value)}
                        className="w-full h-full"
                        allowFullScreen
                        title="YouTube video"
                      />
                    </div>
                  )}

                  {block.value && !getYouTubeEmbedUrl(block.value) && (
                    <p className="text-xs text-red-400 px-1">⚠️ Valid YouTube URL போடுங்க</p>
                  )}
                </div>
              )}

              {/* FILE BLOCKS - image, pdf, document மட்டும் */}
              {["image", "pdf", "document"].includes(block.type) && (
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                    <FiPlus size={18} />
                    <span>Click to upload {block.type}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    />
                  </label>

                  {block.value && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {block.type === "image" && (
                        <img src={block.value} alt="uploaded" className="w-full block" />
                      )}
                      {block.type === "pdf" && (
                        <iframe src={block.value} className="w-full h-[400px] block border-none" title="pdf" />
                      )}
                      {block.type === "document" && (
                        <div className="p-4">
                          <a
                            href={block.value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-blue-600 hover:underline"
                          >
                            📄 Open Document
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="flex flex-col gap-5">

          {/* Article Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
              Article Settings
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => dispatch(setCategory(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 cursor-pointer transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-100 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-green-700">
                    Ready to {id ? "update" : "publish"}
                  </span>
                </div>
                <Button onClick={handleSubmit} variant="success">
                  {id ? "Update Article" : "Publish Article"}
                </Button>
              </div>
            </div>
          </div>

          {/* Add Block Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
              Add Content Block
            </p>
            <div className="grid grid-cols-2 justify-center items-center w-full gap-2">
              {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  onClick={() => dispatch(addBlock(type))}
                  variant="lightgray"
                >
                  <Icon size={14} />
                  <span className="flex-1">{label}</span>
                  <FiPlus size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateArticle;