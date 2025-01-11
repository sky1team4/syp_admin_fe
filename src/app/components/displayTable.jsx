import React from "react";
import Image from "next/image";
import Button from './ui/button'

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
      <div className="flex justify-between w-full ">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {info.title}
        </h2>
        {
          info.click? <Button click={info.click} isOpen={info.isOpen} h="10" text={info.btnText} /> : ""
        }
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-400 border-b">
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
                <button className="">
                  <Image
                    src="/EditTable.svg"
                    width={20}
                    height={20}
                    alt="icon"
                  />
                </button>
                {/* Delete Action */}
                <button className="">
                  <Image
                    src="/delete.svg"
                    width={20}
                    height={20}
                    alt="icon"
                  />
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
