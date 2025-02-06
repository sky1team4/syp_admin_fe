"use client";

import React, { useState } from "react";
import FAQCard from "./FAQcards";
import FAQPopup from "./faqpopup";
import Image from "next/image";
import Link from "next/link";

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'What makes "Your Semester" resume builder unique?',
      answer:
        "Lorem Ipsum has been the industry's standard dummy text ever since Lorem Ipsum has been the industry's standard dummy text ever since the Lorem Ipsum has been the industry's standard dummy text ever.",
      createdDate: "27/02/2024",
      updatedDate: "27/02/2024",
    },
    // Add more FAQ objects here...
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setShowModal(true);
  };

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq);
    setShowModal(true);
  };

  const handleDeleteFAQ = (id) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveFAQ = (newFAQ) => {
    if (editingFAQ) {
      // Editing an existing FAQ
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === editingFAQ.id
            ? { ...faq, ...newFAQ, updatedDate: new Date().toLocaleDateString() }
            : faq
        )
      );
    } else {
      // Adding a new FAQ
      const newEntry = {
        id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
        ...newFAQ,
        createdDate: new Date().toLocaleDateString(),
        updatedDate: new Date().toLocaleDateString(),
      };
      setFaqs((prev) => [...prev, newEntry]);
    }
    handleCloseModal();
  };

  return (
    <div className="w-full h-screen mx-auto p-4 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
        <a href="/admin/FAQ" className="self-center cursor-pointer">
                            <Image
                                src="/backArrow.svg"  // path from public folder
                                alt="Illustration"
                                width={8}  // required in Next.js
                                height={8}

                            />
                        </a>
        <h1 className="text-2xl font-semibold text-gray-800">FAQ Q/A Management</h1>
        </div>
        <button

          onClick={handleAddFAQ}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Add FAQ Q/A
        </button>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <FAQCard
            key={faq.id}
            faq={faq}
            onEdit={() => handleEditFAQ(faq)}
            onDelete={() => handleDeleteFAQ(faq.id)}
          />
        ))}
      </div>

      {showModal && (
        <FAQPopup
          onClose={handleCloseModal}
          onSave={handleSaveFAQ}
          editingFAQ={editingFAQ}
        />
      )}
    </div>
  );
};

export default FAQManagement;
