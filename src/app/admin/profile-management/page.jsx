"use client";
import Image from "next/image";
import React from "react";
// import Card from "../../components/Card";
import Card from "../../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Interest Management",
      Icon: "/profilemanagement/interestedmanagement.png",
      // Icon: () => <Image src="/profilemanagement/interestedmanagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/InterestManagement",
    },
    {
      title: "Skills Category List",
      Icon: "/profilemanagement/skillcategory.png",

      // Icon: () => <Image src="/profilemanagement/skillcategory.png" width={50} height={50} alt="Education Icon" />,
      link: "/admin/skillManagement",
    },

    {
      title: "Skills Subcategory List",
      Icon: "/profilemanagement/skillcategory.png",

      // Icon: () => <Image src="/profilemanagement/skillssubcategory.png" width={50} height={50} alt="Relationship Icon" />,
      link: "#",
    },
    {
      title: "Work Experience",
      Icon: "/profilemanagement/skillcategory.png",

      // Icon: () => <Image src="/profilemanagement/workexperience.png" width={50} height={50} alt="Education Icon" />,
      link: "/admin/work-experience",
    }
  ];

  return (
    <div className="h-auto w-full bg-white p-4 rounded-xl flex flex-col gap-4">
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
                        Profile Management
                    </h2>

                </div>
      <div className="flex flex-wrap w-full gap-4 items-center justify-center md:justify-start">
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
