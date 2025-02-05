"use client";
import Image from "next/image";
import React from "react";
import Card from "../../../components/cardmanagement";

const SettingContentArea = () => {
  const cards = [
    {
      title: "Relationship Management",
      Icon: "/setting_icon/RelationshipManagement.png",
      // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
      link: "/admin/relationshipManagement",
    },
    // {
    //   title: "Degree Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/degreeManagement",
    // },
    // {
    //   title: "Employment Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/employmentManagement",
    // },
    // {
    //   title: "Interest Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/InterestManagement",
    // },
    // {
    //   title: "Q&A Catogory Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/QAcateManagement",
    // },
    // {
    //   title: "Job Title Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/jobTitleManagement",
    // },
    // {
    //   title: "Skill Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/skillManagement",
    // },
    // {
    //   title: "Study Field Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/studyFieldManagement",
    // },
    // {
    //   title: "Company Name Management",
    //   Icon: "/setting_icon/RelationshipManagement.png",
    //   // Icon: () => <Image src="/setting_icon/RelationshipManagement.png" width={50} height={50} alt="Relationship Icon" />,
    //   link: "/admin/companyNameManagement",
    // },
    {
      title: "Education Management",
      Icon: "/setting_icon/EducationManagement.png",
      // Icon: () => <Image src="/setting_icon/EducationManagement.png" width={50} height={50} alt="Education Icon" />,
      link: "/admin/education-management",
    },
    {
      title: "Specialty Management",
      Icon: "/setting_icon/SpecialtyManagement.png",
      // Icon: () => <Image src="/setting_icon/SpecialtyManagement.png" width={50} height={50} alt="Specialty Icon" />,
      link: "/admin/specialtyManagement",
    },
    {
      title: "Profile Management",
      Icon: "/setting_icon/profilemanagement.png",
      // Icon: () => <Image src="/setting_icon/profilemanagement.png" width={50} height={50} alt="Profile Icon" />,
      link: "/admin/profile-management",
    },
    {
      title: "RSS Feed Category",
      Icon: "/setting_icon/category.png",
      // Icon: () => <Image src="/setting_icon/category.png" width={50} height={50} alt="Category Icon" />,
      link: "/admin/rssFeedManagement",
    },
    {
      title: "FAQ",
      Icon: "/setting_icon/FAQ.png",
      // Icon: () => <Image src="/setting_icon/FAQ.png" width={50} height={50} alt="FAQ Icon" />,
      link: "/admin/FAQ",
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
