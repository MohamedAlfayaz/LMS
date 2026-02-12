import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

const ArticleReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [noteComment, setNoteComment] = useState("");
  const [notes, setNotes] = useState([]);

  /* ---------------- FETCH ARTICLE ---------------- */
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error("Failed to fetch article");
      }
    };

    fetchArticle();
  }, [id]);

  /* ---------------- FETCH NOTES ---------------- */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/student/highlights");
        const articleNotes = res.data.filter(
          (note) => note.articleId?._id === id
        );
        setNotes(articleNotes);
      } catch (err) {
        console.error("Failed to fetch notes");
      }
    };

    fetchNotes();
  }, [id]);

  /* ---------------- TRACK READING TIME ---------------- */
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);

      if (duration > 0) {
        API.post("/tracking", {
          articleId: id,
          duration,
        }).catch(() => console.error("Tracking failed"));
      }
    };
  }, [id]);

  /* ---------------- HANDLE TEXT SELECTION ---------------- */
  const handleHighlight = () => {
    const text = window.getSelection().toString().trim();
    if (text.length > 0) {
      setSelectedText(text);
    }
  };

  /* ---------------- SAVE NOTE ---------------- */
  const saveNote = async () => {
    if (!selectedText) return;

    try {
      const res = await API.post("/student/highlights", {
        articleId: id,
        text: selectedText,
        comment: noteComment,
      });

      setNotes((prev) => [...prev, res.data]);

      setSelectedText("");
      setNoteComment("");
      window.getSelection().removeAllRanges();
    } catch {
      alert("Failed to save note");
    }
  };

  /* ---------------- DELETE NOTE ---------------- */
  const deleteNote = async (noteId) => {
    try {
      await API.delete(`/student/highlights/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch {
      alert("Delete failed");
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-15">

      {/* TOP BAR */}
      <div className="sticky top-0 z-40 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-600 tracking-wide">
          Reading Mode
        </h2>

        <button
          onClick={handleClose}
          className="px-5 py-2 text-sm bg-gray-700 text-white rounded-full hover:opacity-90 transition"
        >
          Close
        </button>
      </div>

      {/* CONTENT WRAPPER */}
      <div
        className="flex-1 flex justify-center"
        onMouseUp={handleHighlight}
      >
        <div className="w-full max-w-3xl p-6">

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6 text-center">
            {article.title}
          </h1>

          {/* ARTICLE CONTENT */}
          <div className="space-y-5 text-lg leading-9 text-gray-700">
            {article.contentBlocks?.map((block, i) => {
              switch (block.type) {
                case "text":
                  return (
                    <p key={i} className="text-justify">
                      {block.value}
                    </p>
                  );

                case "image":
                  return (
                    <div key={i} className="flex justify-center">
                      <img
                        src={block.value}
                        alt="article"
                        className="rounded-2xl shadow-md max-h-[500px] object-contain"
                      />
                    </div>
                  );

                case "video": {
                  const isYoutube =
                    block.value.includes("youtube.com") ||
                    block.value.includes("youtu.be");

                  if (isYoutube) {
                    const videoId =
                      block.value.includes("youtu.be")
                        ? block.value.split("youtu.be/")[1]
                        : block.value.split("v=")[1]?.split("&")[0];

                    return (
                      <div key={i} className="flex justify-center">
                        <iframe
                          className="rounded-2xl shadow-md w-full max-w-3xl h-[400px]"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video"
                          allowFullScreen
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={i} className="flex justify-center">
                      <video
                        controls
                        preload="metadata"
                        className="rounded-2xl shadow-md max-h-[500px] w-full"
                      >
                        <source src={block.value} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  );
                }


                case "3d":
                  return (
                    <div
                      key={i}
                      className="bg-gray-100 p-8 rounded-2xl text-center"
                    >
                      <p className="text-gray-600 font-medium">
                        3D Model Preview
                      </p>
                      <p className="text-sm text-gray-400 mt-2 break-all">
                        {block.value}
                      </p>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* NOTES SECTION */}
          {notes.length > 0 && (
            <div className="mt-14 border-t pt-7">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 text-center">
                Your Highlights
              </h3>

              <div className="space-y-6">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white p-6 rounded-2xl shadow-sm border"
                  >
                    <p className="text-yellow-700 font-medium italic border-l-4 border-yellow-400 pl-4">
                      "{note.text}"
                    </p>

                    {note.comment && (
                      <p className="mt-4 text-gray-600 text-sm">
                        <span className="font-semibold text-gray-800">
                          Comment:
                        </span>{" "}
                        {note.comment}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-6">
                      <p className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>

                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER MODAL HIGHLIGHT EDITOR */}
      {selectedText && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Highlighted Text
            </p>

            <p className="italic text-gray-800 mb-4 border-l-4 border-yellow-400 pl-4">
              "{selectedText}"
            </p>

            <textarea
              placeholder="Add your thoughts..."
              value={noteComment}
              onChange={(e) => setNoteComment(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows="3"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedText("");
                  setNoteComment("");
                }}
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={saveNote}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Highlight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default ArticleReader;
