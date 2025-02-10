// FAQManagement.jsx
import React from "react";
import FAQCard from "./FAQcards";

const FAQManagement = () => {
  const faqs = [
    {
      id: 1,
      question: 'What makes "Your Semester" resume builder unique?',
      answer:
        "Lorem Ipsum has been the industry's standard dummy text ever since th Lorem Ipsum has been the industry's standard dummy text ever since the Lorem Ipsum has been the industry's standard dummy text ever.",
      createdDate: "27/02/2024",
      updatedDate: "27/02/2024",
    },
    // Add more FAQ objects here...
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">FAQ Q/A </h1>
        <Button text="Add FAQ Q/A" click={() => console.log('Add FAQ Q/A clicked')} w="10rem" />
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <FAQCard key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
};

export default FAQManagement;
