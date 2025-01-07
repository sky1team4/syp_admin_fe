"use client"
import React, { useState, useEffect } from "react";

const AddRelationshipPopup = ({ onClose, onSave, editingRelationship }) => {
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    if (editingRelationship) {
      setRelationships([editingRelationship.title]);
    }
  }, [editingRelationship]);

  const handleAddNewInput = () => {
    setRelationships([...relationships, ""]);
  };

  const handleChangeRelationship = (index, value) => {
    const updated = [...relationships];
    updated[index] = value;
    setRelationships(updated);
  };

  const handleDeleteInput = (index) => {
    const updated = [...relationships];
    updated.splice(index, 1);
    setRelationships(updated);
  };

  const handleSave = () => {
    onSave(relationships);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {editingRelationship ? "Edit Relationship" : "Add Relationships"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition duration-300"
          >
            ✖️
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          {editingRelationship
            ? "Edit the selected relationship title below."
            : "Add new relationships by entering their titles."}
        </p>
        <div className="space-y-4">
          {relationships.map((relationship, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={relationship}
                onChange={(e) =>
                  handleChangeRelationship(index, e.target.value)
                }
                placeholder="Enter relationship title"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleDeleteInput(index)}
                className="ml-2 text-red-500 hover:text-red-600 transform hover:scale-105 transition duration-300"
              >
                🗑️
              </button>
            </div>
          ))}
          {!editingRelationship && (
            <button
              onClick={handleAddNewInput}
              className="text-indigo-500 hover:text-indigo-600 flex items-center font-medium"
            >
              + Add New Relationship
            </button>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRelationshipPopup;
