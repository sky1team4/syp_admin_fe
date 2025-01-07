"use client";
import Image from "next/image";
import React from "react";
// import Card from "../../components/Card";
import Card from "../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Interest Management",
      Icon:"/profilemanagement/interestedmanagement.png",
      // Icon: () => <Image src="/profilemanagement/interestedmanagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    },
    {
      title: "Skills Category List",
      Icon:"/profilemanagement/skillcategory.png",

      // Icon: () => <Image src="/profilemanagement/skillcategory.png" width={50} height={50} alt="Education Icon" />,
      link: "#",
    },
    {
      title: "Skills Subcategory List",
      Icon:"/profilemanagement/skillcategory.png",

      // Icon: () => <Image src="/profilemanagement/skillssubcategory.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    },
    {
      title: "Work Experience",
      Icon:"/profilemanagement/skillcategory.png",

      // Icon: () => <Image src="/profilemanagement/workexperience.png" width={50} height={50} alt="Education Icon" />,
      link: "/admin/work-experience",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 rounded-xl">
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
