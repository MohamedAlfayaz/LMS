import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Trash2 } from "lucide-react";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/student/highlights");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/student/highlights/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className=" ">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
          📝 My Notes
        </h2>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white p-16 rounded-3xl shadow-md border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              You haven’t saved any highlights yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Start reading articles and highlight something meaningful.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  {/* Article Tag */}
                  <span className="inline-block text-xs font-semibold tracking-wide px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                    {note.articleId?.title || "Unknown Article"}
                  </span>

                  {/* Highlight */}
                  <div className="mt-4 border-l-4 border-yellow-400 pl-4">
                    <p className="text-gray-800 text-base leading-relaxed italic line-clamp-4">
                      “{note.text}”
                    </p>
                  </div>

                  {/* Comment */}
                  {note.comment && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        <span className="font-semibold text-gray-800">
                          Comment:
                        </span>{" "}
                        {note.comment}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-center mt-6">
                  {note.createdAt && (
                    <p className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  )}

                  <button
                    onClick={() => deleteNote(note._id)}
                    className="opacity-0 group-hover:opacity-100 transition duration-200 text-red-500 hover:bg-red-50 p-2 rounded-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyNotes;
