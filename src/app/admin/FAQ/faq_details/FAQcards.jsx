import Image from "next/image";
const FAQCard = ({ faq, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col gap-3" >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
        <div className="flex justify-end gap-2 mb-6 md:mt-4 lg:mt-6 xl:mt-8">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            <Image src="/editTable.svg" alt="edit" width="20" height="20" className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 focus:outline-none"
          >
            <Image src="/delete.svg" alt="delete" width="20" height="20" className="w-5 h-5" />
          </button>
        </div>

      </div>
      <p className="text-gray-600">{faq.answer}</p>
      <div className="flex flex-wrap justify-start items-center gap-3 mt-3">
        <div className="text-purple-600 border border-purple-600 px-2 py-1 rounded-md cursor-pointer">Survey Questions</div>
        <div className="text-purple-600 border border-purple-600 px-2 py-1 rounded-md cursor-pointer">Created Date: {faq.createdDate}</div>
        <div className="text-purple-600 border border-purple-600 px-2 py-1 rounded-md cursor-pointer">Updated Date: {faq.updatedDate}</div>
      </div>
    </div>
  );
};

export default FAQCard;
