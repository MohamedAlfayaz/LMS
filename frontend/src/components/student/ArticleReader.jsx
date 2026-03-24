import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";

import {
  useArticle,
  useHighlights,
  useHighlightMutations
} from "../../hooks/useArticlesReader";

import {
  setSelectedText,
  setNoteComment,
  clearHighlight
} from "../../store/highlightSlice";

import { trackReading } from "../../api/studentApi";
import PDFHighlight from "./PDFHighlight"; // adjust path

const ArticleReader = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: article, isLoading } = useArticle(id);
  const { data: notes = [] } = useHighlights(id);

  // console.log("Article:", article);

  const { createMutation, deleteMutation } =
    useHighlightMutations();

  const { selectedText, noteComment } =
    useSelector((state) => state.highlight || {});

  /* TRACK READING TIME */

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const duration =
        Math.floor((Date.now() - startTime) / 1000);
      if (duration > 0) {
        trackReading({
          articleId: id,
          duration
        }).catch(() =>
          console.error("Tracking failed")
        );
      }
    };
  }, [id]);

  /* HANDLE TEXT SELECTION */

  const handleHighlight = () => {
    const text =
      window.getSelection().toString().trim();
    if (text) dispatch(setSelectedText(text));
  };

  /* SAVE NOTE */

  const saveNote = () => {
    if (!selectedText) return;
    createMutation.mutate({
      articleId: id,
      text: selectedText,
      comment: noteComment
    });
    dispatch(clearHighlight());
    window.getSelection().removeAllRanges();
  };

  /* DELETE NOTE */
  const deleteNote = (noteId) => {
    deleteMutation.mutate(noteId);
  };

  const handleClose = () => {
    navigate(-1);
  };

  /* LOADING STATE */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        {/* TOP BAR */}
        <div className="bg-white border-b mt-15 px-6 py-4 flex justify-between items-center">

          <h2 className="text-sm font-semibold text-gray-600">
            Reading Mode
          </h2>

          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm bg-gray-700 text-white rounded-full"
          >
            Close
          </button>

        </div>

        {/* CONTENT */}

        <div
          className="flex-1 flex justify-center"
          onMouseUp={handleHighlight}
        >

          <div className="w-full max-w-3xl p-6">
            <h1 className="text-4xl font-bold text-center mb-6">
              {article?.title}
            </h1>

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

                  case "pdf":
                    return (
                      <PDFHighlight
                        key={i}
                        url={block.value}
                        highlights={notes.filter(n => n.type === "pdf")}
                        onSaveHighlight={(highlight) => {
                          createMutation.mutate({
                            articleId: id,
                            type: "pdf",
                            text: highlight.text,
                            rect: highlight.rect,
                            blockIndex: i,
                          });
                        }}
                      />
                    );

                  case "document":
                    return (
                      <div key={i} className="bg-gray-100 p-5 rounded-2xl flex justify-between items-center">

                        <div className="flex flex-col">
                          <p className="font-medium text-gray-800">
                            Document File
                          </p>
                          <p className="text-sm text-gray-500 break-all">
                            {block.value}
                          </p>
                        </div>

                        <a
                          href={block.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                          Open
                        </a>

                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>

            {/* NOTES */}

            {notes.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-6">
                  Your Highlights
                </h3>
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="border p-4 rounded mb-4"
                  >
                    <p className="italic text-yellow-700">
                      "{note.text}"
                    </p>
                    {note.comment && (
                      <p className="text-sm mt-2">
                        Comment: {note.comment}
                      </p>
                    )}
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="text-red-500 text-sm mt-2"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* MODAL */}

        {selectedText && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-96">

              <p className="italic mb-3">
                "{selectedText}"
              </p>

              <textarea
                value={noteComment}
                onChange={(e) =>
                  dispatch(setNoteComment(e.target.value))
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">

                <button
                  onClick={() => dispatch(clearHighlight())}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={saveNote}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </div>

  );

};

export default ArticleReader;