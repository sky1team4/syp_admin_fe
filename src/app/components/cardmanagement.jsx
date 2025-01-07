import Image from "next/image";

const Card = ({ title, Icon, link }) => (

      <a href={link} className="text-purple-500 text-xl" title="Go to page">
  <div className="bg-white rounded-2xl h-44 w-80 p-4 sm:p-6 flex flex-col justify-center items-center hover:shadow-lg transition-shadow duration-200">
    <div className="flex justify-between w-full items-center">
      <div className="text-purple-500 text-[50px]">
        {/* <Icon />  */}
        <Image src={Icon} alt="Illustration" width={60} height={60} priority className="max-w-full h-auto object-cover"  />
      </div>
        <Image alt="arrow" src="/setting_icon/arrow.png" width={20} height={20} />
    </div>
    <div className="flex w-full justify-between items-center">
      <h3 className="text-gray-800 font-semibold text-md mt-10">{title}</h3>
      <div className="mt-10 text-purple-500 text-sm flex items-center space-x-2">
        <Image alt="icon" src="/setting_icon/icon.png" width={20} height={20} />
      </div>
    </div>
  </div>
      </a>
);

export default Card;
