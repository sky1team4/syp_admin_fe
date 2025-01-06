import React from "react";
import Image from "next/image";

const PaymentIntegration = () => {
  const paymentMethods = [
    {
      name: "Stripe",
      icon: "/paymentIntegration/s.svg",
    },
    {
      name: "Paypal",
      icon: "/paymentIntegration/paypal.svg",
    },
    {
      name: "Bank",
      icon: "/paymentIntegration/bank.svg",
    },
  ];

  return (
    <div className="p-6 w-full min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Payment Integration
        </h1>
        <div className="flex gap-6">
            {paymentMethods.map((method, index) => (
            <div key={index} className=" w-52 h-32 bg-white shadow-lg hover:shadow-xl rounded-xl p-4 flex justify-between transform hover:-translate-y-1 transition-all duration-300">

                <div className="flex flex-col justify-between">
                    {/* Icon */}
                    <Image src={method.icon} alt="Illustration" width={40} height={40} priority className="max-w-full h-auto object-cover"  />

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-700">
                        {method.name}
                    </h2>
                </div>

                {/* Buttons */}
                <div className="flex flex-col justify-between">
                    <Image src="/paymentIntegration/i.svg" alt="Illustration" width={20} height={20} priority className="max-w-full h-auto object-cover"/>
                    <Image src="/paymentIntegration/arrow.svg" alt="Illustration" width={20}  height={10}  priority className="max-w-full h-auto object-cover"/>
                </div>
            </div>
            ))}
        </div>
    </div>
  );
};

export default PaymentIntegration;
