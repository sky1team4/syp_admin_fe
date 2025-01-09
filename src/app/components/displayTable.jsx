import React from "react";

const TableComponent = (info) => {
  // Mock data for subscriptions
  // const subscriptions = [
  //   {
  //     title: "Monthly Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  //   {
  //     title: "Professional Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  //   {
  //     title: "Special Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  //   {
  //     title: "Annual Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  // ];

  return (
    <div className="p-6 h-full bg-white shadow-lg rounded-xl">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {info.title}
      </h2>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-600">
            <th className="py-3 px-4">{info.col1_Title}</th>
            <th className="py-3 px-4">{info.col2_Title}</th>
            <th className="py-3 px-4">{info.col3_Title}</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {info.array.map((subscription, index) => (
            <tr
              key={index}
              className="text-sm text-gray-700 hover:bg-gray-100 border-b"
            >
              <td className="py-8 px-4">{subscription.title}</td>
              <td className="py-8 px-4">{subscription.createdDate}</td>
              <td className="py-8 px-4">{subscription.lastUpdated}</td>
              <td className="py-8 px-4 flex space-x-2">
                {/* Edit Action */}
                <button className="text-purple-600 hover:text-purple-800">
                  ✏️
                </button>
                {/* Delete Action */}
                <button className="text-red-600 hover:text-red-800">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
