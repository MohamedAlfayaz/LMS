import React from "react";
import Button from "./Button"; // adjust path if needed
import { FiTrash2, FiX } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">
        
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500 mb-5">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3">
          
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={loading}
          >
            <FiX />
            {cancelText}
          </Button>

          <Button
            onClick={onConfirm}
            variant="danger"
            disabled={loading}
          >
            <FiTrash2 />
            {loading ? "Processing..." : confirmText}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;