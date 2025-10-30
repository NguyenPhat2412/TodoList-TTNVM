import React from "react";
import { ModalConfirmDeleteProps } from "../types/types";

const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Are you sure you want to delete this {itemType}:{" "}
          <strong className="text-gray-800">{itemName}</strong>?
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
