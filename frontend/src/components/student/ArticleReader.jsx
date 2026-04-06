import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConfirmModal from "../ui/ConfirmModal";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  File,
  StickyNote,
  Trash2,
  Highlighter,
  Save
} from "lucide-react";

import Button from "../ui/Button";
import Loading from "../ui/Loading"

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
import PDFHighlight from "./PDFHighlight";

const ArticleReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfHighlight, setPdfHighlight] = useState(null);

  const { data: article, isLoading } = useArticle(id);
  const { data: notes = [] } = useHighlights(id);

  const { createMutation, deleteMutation } =
    useHighlightMutations();

  const { selectedText, noteComment } =
    useSelector((state) => state.highlight || {});

  /* TRACK READING */
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

  /* TEXT SELECT */
  const handleHighlight = () => {
    const text =
      window.getSelection().toString().trim();
    if (text) dispatch(setSelectedText(text));
  };


  const saveNote = async () => {
    if (!selectedText) return;

    const loadingToast = toast.loading("Saving note...");

    try {
      await createMutation.mutateAsync({
        articleId: id,
        text: selectedText,
        comment: noteComment,
        ...(pdfHighlight && {
          type: "pdf",
          rect: pdfHighlight.rect,
        }),
      });

      toast.success("Note saved successfully", {
        id: loadingToast,
      });

      dispatch(clearHighlight());
      setPdfHighlight(null);
      window.getSelection().removeAllRanges();

    } catch (err) {
      console.error(err);

      toast.error("Failed to save note", {
        id: loadingToast,
      });
    }
  };

  /* DELETE NOTE */
  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting note...");

    try {
      setLoading(true);

      await deleteMutation.mutateAsync(deleteId);

      toast.success("Note deleted", {
        id: loadingToast,
      });

      setDeleteId(null);

    } catch (err) {
      console.error(err);

      toast.error("Delete failed", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => navigate("/student/articles");

  /* LOADING */
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b px-6 py-3 flex justify-between items-center">

        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen size={18} />
          <span className="text-sm font-semibold">
            Reading Mode
          </span>
        </div>

        <Button
          onClick={handleClose}
          variant="secondary"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

      </div>

      {/* CONTENT */}
      <div
        className="flex-1 flex justify-center px-4"
        onMouseUp={handleHighlight}
      >
        <div className="w-full max-w-3xl py-10">

          {/* TITLE */}
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 leading-tight">
            {article?.title}
          </h1>

          {/* CONTENT BLOCKS */}
          <div className="space-y-6 text-[18px] leading-8 text-gray-700">

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
                        alt=""
                        className="rounded-2xl shadow-lg hover:scale-[1.01] transition"
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
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border shadow-sm"
                    >
                      <PDFHighlight
                        url={block.value}
                        highlights={notes.filter(n => n.type === "pdf")}
                        onSaveHighlight={(highlight) => {
                          dispatch(setSelectedText(highlight.text));
                          dispatch(setNoteComment(""));

                          // store rect separately (you must add state)
                          setPdfHighlight(highlight);
                        }}
                      />
                    </div>
                  );

                case "document":
                  return (
                    <div
                      key={i}
                      className="bg-white border p-5 rounded-2xl flex justify-between items-center shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-indigo-600" />

                        <div>
                          <p className="font-medium">
                            Document
                          </p>
                          <p className="text-sm text-gray-500 break-all">
                            {block.value}
                          </p>
                        </div>
                      </div>

                      <a
                        href={block.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2"
                      >
                        <File size={16} />
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
            <div className="mt-14 bg-white border rounded-2xl p-6 shadow-sm">

              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <StickyNote size={18} />
                Your Highlights
              </h3>

              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg relative"
                  >
                    <div className="flex items-center justify-between">
                      <p className="italic text-gray-800">
                        "{note.text}"
                      </p>

                      {note.comment && (
                        <p className="text-sm text-gray-600">
                          {note.comment}
                        </p>
                      )}

                      <Button
                        onClick={() => setDeleteId(note._id)}
                        variant="danger"
                      >
                        <Trash2 size={18} />
                      </Button>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* FLOATING HIGHLIGHT MODAL */}
      {selectedText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">

          <div className="bg-white shadow-xl border rounded-xl p-4 w-[350px]">

            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Highlighter size={16} />
              <span className="text-sm font-medium">
                New Highlight
              </span>
            </div>

            <p className="text-sm italic text-gray-600 mb-2">
              "{selectedText}"
            </p>

            <textarea
              value={noteComment}
              onChange={(e) =>
                dispatch(setNoteComment(e.target.value))
              }
              placeholder="Add note..."
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <div className="flex justify-end gap-2 mt-3">
              <Button
                onClick={() => dispatch(clearHighlight())}
                variant="secondary"
              >
                Cancel
              </Button>

              <Button
                onClick={saveNote}
                variant="primary"
              >
                <Save size={14} />
                Save
              </Button>
            </div>

          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={loading}
      />
    </div>
  );
};

export default ArticleReader;