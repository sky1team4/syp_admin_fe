import React from "react";
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { savePaypalConfig } from "../../../../redux/features/paypalSlice";


// UI Components
import Input from "../../../../components/cui/input";
import Dropdown from "../../../../components/cui/dropdown";
import CustomCheckbox from "@/components/cui/customCheckbox";

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "INR"];
const ENVIRONMENTS = ["sandbox", "production"];

const FORM_VALIDATION = {
  clientId: { required: "Client ID is required" },
  clientSecret: { required: "Client Secret is required" },
  webhookId: { required: "Webhook ID is required" },
  environment: { required: "Environment is required" },
  defaultCurrency: { required: "Default Currency is required" }
};

const PaypalPaymentIntegration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.paypal);

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        client_id: data.clientId,
        client_secret: data.clientSecret,
        webhook_id: data.webhookId,
        environment: data.environment,
        default_currency: data.defaultCurrency,
        merchant_acc_id: data.merchantAccountId || "",
        paypal_payment: data.enablePaypal ? "enabled" : "disabled"
      };
      
      await dispatch(savePaypalConfig(transformedData)).unwrap();
      toast.success("PayPal configuration saved successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to save PayPal configuration");
    }
  };

  return (
    <div className="w-full max-w-[32rem] md:max-w-[40rem] xl:max-w-[60rem] 2xl:max-w-[80rem] h-auto p-4 md:p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-3 justify-center">
        {/* {backBTN == "no" ? null : ( */}
            <a href="/admin/payment" className="self-center cursor-pointer">
                <Image
                    src="/backArrow.svg"  // path from public folder
                    alt="Illustration"
                    width={8}  // required in Next.js
                    height={8}
                />
            </a>
        {/* )} */}
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 text-center">PayPal Payment Integration</h1>
    </div>
      <p className="text-gray-500 mb-4 text-center">Configure your PayPal account settings below.</p>
      <Toaster position="top-right" />
      

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* API Credentials Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="clientId" {...register("clientId", FORM_VALIDATION.clientId)}
            label="Client ID *" placeholder="Enter your Client ID"
            error={errors.clientId?.message} />
          <Input id="clientSecret" {...register("clientSecret", FORM_VALIDATION.clientSecret)}
            label="Client Secret *" placeholder="Enter your Client Secret"
            error={errors.clientSecret?.message} />
        </div>

        {/* Webhook & Environment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="webhookId" {...register("webhookId", FORM_VALIDATION.webhookId)}
            label="Webhook ID *" placeholder="Enter your Webhook ID"
            error={errors.webhookId?.message} />
          <Dropdown id="environment" register={register("environment", FORM_VALIDATION.environment)}
            label="Environment *" array={ENVIRONMENTS} selected="Select Below"
            error={errors.environment?.message} />
        </div>

        {/* Currency Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="merchantAccountId" {...register("merchantAccountId")} label="Merchant Account ID (Optional)" placeholder="Enter Merchant Account ID" />
          <Dropdown id="defaultCurrency" register={register("defaultCurrency", FORM_VALIDATION.defaultCurrency)}
            label="Default Currency *" array={CURRENCIES} selected="Select Below"
            error={errors.defaultCurrency?.message} />
        </div>

        {/* Enable PayPal Section */}
        <div className="flex justify-between items-center">
          <label htmlFor="enablePaypal" className="text-sm font-medium text-gray-700">Enable PayPal Payments</label>
          <CustomCheckbox id="enablePaypal" {...register("enablePaypal")} defaultChecked={false} />
        </div>

        {/* Submit Button */}
        <button type="submit"
          className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-700 disabled:opacity-50"
          disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default PaypalPaymentIntegration;
