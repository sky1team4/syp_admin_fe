const FAQCard = ({ faq, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded p-4" >
      <h2 className="text-lg font-bold text-gray-800">{faq.question}</h2>
      <p className="text-gray-600">{faq.answer}</p>
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-600 focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FAQCard;
