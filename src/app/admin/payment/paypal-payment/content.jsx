import React, { useEffect } from "react";
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { savePaypalConfig, fetchPaypalConfig } from "../../../../redux/features/paypalSlice";


// UI Components
import Input from "../../../../components/cui/input";
import Dropdown from "../../../../components/cui/dropdown";
import CustomCheckbox from "@/components/cui/customCheckbox";
import theme from "../../../../app/theme";
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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      clientId: '',
      clientSecret: '',
      webhookId: '',
      environment: '',
      defaultCurrency: '',
      merchantAccountId: '',
      // enablePaypal: false,
      testMode: false
    }
  });
  const dispatch = useDispatch();
  const { isLoading, config } = useSelector((state) => state.paypal);

  // Fetch config when component mounts
  useEffect(() => {
    dispatch(fetchPaypalConfig());
  }, [dispatch]);

  // Watch both values
  const enablePaypal = watch('enablePaypal');
  const testMode = watch('testMode');
  
  useEffect(() => {
    console.log('Enable PayPal changed:', enablePaypal);
  }, [enablePaypal]);

  useEffect(() => {
    console.log('Test mode changed:', testMode);
  }, [testMode]);

  // Set form values when config is loaded
  useEffect(() => {
    console.log('Config received:', config);
    if (config && Array.isArray(config) && config.length > 0) {
      const configData = config[0];
      
      setValue('clientId', configData.client_id || '');
      setValue('clientSecret', configData.client_secret || '');
      setValue('webhookId', configData.webhook_id || '');
      setValue('environment', configData.environment || '');
      setValue('defaultCurrency', configData.default_currency || '');
      setValue('merchantAccountId', configData.merchant_acc_id || '');
      // setValue('enablePaypal', configData.paypal_payment === 'enabled');
      setValue('testMode', Boolean(configData.test_mode));
    }
  }, [config, setValue]);

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        client_id: data.clientId,
        client_secret: data.clientSecret,
        webhook_id: data.webhookId,
        environment: data.environment,
        default_currency: data.defaultCurrency,
        merchant_acc_id: data.merchantAccountId || "",
        // paypal_payment: data.enablePaypal ? "enabled" : "disabled",
        test_mode: Boolean(data.testMode)
      };

      // Include ID if we have existing config
      if (config && Array.isArray(config) && config.length > 0) {
        transformedData.id = config[0].id;
      }
      
      await dispatch(savePaypalConfig(transformedData)).unwrap();
      toast.success("PayPal configuration saved successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to save PayPal configuration");
    }
  };

  return (
    <div className="w-full max-w-[32rem] md:max-w-[40rem] xl:max-w-[60rem] 2xl:max-w-[80rem] h-auto p-4 md:p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-3 items-center md:justify-between md:w-[70%]">
        {/* {backBTN == "no" ? null : ( */}
            <a href="/admin/payment" className="mb-2 cursor-pointer">
                <Image
                    src="/backArrow.svg"  // path from public folder
                    alt="Illustration"
                    width={8}  // required in Next.js
                    height={8}

                />
            </a>
        {/* )} */}
        <h1 className="text-lg md:text-3xl font-bold mb-3 text-gray-800 text-center">PayPal Payment Integration</h1>
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
        {/* <div className="flex justify-between items-center">
          <label htmlFor="enablePaypal" className="text-sm font-medium text-gray-700">
            Enable PayPal Payments
          </label>
          <CustomCheckbox 
            id="enablePaypal" 
            name="enablePaypal"
            checked={Boolean(enablePaypal)}
            onChange={(e) => {
              console.log('Checkbox changed to:', e.target.checked);
              setValue('enablePaypal', e.target.checked);
            }}
          />
        </div> */}

        {/* Test Mode Section */}
        <div className="flex justify-between items-center">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Enable Test Mode
          </label>
          <CustomCheckbox 
            id="testMode" 
            name="testMode"
            checked={Boolean(testMode)}
            onChange={(e) => {
              console.log('Test mode changed to:', e.target.checked);
              setValue('testMode', e.target.checked);
            }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit"
          style={{ backgroundColor: theme.color }}
          className={`w-full text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-700 disabled:opacity-50`}
          disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default PaypalPaymentIntegration;
