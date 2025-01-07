"use client";
import Image from "next/image";
import React from "react";
import Card from "../setting/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Interest Management",
      Icon: () => <Image src="/profilemanagement/interestedmanagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    },
    {
      title: "Skills Category List",
      Icon: () => <Image src="/profilemanagement/skillcategory.png" width={50} height={50} alt="Education Icon" />,
      link: "#",
    },
    {
      title: "Skills Subcategory List",
      Icon: () => <Image src="/profilemanagement/skillssubcategory.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    },
    {
      title: "Work Experience",
      Icon: () => <Image src="/profilemanagement/workexperience.png" width={50} height={50} alt="Education Icon" />,
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
