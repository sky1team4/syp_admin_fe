import React from 'react';
import { useForm } from 'react-hook-form';

// UI Components
import Input from '../../../../components/cui/input'
import Button from '../../../../components/cui/button'
import Dropdown from '../../../../components/cui/dropdown'
import CustomCheckbox from '@/components/cui/customCheckbox';

const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];

const BankPaymentIntegration = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full md:h-full p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Bank Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your Bank account settings below.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[81.5rem]">
        {/* Publishable Key and Secret Key */}
        <div className="flex gap-6 flex-wrap">
          <Input id="accHolderName" w="[20rem]" mdw="[40rem]" label="Account Holder Name" placeholder="Account Holder Name" />
          <Input id="bankAccNo" w="[20rem]" mdw="[40rem]" label="Bank Account Number" placeholder="Bank Account Number" />
        </div>

        {/* Webhook Signing Secret and URL */}
        <div className="flex gap-6 flex-wrap">
          <Input id="ibanNo" w="[20rem]" mdw="[40rem]" label="IBAN Number" placeholder="IBAN Number" />
          <Input id="swiftCode" w="[20rem]" mdw="[40rem]" label="SWIFT Code" placeholder="SWIFT Code" />
        </div>

        {/* Default Currency and Allowed Currencies */}
        <div className="flex gap-6 flex-wrap">
          <Input id="bankName" w="[20rem]" mdw="[40rem]" label="Bank Name" placeholder="Bank Name" />
          <Dropdown id="allowedTType" label="Allowed Transaction" array={currencies} seleted="Select Below" />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="bankAddress" className="text-sm font-medium text-gray-700">
            Bank Address
          </label>
          <textarea id="bankAddress" placeholder='Bank Address'
            className="w-[20rem] md:w-full border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
            rows={5}>

          </textarea>
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

export default BankPaymentIntegration;
