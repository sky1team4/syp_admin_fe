"use client";
import Image from "next/image";
import React from "react";
// import Card from "../../admin/setting/Card";
import Card from "../../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Employ Status",
      Icon: "/workexperience/employment.png",
      // Icon: () => <Image src="/workexperience/employment.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/employmentManagement",
    },
    {
      title: "Job Title",
      Icon: "/workexperience/employment.png",

      // Icon: () => <Image src="/workexperience/jobtitle.png" width={50} height={50} alt="Education Icon" />,
      link: "/admin/jobTitleManagement",
    },
    {
      title: "Company Names",
      Icon: "/workexperience/companyname.png",

      // Icon: () => <Image src="/workexperience/companyname.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/companyNameManagement",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 rounded-xl flex flex-col gap-4">
      <div className="flex gap-3">
                    {/* {backBTN == "no" ? null : ( */}
                        <a href="/admin/profile-management" className="self-center cursor-pointer">

                            <Image
                                src="/backArrow.svg"  // path from public folder
                                alt="Illustration"
                                width={8}  // required in Next.js
                                height={8}
                            />
                        </a>
                    {/* )} */}
                    <h2 className="text-xl font-semibold text-gray-900">
                        Work Management
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
