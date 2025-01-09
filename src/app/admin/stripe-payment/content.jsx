import React from 'react';
import { useForm } from 'react-hook-form';

// UI Components
import Input from '../../components/ui/input'
import Button from '../../components/ui/button'
import Dropdown from '../../components/ui/dropdown'
import CustomCheckbox from '@/app/components/ui/customCheckbox';

const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];

const StripePaymentIntegration = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full md:h-full p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Stripe Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your Stripe account settings below.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[81.5rem]">
        {/* Publishable Key and Secret Key */}
        <div className="flex gap-6 flex-wrap">
          <Input id="publishableKey" label="Publishable Key" placeholder="Enter your Publishable Key"/>
          <Input id="secretKey" label="Secret Key" placeholder="Enter your Secret Key"/>
        </div>

        {/* Webhook Signing Secret and URL */}
        <div className="flex gap-6 flex-wrap">
          <Input id="webhookSigningSecret" label="Webhook Signing Secret" placeholder="Enter your Webhook Signing Secret"/>
          <Input id="webhookUrl" label="Webhook URL (Optional)" placeholder="Enter your Webhook URL"/>
        </div>

        {/* Default Currency and Allowed Currencies */}
        <div className="flex gap-6 flex-wrap">
          <Dropdown id="defaultCurrency" label="Default Currency" array={currencies} seleted="Select Below"/>
          <Dropdown id="allowedCurrencies" label="Allowed Currencies" array={currencies} seleted="Select Below"/>
        </div>

        {/* Enable Test Mode */}
        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Enable Test Mode
          </label>

          <CustomCheckbox />
          
        </div>

        {/* Save Button */}
        <div className=''>
          <Button w="full" text="Save Changes" />
        </div>
      </form>
    </div>
  );
};

export default StripePaymentIntegration;
