import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { saveStripeConfig } from '../../../../redux/features/stripeSlice';

// UI Components
import Input from '../../../../components/cui/input'
import Button from '../../../../components/cui/button'
import Dropdown from '../../../../components/cui/dropdown'
import CustomCheckbox from '@/components/cui/customCheckbox';

const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];

const StripePaymentIntegration = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.stripe);

  const onSubmit = async (data) => {
    try {
      await dispatch(saveStripeConfig(data)).unwrap();
      toast.success('Stripe configuration saved successfully');
    } catch (error) {
      console.error('Error saving Stripe configuration:', error);
      toast.error('Failed to save Stripe configuration');
    }
  };

  return (
    <div className="w-auto h-auto md:h-full p-4 md:p-5 bg-white rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Stripe Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your Stripe account settings below.
      </p>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-auto flex flex-col items-center justify-center ">
        {/* Publishable Key and Secret Key */}
        <div className="flex gap-6 flex-wrap">
          <Input 
            id="publishableKey" 
            {...register('publishableKey', { required: true })}
            w="[20rem]" 
            mdw="[40rem]" 
            label="Publishable Key" 
            placeholder="Enter your Publishable Key" 
          />
          <Input 
            id="secretKey" 
            {...register('secretKey', { required: true })}
            w="[20rem]" 
            mdw="[40rem]" 
            label="Secret Key" 
            placeholder="Enter your Secret Key" 
          />
        </div>

        {/* Webhook Signing Secret and URL */}
        <div className="flex gap-6 flex-wrap">
          <Input 
            id="webhookSigningSecret" 
            {...register('webhookSigningSecret', { required: true })}
            w="full" 
            mdw="[40rem]" 
            label="Webhook Signing Secret" 
            placeholder="Enter your Webhook Signing Secret"
          />
          <Input 
            id="webhookUrl" 
            {...register('webhookUrl')}
            w="full" 
            mdw="[40rem]" 
            label="Webhook URL (Optional)" 
            placeholder="Enter your Webhook URL"
          />
        </div>

        {/* Default Currency and Allowed Currencies */}
        <div className="flex gap-6 flex-wrap">
          <Dropdown 
            id="defaultCurrency" 
            {...register('defaultCurrency', { required: true })}
            label="Default Currency" 
            array={currencies} 
            seleted="Select Below" 
          />
          <Dropdown 
            id="allowedCurrencies" 
            {...register('allowedCurrencies', { required: true })}
            label="Allowed Currencies" 
            array={currencies} 
            seleted="Select Below" 
          />
        </div>

        {/* Enable Test Mode */}
        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Enable Test Mode
          </label>
          <CustomCheckbox {...register('testMode')} />
        </div>

        {/* Save Button */}
        <div className=''>
          <Button 
            w="full" 
            text={isLoading ? "Saving..." : "Save Changes"} 
            type="submit" 
            disabled={isLoading}
            click={() => handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </div>
  );
};

export default StripePaymentIntegration;
