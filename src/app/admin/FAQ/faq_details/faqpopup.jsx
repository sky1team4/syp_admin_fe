"use client"
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "react-hot-toast";

const FAQPopup = ({ onClose, onSave, editingFAQ }) => {
  const { items: categories } = useSelector((state) => state.faqCategory);
  const popupRef = useRef(null);
  
  const [formData, setFormData] = useState({
    categoryId: "",
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (editingFAQ) {
      setFormData({
        categoryId: editingFAQ.categoryFk?.toString() || "",
        question: editingFAQ.question || "",
        answer: editingFAQ.answer || "",
      });
    }
  }, [editingFAQ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleSave = () => {
    // Validate all fields
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    if (!formData.answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div ref={popupRef} className="bg-white w-full max-w-[320px] h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingFAQ ? 'Edit FAQ Q/A' : 'Add FAQ Q/A'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Image src="/FAQ/cross.png" alt="close" width={20} height={20} />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mb-6">
            Lorem Ipsum has been the industry's standard.
          </p>

          {/* Category Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="categoryId">
              FAQ Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="question">
              Question *
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="answer">
              Answer *
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPopup;
