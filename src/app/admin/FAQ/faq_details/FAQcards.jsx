import Image from "next/image";
import { useSelector } from "react-redux";
import { useState } from "react";
import ConfirmationPopup from "./ConfirmationPopup";

const FAQCard = ({ faq, onEdit, onDelete }) => {
  const { items: categories } = useSelector((state) => state.faqCategory);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Find the category name using categoryFk
  const categoryName = categories.find(cat => cat.id === faq.categoryFk)?.name || 'Unknown Category';

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDelete(faq.id);
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  console.log(faq.createDate)
  console.log(faq.updateDate)
  const createdDate = new Date(faq.createDate).toLocaleDateString();
  const lastUpdated = new Date(faq.updateDate).toLocaleDateString();

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3" >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
          <div className="flex justify-end gap-2 mb-6 md:mt-4 lg:mt-6 xl:mt-8">
            <button
              onClick={() => onEdit(faq)}
              className="text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <Image src="/EditTable.svg" alt="edit" width="20" height="20" className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-600 focus:outline-none"
            >
              <Image src="/delete.svg" alt="delete" width="20" height="20" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-600">{faq.answer}</p>
        <div className="flex flex-wrap justify-start items-center gap-3 mt-3">
          <div className="text-purple-600 border border-purple-600 px-2 py-1 rounded-md">
            {categoryName}
          </div>
          <div className="text-purple-600 border border-purple-600 px-2 py-1 rounded-md">Created Date: {createdDate}</div>
          <div className="text-purple-600 border border-purple-600 px-2 py-1 rounded-md">Updated Date: {lastUpdated}</div>
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the FAQ: "${faq.question}"?`}
      />
    </>
  );
};

export default FAQCard;
