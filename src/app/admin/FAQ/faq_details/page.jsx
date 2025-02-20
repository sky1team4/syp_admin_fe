"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqQas, createFaqQa, updateFaqQa, deleteFaqQa } from "@/redux/features/faqQaSlice";
import { fetchFaqCategories } from "@/redux/features/faqCateSlice";
import FAQCard from "./FAQcards";
import FAQPopup from "./faqpopup";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from 'react-hot-toast';

const FAQManagement = () => {
  const dispatch = useDispatch();
  const { items: faqs, isLoading: faqsLoading, error: faqsError } = useSelector((state) => state.faqQa);
  const { isLoading: categoriesLoading } = useSelector((state) => state.faqCategory);
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);

  useEffect(() => {
    dispatch(fetchFaqCategories());
    dispatch(fetchFaqQas());
  }, [dispatch]);

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setShowModal(true);
  };

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq);
    setShowModal(true);
  };

  const handleDeleteFAQ = async (id) => {
    try {
      await dispatch(deleteFaqQa(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFAQ(null);
  };

  const handleSaveFAQ = async (newFAQ) => {
    try {
      if (editingFAQ) {
        await dispatch(updateFaqQa({
          id: editingFAQ.id,
          data: newFAQ
        })).unwrap();
      } else {
        await dispatch(createFaqQa(newFAQ)).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save FAQ:', error);
    }
  };

  // Initial Loading State
  if (faqsLoading || categoriesLoading) {
    return (
      <div className="w-full min-h-screen mx-auto p-4 bg-white rounded-xl">
        {/* Header with loading state */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/admin/FAQ" className="self-center cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="/backArrow.svg"
                alt="Back"
                width={8}
                height={8}
                className="w-6 h-6"
              />
            </Link>
            <h1 className="text-base sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">
              FAQ Q/A Management
            </h1>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Loading animation */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading FAQ data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (faqsError) {
    return (
      <div className="w-full min-h-screen mx-auto p-4 bg-white rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/admin/FAQ" className="self-center cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="/backArrow.svg"
                alt="Back"
                width={8}
                height={8}
                className="w-6 h-6"
              />
            </Link>
            <h1 className="text-base sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">
              FAQ Q/A Management
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
          <div className="text-red-600 text-xl mb-4">Error: {faqsError}</div>
          <button
            onClick={() => {
              dispatch(fetchFaqCategories());
              dispatch(fetchFaqQas());
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full mx-auto p-4 bg-white rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/admin/FAQ" className="self-center cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="/backArrow.svg"
                alt="Back"
                width={8}
                height={8}
                className="w-6 h-6"
              />
            </Link>
            <h1 className="text-base sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">
              FAQ Q/A Management
            </h1>
          </div>
          <button
            onClick={handleAddFAQ}
            className="bg-purple-600 text-white rounded-md px-4 py-2 text-sm md:text-base 
                     hover:bg-purple-700 transition-colors duration-200"
          >
            Add FAQ
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {faqs.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="bg-purple-50 rounded-full p-6 mb-4">
                <svg
                  className="w-12 h-12 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No FAQs Found</h3>
              <p className="text-gray-500 text-center mb-6 max-w-sm">
                Get started by creating your first FAQ Q/A to help your users find answers to common questions.
              </p>
              <button
                onClick={handleAddFAQ}
                className="bg-purple-600 text-white rounded-md px-6 py-2
                         hover:bg-purple-700 transition-colors duration-200"
              >
                Create First FAQ
              </button>
            </div>
          ) : (
            // FAQ List
            faqs.map((faq) => (
              <FAQCard
                key={faq.id}
                faq={faq}
                onEdit={() => handleEditFAQ(faq)}
                onDelete={() => handleDeleteFAQ(faq.id)}
              />
            ))
          )}
        </div>

        {/* FAQ Modal */}
        {showModal && (
          <FAQPopup
            onClose={handleCloseModal}
            onSave={handleSaveFAQ}
            editingFAQ={editingFAQ}
          />
        )}
      </div>
    </>
  );
};

export default FAQManagement;
