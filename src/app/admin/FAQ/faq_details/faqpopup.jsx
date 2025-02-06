"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

const AddFAQPopup = ({ onClose, onSave, editingFAQ }) => {
  const [category, setCategory] = useState("Survey Questions");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (editingFAQ) {
      setCategory(editingFAQ.category || "Survey Questions");
      setQuestion(editingFAQ.question || "");
      setAnswer(editingFAQ.answer || "");
    } else {
      setCategory("Survey Questions");
      setQuestion("");
      setAnswer("");
    }
  }, [editingFAQ]);

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      alert("Both Question and Answer are required.");
      return;
    }
    onSave({ category, question, answer });
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-black bg-opacity-50 flex items-center justify-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-screen p-6 shadow-lg relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-semibold text-gray-800">Add FAQ Q/A</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
            aria-label="Close"
          >
            <Image src="/FAQ/cross.png" alt="close" width={20} height={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-6">
          Lorem Ipsum has been the industry's standard.
        </p>

        {/* FAQ Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
            FAQ Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Survey Questions">Survey Questions</option>
            <option value="General">General</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="question">
            Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="answer">
            Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-purple-500 text-white font-medium py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddFAQPopup;
