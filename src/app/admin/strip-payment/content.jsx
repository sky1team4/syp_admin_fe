import React from 'react';
import { useForm } from 'react-hook-form';

// UI Components
import Input from '../../components/ui/input'
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
        {/* <Input id="webhookSigningSecret" label="Webhook Signing Secret" placeholder="Enter your Webhook Signing Secret"/> */}
          <div className='flex flex-col gap-3'>
            <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">
              Default Currency
            </label>
            <select
              id="defaultCurrency"
              className="block md:w-[40rem] border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
            >
              <option value="">Select Below</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-3'>
            <label htmlFor="allowedCurrencies" className="block text-sm font-medium text-gray-700">
              Allowed Currencies
            </label>
            <select
              id="allowedCurrencies"
              // multiple
              className="md:w-[40rem] border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enable Test Mode */}
        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Enable Test Mode
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
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripePaymentIntegration;
