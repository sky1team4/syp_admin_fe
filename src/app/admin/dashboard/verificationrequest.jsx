import React, { useState } from "react";
import Image from '../../../../public/pp.jpg'

const VerificationRequest = () => {
  const [isOpen, setIsOpen] = useState(true);
    // setIsOpen(status)

  const documents = [
    {
      id: 1,
      label: "Front Side",
      fileName: "Front Side.pdf",
      fileSize: "1MB",
      imageUrl: "https://via.placeholder.com/150", // Replace with the actual front side image URL
    },
    {
      id: 2,
      label: "Back Side",
      fileName: "Back Side.pdf",
      fileSize: "1MB",
      imageUrl: "https://via.placeholder.com/150", // Replace with the actual back side image URL
    },
  ];

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Verification Request
        </h2>

        {/* Document List */}
        <div className="flex space-x-4 justify-center mb-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border rounded-lg shadow-sm bg-gray-50 w-40 p-2 relative"
            >
              <img
                src={Image}
                alt={doc.label}
                className="rounded-md mb-2"
              />
              <div className="absolute top-2 right-2">
                <button
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => setIsOpen(false)} // Replace with remove logic
                >
                  ✕
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{doc.label}</p>
                <p className="text-xs text-gray-500">{doc.fileName}</p>
                <p className="text-xs text-gray-500">{doc.fileSize}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => {
              
              setIsOpen(false);
            }}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequest;
