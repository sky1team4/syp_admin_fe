"use client";
import Image from "next/image";
import React from "react";
import Card from "../../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Degrees List",
      Icon: "/educationmanagement/degree list.png",
      // Icon: () => <Image src="/educationmanagement/degree list.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/degreeManagement",
    },
    {
      title: "Field of Study",
      Icon: "/educationmanagement/field of study.png",
      // Icon: () => <Image src="/educationmanagement/field of study.png" width={50} height={50} alt="Education Icon" />,
      link: "/admin/specialtyManagement",
    }
  ];

  return (
    <div className="md:h-full w-full bg-white rounded-xl flex flex-col p-2 gap-4">
      <div className="flex gap-3">
          {/* {backBTN == "no" ? null : ( */}
              <a href="/admin/setting" className="self-center cursor-pointer">

                  <Image
                      src="/backArrow.svg"  // path from public folder
                      alt="Illustration"
                      width={8}  // required in Next.js
                      height={8}
                  />
              </a>
          {/* )} */}
          <h2 className="text-xl font-semibold text-gray-900">
              Education Management
          </h2>

      </div>
      <div className="flex flex-wrap w-full gap-4 items-center justify-start">

        {cards.map((card, index) => (
          <div className="" key={index}>
            <Card title={card.title} Icon={card.Icon} link={card.link} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingContentArea;
