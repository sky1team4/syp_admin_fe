import Image from "next/image";

const Card = ({ title, Icon, link }) => (

  <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col justify-center items-center hover:shadow-lg transition-shadow duration-200">
    <div className="flex justify-between w-full items-center">
      <div className="text-purple-500 text-[50px]">
        <Icon /> 
      </div>
      <a href={link} className="text-purple-500 text-xl" title="Go to page">
        <Image alt="arrow" src="/setting_icon/arrow.png" width={20} height={20} />
      </a>
    </div>
    <div className="flex w-full justify-between items-center">
      <h3 className="text-gray-800 font-semibold text-md mt-10">{title}</h3>
      <div className="mt-10 text-purple-500 text-sm flex items-center space-x-2">
        <Image alt="icon" src="/setting_icon/icon.png" width={20} height={20} />
      </div>
    </div>
  </div>
);

export default Card;
