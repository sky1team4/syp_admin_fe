import React from "react";
import Image from "next/image";
import Card from '../../components/cardmanagement'

const PaymentIntegration = () => {
  const paymentMethods = [
    {
      title: "Stripe",
      icon: "/paymentIntegration/s.svg",
      link: "#"
    },
    {
      title: "Paypal",
      icon: "/paymentIntegration/paypal.svg",
      link: "#"
    },
    {
      title: "Bank",
      icon: "/paymentIntegration/bank.svg",
      link: "#"
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 rounded-xl">
      <div className="flex flex-wrap w-full gap-4 items-center justify-start">
        {paymentMethods.map((card, index) => (
          <div className="" key={index}>
            <Card title={card.title} Icon={card.icon} link={card.link} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentIntegration;





// <div key={index} className=" w-52 h-32 bg-white shadow-lg hover:shadow-xl rounded-xl p-4 flex justify-between transform hover:-translate-y-1 transition-all duration-300">

//     <div className="flex flex-col justify-between">
//         {/* Icon */}
//         <Image src={method.icon} alt="Illustration" width={40} height={40} priority className="max-w-full h-auto object-cover"  />

//         {/* Title */}
//         <h2 className="text-lg font-semibold text-gray-700">
//             {method.title}
//         </h2>
//     </div>

//     {/* Buttons */}
//     <div className="flex flex-col justify-between">
//         <Image src="/paymentIntegration/i.svg" alt="Illustration" width={20} height={20} priority className="max-w-full h-auto object-cover"/>
//         <Image src="/paymentIntegration/arrow.svg" alt="Illustration" width={20}  height={10}  priority className="max-w-full h-auto object-cover"/>
//     </div>
// </div>