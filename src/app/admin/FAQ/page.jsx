"use client";
import Image from "next/image";
import React from "react";
import Card from "../../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "FAQ Category ",
      Icon: "/setting_icon/RelationshipManagement.png",
      // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/FAQ/FAQcateManagement",
    },
    {
      title: "FAQ Q&A ",
      Icon: "/setting_icon/RelationshipManagement.png",
      // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/FAQ/faq_details",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-1 mt-2 rounded-xl flex flex-col gap-4">
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
                        FAQ
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
