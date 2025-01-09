import React from 'react';
import { useForm } from 'react-hook-form';

// UI Components
import Input from '../../components/ui/input'
import Button from '../../components/ui/button'
import Dropdown from '../../components/ui/dropdown'
import CustomCheckbox from '@/app/components/ui/customCheckbox';

const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];

const PaypalPaymentIntegration = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full md:h-full p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Paypal Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your Paypal account settings below.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[81.5rem]">
        {/* Publishable Key and Secret Key */}
        <div className="flex gap-6 flex-wrap">
          <Input id="clientId" label="Client ID" placeholder="Client ID"/>
          <Input id="clientsecret" label="Client Secret" placeholder="Client Secret"/>
        </div>

        {/* Webhook Signing Secret and URL */}
        <div className="flex gap-6 flex-wrap">
          {/* <Input id="webhookSigningSecret" label="Webhook Signing Secret" placeholder="Enter your Webhook Signing Secret"/> */}
          <Dropdown id="environment" label="Environmet" array={currencies} seleted="Select Below"/>
          <Input id="webhookid" label="Webhook ID" placeholder="Webhook ID"/>
        </div>

        {/* Default Currency and Allowed Currencies */}
        <div className="flex gap-6 flex-wrap">
        {/* <Input id="webhookSigningSecret" label="Webhook Signing Secret" placeholder="Enter your Webhook Signing Secret"/> */}
          <Dropdown id="merchantAccountId" label="Merchant Account ID (Optional)" array={currencies} seleted="Select Below"/>
          <Dropdown id="defaultCurrency" label="Default Currency" array={currencies} seleted="Select Below"/>
        </div>

        {/* Enable Test Mode */}
        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Enable Paypal Payments
          </label>

          <CustomCheckbox />
          {/* <input
            id="testMode"
            type="checkbox"
            className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          /> */}
          
        </div>

        {/* Save Button */}
        <div className=''>
          <Button w="full" text="Save Changes" />
        </div>
      </form>
    </div>
  );
};

export default PaypalPaymentIntegration;
