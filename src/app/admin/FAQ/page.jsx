"use client";
import Image from "next/image";
import React from "react";
import Card from "../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "FAQ Category Management",
      Icon: "/setting_icon/RelationshipManagement.png",
      // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/FAQcateManagement",
    },
    {
      title: "FAQ Q&A Management",
      Icon: "/setting_icon/RelationshipManagement.png",
      // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/FAQQAcategoryManagement",
    },
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
