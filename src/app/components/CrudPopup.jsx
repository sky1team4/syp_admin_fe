import React, { useState, useEffect } from "react";

const AddRelationshipPopup = ({ onClose, onSave, editingRelationship }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingRelationship) {
      // Prefill the title when editing
      setTitle(editingRelationship.title);
    } else {
      // Clear the title for new entries
      setTitle("");
    }
  }, [editingRelationship]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Relationship Title is required.");
      return;
    }

    // Pass only the title to the parent, dates will be auto-managed in the parent
    onSave([title]);
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-black bg-opacity-50 flex items-center justify-center justify-end z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50 h-screen">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editingRelationship ? "Edit Relationship" : "Add Relationship"}
        </h2>
        <div className="flex flex-col space-y-4">
          {/* Relationship Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Relationship Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRelationshipPopup;
