"use client";

import React, { useState } from "react";
import data from "../../../../lib/relationshipdata"; // Import JSON data
import AddRelationshipPopup from "../../../components/CrudPopup"; // Import the popup component

const RelationshipManagement = () => {
  const [relationships, setRelationships] = useState(Array.isArray(data) ? data : []);
  const [showModal, setShowModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);

  const handleAddRelationship = () => {
    setEditingRelationship(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveRelationships = (newRelationships) => {
    if (editingRelationship) {
      setRelationships((prev) =>
        prev.map((rel) =>
          rel.id === editingRelationship.id
            ? { ...rel, title: newRelationships[0], lastUpdated: new Date().toLocaleDateString() }
            : rel
        )
      );
    } else {
      const newEntries = newRelationships.map((title) => ({
        id: Math.random().toString(36).substr(2, 9),
        title,
        createdDate: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleDateString(),
      }));
      setRelationships([...relationships, ...newEntries]);
    }
    handleCloseModal();
  };

  const handleEditRelationship = (relationship) => {
    setEditingRelationship(relationship);
    setShowModal(true);
  };

  const handleDeleteRelationship = (id) => {
    setRelationships((prev) => prev.filter((rel) => rel.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col gap-4 relative">
      <div className="flex justify-between items-center mr-2">
        <h1 className="text-xl font-bold text-gray-800">Relationship Management</h1>
        <button
          onClick={handleAddRelationship}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
        >
          + Add Relationship
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden mr-2">
        <table className="min-w-full table-auto border-collapse border-spacing-0">
          <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Relationship Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {relationships.map((relationship) => (
              <tr key={relationship.id} className="hover:bg-gray-50 transition duration-300">
                <td className="px-6 py-4 text-gray-800 font-medium">{relationship.title}</td>
                <td className="px-6 py-4 text-gray-600">{relationship.createdDate}</td>
                <td className="px-6 py-4 text-gray-600">{relationship.lastUpdated}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleEditRelationship(relationship)}
                    className="text-indigo-500 hover:text-indigo-600 focus:outline-none transform hover:scale-105 transition duration-300"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteRelationship(relationship.id)}
                    className="text-red-500 hover:text-red-600 focus:outline-none transform hover:scale-105 transition duration-300"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0  bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300"></div>

          {/* Popup */}
          <AddRelationshipPopup
            className="transition-transform duration-1min transform translate-x-full animate-slide-in fixed inset-0 z-50"
            onClose={handleCloseModal}
            onSave={handleSaveRelationships}
            editingRelationship={editingRelationship}
          />
        </>
      )}
    </div>
  );
};

export default RelationshipManagement;
