import React, { useState } from "react";
import { Trash2, BookOpen, Quote } from "lucide-react";
import {
  useStudentNotes,
  useHighlightMutations,
} from "../../hooks/useArticlesReader";
import Button from "../ui/Button";
import { toast } from "react-hot-toast";
import Loading from "../ui/Loading";
import ConfirmModal from "../ui/ConfirmModal"

const MyNotes = () => {
  const { data: notes = [], isLoading } = useStudentNotes();
  const { deleteMutation } = useHighlightMutations();

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting note...");

    try {
      setLoading(true);

      await deleteMutation.mutateAsync(deleteId);

      toast.success("Note deleted successfully", {
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
      <div className="max-w-6xl mx-auto space-y-8">

        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <span className="text-indigo-600">
              <BookOpen size={32} />
            </span>
            My Notes
          </h2>

          <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow">
            {notes.length} Notes
          </div>
        </div>

        {/* 🔥 EMPTY STATE */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm">

            <div className="mb-4 text-indigo-600"><BookOpen size={40} /></div>

            <p className="text-xl font-semibold text-gray-700">
              No notes yet
            </p>

            <p className="text-sm text-gray-400 mt-2 text-center max-w-md">
              You haven’t saved anything valuable yet. Start highlighting key
              insights while reading.
            </p>

          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {notes.map((note) => (
              <div
                key={note._id}
                className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between overflow-hidden"
              >

                {/* 🔥 HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-indigo-50 to-transparent" />

                <div className="relative z-10">

                  {/* 🔹 ARTICLE TAG */}
                  <span className="inline-block text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                    {note.articleId?.title || "Unknown Article"}
                  </span>

                  {/* 🔹 HIGHLIGHT */}
                  <div className="mt-5 flex gap-3">

                    <Quote className="text-indigo-400 mt-1 shrink-0" size={20} />

                    <p className="text-gray-800 text-sm leading-relaxed italic line-clamp-4">
                      {note.text}
                    </p>
                  </div>

                  {/* 🔹 COMMENT */}
                  {note.comment && (
                    <div className="mt-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        <span className="font-semibold text-gray-800">
                          Comment:
                        </span>{" "}
                        {note.comment}
                      </p>
                    </div>
                  )}
                </div>

                {/* 🔥 FOOTER */}
                <div className="relative z-10 flex justify-between items-center mt-6 pt-4 border-t">

                  {note.createdAt && (
                    <p className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  )}

                  <Button
                    onClick={() => setDeleteId(note._id)}
                    variant="danger"
                    className="opacity-70 hover:opacity-100 transition"
                  >
                    <Trash2 size={18} />
                  </Button>

                </div>
              </div>
            ))}

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
    </div>
  );
};

export default MyNotes;