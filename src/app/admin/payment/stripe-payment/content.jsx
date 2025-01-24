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

// Move constants outside component
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];

const FORM_VALIDATION = {
  publishableKey: {
    required: 'Publishable Key is required',
    pattern: {
      value: /^pk_/,
      message: 'Invalid publishable key format'
    }
  },
  secretKey: {
    required: 'Secret Key is required',
    pattern: {
      value: /^sk_/,
      message: 'Invalid secret key format'
    }
  },
  webhookSigningSecret: {
    required: 'Webhook Signing Secret is required'
  },
  defaultCurrency: {
    required: 'Default Currency is required'
  },
  allowedCurrencies: {
    required: 'Allowed Currencies is required'
  }
};

const StripePaymentIntegration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.stripe);

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        publish_key: data.publishableKey,
        secret_key: data.secretKey,
        webhook_signing_secret: data.webhookSigningSecret,
        webhook_url: data.webhookUrl || '',
        default_currency: data.defaultCurrency,
        allowed_currency: Array.isArray(data.allowedCurrencies) 
          ? data.allowedCurrencies.join(',')
          : data.allowedCurrencies,
        text_mode: data.testMode ? 'test' : 'live'
      };

      console.log(transformedData);
      
      await dispatch(saveStripeConfig(transformedData)).unwrap();
      toast.success('Stripe configuration saved successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to save Stripe configuration');
    }
  };

  const onError = (errors) => {
    toast.error('Please fill in all required fields correctly');
  };

  return (
    <div className="w-auto h-auto md:h-full p-4 md:p-5 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Stripe Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your Stripe account settings below.
      </p>
      <Toaster position="top-right" />
      <form 
        onSubmit={handleSubmit(onSubmit, onError)} 
        className="space-y-8 w-auto flex flex-col items-center justify-center"
      >
        <div className="flex gap-6 flex-wrap">
          <Input 
            id="publishableKey" 
            {...register('publishableKey', FORM_VALIDATION.publishableKey)}
            w="[20rem]" 
            mdw="[40rem]" 
            label="Publishable Key *" 
            placeholder="Enter your Publishable Key"
            error={errors.publishableKey?.message}
          />
          <Input 
            id="secretKey" 
            {...register('secretKey', FORM_VALIDATION.secretKey)}
            w="[20rem]" 
            mdw="[40rem]" 
            label="Secret Key *" 
            placeholder="Enter your Secret Key"
            error={errors.secretKey?.message}
          />
        </div>

        {/* Webhook Signing Secret and URL */}
        <div className="flex gap-6 flex-wrap">
          <Input 
            id="webhookSigningSecret" 
            {...register('webhookSigningSecret', FORM_VALIDATION.webhookSigningSecret)}
            w="full" 
            mdw="[40rem]" 
            label="Webhook Signing Secret *" 
            placeholder="Enter your Webhook Signing Secret"
            error={errors.webhookSigningSecret?.message}
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
            register={register('defaultCurrency', FORM_VALIDATION.defaultCurrency)}
            label="Default Currency *" 
            array={CURRENCIES} 
            selected="Select Below"
            error={errors.defaultCurrency?.message}
          />
          <Dropdown 
            id="allowedCurrencies" 
            register={register('allowedCurrencies', FORM_VALIDATION.allowedCurrencies)}
            label="Allowed Currencies *" 
            array={CURRENCIES} 
            selected="Select Below"
            error={errors.allowedCurrencies?.message}
          />
        </div>

        {/* Enable Test Mode */}
        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Enable Test Mode
          </label>
          <CustomCheckbox 
            id="testMode"
            {...register('testMode')}
            defaultChecked={false}
          />
        </div>

        <div className='w-full max-w-[40rem]'>
          <button
              type="submit"
              className="w-full h-auto bg-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripePaymentIntegration;
