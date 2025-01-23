// "use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { savePaypalConfig } from '../../../../redux/features/paypalSlice';

// UI Components
import Input from '../../../../components/cui/input'
import Button from '../../../../components/cui/button'
import Dropdown from '../../../../components/cui/dropdown'
import CustomCheckbox from '@/components/cui/customCheckbox';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];
const ENVIRONMENTS = ['sandbox', 'production'];

const FORM_VALIDATION = {
  clientId: {
    required: 'Client ID is required'
  },
  clientSecret: {
    required: 'Client Secret is required'
  },
  environment: {
    required: 'Environment is required'
  },
  webhookId: {
    required: 'Webhook ID is required'
  },
  defaultCurrency: {
    required: 'Default Currency is required'
  }
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
        environment: data.environment,
        webhook_id: data.webhookId,
        merchant_acc_id: data.merchantAccountId || '',
        default_currency: data.defaultCurrency,
        paypal_payment: data.enablePaypal ? 'enabled' : 'disabled'
      };

      await dispatch(savePaypalConfig(transformedData)).unwrap();
      toast.success('PayPal configuration saved successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to save PayPal configuration');
    }
  };

  const onError = (errors) => {
    toast.error('Please fill in all required fields correctly');
  };

  return (
    <div className="w-auto md:h-full p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">PayPal Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your PayPal account settings below.
      </p>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8 w-auto flex flex-col items-center justify-center">
        <div className="flex gap-6 flex-wrap">
          <Input 
            id="clientId" 
            {...register('clientId', FORM_VALIDATION.clientId)}
            w="[18rem]" 
            mdw="[40rem]" 
            label="Client ID *" 
            placeholder="Enter your Client ID"
            error={errors.clientId?.message}
          />
          <Input 
            id="clientSecret" 
            {...register('clientSecret', FORM_VALIDATION.clientSecret)}
            w="[18rem]" 
            mdw="[40rem]" 
            label="Client Secret *" 
            placeholder="Enter your Client Secret"
            error={errors.clientSecret?.message}
          />
        </div>

        <div className="flex gap-6 flex-wrap">
          <Dropdown 
            id="environment" 
            register={register('environment', FORM_VALIDATION.environment)}
            label="Environment *" 
            array={ENVIRONMENTS} 
            selected="Select Environment"
            error={errors.environment?.message}
          />
          <Input 
            id="webhookId" 
            {...register('webhookId', FORM_VALIDATION.webhookId)}
            w="[18rem]" 
            mdw="[40rem]" 
            label="Webhook ID *" 
            placeholder="Enter your Webhook ID"
            error={errors.webhookId?.message}
          />
        </div>

        <div className="flex gap-6 flex-wrap">
          <Input 
            id="merchantAccountId" 
            {...register('merchantAccountId')}
            w="[18rem]" 
            mdw="[40rem]" 
            label="Merchant Account ID (Optional)" 
            placeholder="Enter Merchant Account ID"
          />
          <Dropdown 
            id="defaultCurrency" 
            register={register('defaultCurrency', FORM_VALIDATION.defaultCurrency)}
            label="Default Currency *" 
            array={CURRENCIES} 
            selected="Select Currency"
            error={errors.defaultCurrency?.message}
          />
        </div>

        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="enablePaypal" className="text-sm font-medium text-gray-700">
            Enable PayPal Payments
          </label>
          <CustomCheckbox 
            id="enablePaypal"
            {...register('enablePaypal')}
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

export default PaypalPaymentIntegration;
