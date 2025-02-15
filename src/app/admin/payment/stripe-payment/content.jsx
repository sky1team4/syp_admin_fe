import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { saveStripeConfig } from '../../../../redux/features/stripeSlice';

// UI Components
import Input from '../../../../components/cui/input';
import Dropdown from '../../../../components/cui/dropdown';
import CustomCheckbox from '@/components/cui/customCheckbox';
import theme from '../../../../app/theme';

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
  const { isLoading } = useSelector((state) => state.stripe);

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

      await dispatch(saveStripeConfig(transformedData)).unwrap();
      toast.success('Stripe configuration saved successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to save Stripe configuration');
    }
  };

  return (
    <div className="w-full max-w-[32rem] md:max-w-[60rem] xl:max-w-[70rem] 2xl:max-w-[150rem] h-auto p-4 md:p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-3 items-center md:justify-between md:w-[70%]">
        <a href="/admin/payment" className="mb-2 cursor-pointer">
          <Image
            src="/backArrow.svg"
            alt="Illustration"
            width={8}
            height={8}
          />
        </a>
        <h1 className="text-lg md:text-3xl font-bold mb-3 text-gray-800 text-center">Stripe Payment Integration</h1>
      </div>
      <p className="text-gray-500 mb-4 text-center">Configure your Stripe account settings below.</p>
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* API Keys Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="publishableKey" {...register('publishableKey', FORM_VALIDATION.publishableKey)}
            label="Publishable Key *" placeholder="Enter your Publishable Key"
            error={errors.publishableKey?.message} />
          <Input id="secretKey" {...register('secretKey', FORM_VALIDATION.secretKey)}
            label="Secret Key *" placeholder="Enter your Secret Key"
            error={errors.secretKey?.message} />
        </div>

        {/* Webhook Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="webhookSigningSecret" {...register('webhookSigningSecret', FORM_VALIDATION.webhookSigningSecret)}
            label="Webhook Signing Secret *" placeholder="Enter your Webhook Signing Secret"
            error={errors.webhookSigningSecret?.message} />
          <Input id="webhookUrl" {...register('webhookUrl')} label="Webhook URL (Optional)" placeholder="Enter your Webhook URL" />
        </div>

        {/* Currency Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Dropdown id="defaultCurrency" register={register('defaultCurrency', FORM_VALIDATION.defaultCurrency)}
            label="Default Currency *" array={CURRENCIES} selected="Select Below"
            error={errors.defaultCurrency?.message} />
          <Dropdown id="allowedCurrencies" register={register('allowedCurrencies', FORM_VALIDATION.allowedCurrencies)}
            label="Allowed Currencies *" array={CURRENCIES} selected="Select Below"
            error={errors.allowedCurrencies?.message} />
        </div>

        {/* Test Mode Section */}
        <div className="flex justify-between items-center">
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">Enable Test Mode</label>
          <CustomCheckbox id="testMode" {...register('testMode')} defaultChecked={false} />
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

export default StripePaymentIntegration;
