"use client";
import Image from "next/image";
import React from "react";
import Card from "../setting/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Employ Status",
      Icon: () => <Image src="/workexperience/employment.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    },
    {
      title: "Job Title",
      Icon: () => <Image src="/workexperience/jobtitle.png" width={50} height={50} alt="Education Icon" />,
      link: "#",
    },
    {
      title: "Company Names",
      Icon: () => <Image src="/workexperience/companyname.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 rounded-xl">
      <div className="flex flex-wrap w-full gap-4 items-center justify-start">
        {cards.map((card, index) => (
          <div className="w-full sm:w-1/4" key={index}>
            <Card title={card.title} Icon={card.Icon} link={card.link} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingContentArea;
