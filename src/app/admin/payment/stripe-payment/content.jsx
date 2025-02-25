import React, { useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { saveStripeConfig, fetchStripeConfig } from '../../../../redux/features/stripeSlice';

// UI Components
import Input from '../../../../components/cui/input';
import Dropdown from '../../../../components/cui/dropdown';
import CustomCheckbox from '@/components/cui/customCheckbox';
import theme from '../../../../app/theme';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'INR'];

const FORM_VALIDATION = {
  publishableKey: {
    required: 'Publishable Key is required eg.(PK_1234567890)',
    pattern: {
      value: /^pk_/,
      message: 'Invalid publishable key format eg.(PK_1234567890)'
    }
  },
  secretKey: {
    required: 'Secret Key is required eg.(SK_1234567890)',
    pattern: {
      value: /^sk_/,
      message: 'Invalid secret key format eg.(SK_1234567890)'
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
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      publishableKey: '',
      secretKey: '',
      webhookSigningSecret: '',
      webhookUrl: '',
      defaultCurrency: '',
      allowedCurrencies: [],
      testMode: false,
    }
  });
  const dispatch = useDispatch();
  const { isLoading, config } = useSelector((state) => state.stripe);

  useEffect(() => {
    console.log('Fetching config...');
    dispatch(fetchStripeConfig());
  }, [dispatch]);

  useEffect(() => {
    console.log('Config received:', config);
    if (config && Array.isArray(config) && config.length > 0) {
      const configData = config[0];
      
      // Log the raw test_mode value
      console.log('Raw test_mode value from API:', configData.test_mode);
      
      // Set form values
      setValue('publishableKey', configData.publish_key || '');
      setValue('secretKey', configData.secret_key || '');
      setValue('webhookSigningSecret', configData.webhook_signing_secret || '');
      setValue('webhookUrl', configData.webhook_url || '');
      setValue('defaultCurrency', configData.default_currency || '');
      setValue('allowedCurrencies', configData.allowed_currency?.split(',') || []);
      
      // Explicitly convert to boolean and set test mode
      const isTestMode = configData.test_mode === true;
      console.log('Setting testMode to:', isTestMode);
      setValue('testMode', isTestMode);
    }
  }, [config, setValue]);

  // Watch the testMode value
  const testMode = watch('testMode');
  
  useEffect(() => {
    console.log('Current testMode value:', testMode);
  }, [testMode]);

  const onSubmit = async (data) => {
    try {
      // Validate that allowedCurrencies is an array and not empty
      const allowedCurrencies = Array.isArray(data.allowedCurrencies) 
        ? data.allowedCurrencies 
        : [data.allowedCurrencies];

      if (!allowedCurrencies.length) {
        throw new Error('At least one currency must be selected');
      }

      const transformedData = {
        publish_key: data.publishableKey,
        secret_key: data.secretKey,
        webhook_signing_secret: data.webhookSigningSecret,
        webhook_url: data.webhookUrl || '',
        default_currency: data.defaultCurrency,
        allowed_currency: allowedCurrencies.join(','),
        test_mode: data.testMode,
        amount: data.amount || 5000,
        currency: data.defaultCurrency,
      };

      console.log('Submitting data:', transformedData);

      // If we have an existing config, include its ID
      if (config && Array.isArray(config) && config.length > 0) {
        transformedData.id = config[0].id;
      }

      await dispatch(saveStripeConfig(transformedData)).unwrap();
      toast.success('Stripe configuration saved successfully');
    } catch (err) {
      console.error('Error saving Stripe configuration:', err);
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
            multiple={true}
          />
        </div>

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
              console.log('Checkbox onChange event:', e.target.checked);
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

export default StripePaymentIntegration;
