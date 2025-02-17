import React, { useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { saveBankConfig, fetchBankConfig } from '../../../../redux/features/bankSlice';

// UI Components
import Input from '../../../../components/cui/input'
import Dropdown from '../../../../components/cui/dropdown'
import CustomCheckbox from '@/components/cui/customCheckbox';
import theme from '../../../../app/theme';

const TRANSACTION_TYPES = ['DEBIT', 'CREDIT', 'DEBIT,CREDIT'];

const FORM_VALIDATION = {
  accHolderName: {
    required: 'Account Holder Name is required'
  },
  bankAccNo: {
    required: 'Bank Account Number is required'
  },
  ibanNo: {
    required: 'IBAN Number is required'
  },
  swiftCode: {
    required: 'SWIFT Code is required'
  },
  bankName: {
    required: 'Bank Name is required'
  },
  allowTransactionType: {
    required: 'Transaction Type is required'
  },
  bankAddress: {
    required: 'Bank Address is required'
  }
};

const BankPaymentIntegration = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const dispatch = useDispatch();
  const { isLoading, config } = useSelector((state) => state.bank);

  // Fetch config when component mounts
  useEffect(() => {
    dispatch(fetchBankConfig());
  }, [dispatch]);

  // Set form values when config is loaded
  useEffect(() => {
    if (config && Array.isArray(config) && config.length > 0) {
      const configData = config[0];
      
      setValue('accHolderName', configData.acc_holder_name || '');
      setValue('bankAccNo', configData.bank_acc_no || '');
      setValue('ibanNo', configData.iban_no || '');
      setValue('swiftCode', configData.swift_code || '');
      setValue('bankName', configData.bank_name || '');
      setValue('allowTransactionType', configData.allow_transaction_type || '');
      setValue('bankAddress', configData.bank_address || '');
      setValue('enableBankPayment', configData.direct_bank_payment === 'enabled');

      console.log('Bank form values set:', {
        accHolderName: watch('accHolderName'),
        bankAccNo: watch('bankAccNo'),
        ibanNo: watch('ibanNo'),
        swiftCode: watch('swiftCode'),
        bankName: watch('bankName'),
        allowTransactionType: watch('allowTransactionType'),
        bankAddress: watch('bankAddress'),
        enableBankPayment: watch('enableBankPayment')
      });
    }
  }, [config, setValue, watch]);

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        acc_holder_name: data.accHolderName,
        bank_acc_no: data.bankAccNo,
        iban_no: data.ibanNo,
        swift_code: data.swiftCode,
        bank_name: data.bankName,
        allow_transaction_type: data.allowTransactionType,
        bank_address: data.bankAddress,
        direct_bank_payment: data.enableBankPayment ? 'enabled' : 'disabled'
      };

      await dispatch(saveBankConfig(transformedData)).unwrap();
      toast.success('Bank configuration saved successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to save bank configuration');
    }
  };

  const onError = (errors) => {
    toast.error('Please fill in all required fields correctly');
  };

  return (
    <div className="w-full max-w-[32rem] md:max-w-[40rem] xl:max-w-[60rem] 2xl:max-w-[80rem] p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-3 items-center md:justify-between md:w-[70%]">
        <a href="/admin/payment" className="mb-2 cursor-pointer">
          <Image
            src="/backArrow.svg" 
            alt="Illustration"
            width={8}  
            height={8}
          />
        </a>
        <h1 className="text-lg md:text-3xl font-bold mb-3 text-gray-800 text-center">Bank Payment Integration</h1>
      </div>
      <p className="text-gray-500 mb-4 text-center">Configure your Bank account settings below.</p>
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Account Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            id="accHolderName" 
            {...register('accHolderName', FORM_VALIDATION.accHolderName)}
            label="Account Holder Name *" 
            placeholder="Enter Account Holder Name"
            error={errors.accHolderName?.message}
          />
          <Input 
            id="bankAccNo" 
            {...register('bankAccNo', FORM_VALIDATION.bankAccNo)}
            label="Bank Account Number *" 
            placeholder="Enter Bank Account Number"
            error={errors.bankAccNo?.message}
          />
        </div>

        {/* IBAN & SWIFT Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            id="ibanNo" 
            {...register('ibanNo', FORM_VALIDATION.ibanNo)}
            label="IBAN Number *" 
            placeholder="Enter IBAN Number"
            error={errors.ibanNo?.message}
          />
          <Input 
            id="swiftCode" 
            {...register('swiftCode', FORM_VALIDATION.swiftCode)}
            label="SWIFT Code *" 
            placeholder="Enter SWIFT Code"
            error={errors.swiftCode?.message}
          />
        </div>

        {/* Bank Name & Transaction Type Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            id="bankName" 
            {...register('bankName', FORM_VALIDATION.bankName)}
            label="Bank Name *" 
            placeholder="Enter Bank Name"
            error={errors.bankName?.message}
          />
          <Dropdown 
            id="allowTransactionType" 
            register={register('allowTransactionType', FORM_VALIDATION.allowTransactionType)}
            label="Allowed Transaction Type *" 
            array={TRANSACTION_TYPES} 
            selected="Select Transaction Type"
            error={errors.allowTransactionType?.message}
          />
        </div>

        {/* Bank Address Section */}
        <div className="flex flex-col gap-3">
          <label htmlFor="bankAddress" className="text-sm font-medium text-gray-700">Bank Address *</label>
          <textarea 
            id="bankAddress" 
            {...register('bankAddress', FORM_VALIDATION.bankAddress)}
            placeholder="Enter Bank Address"
            className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
            rows={5}
          />
          {errors.bankAddress && (
            <span className="text-red-500 text-sm">{errors.bankAddress.message}</span>
          )}
        </div>

        {/* Enable Bank Payment Section */}
        <div className="flex justify-between items-center">
          <label htmlFor="enableBankPayment" className="text-sm font-medium text-gray-700">Enable Bank Payment</label>
          <CustomCheckbox id="enableBankPayment" {...register('enableBankPayment')} defaultChecked={false} />
        </div>

        {/* Submit Button */}
        <button 
          style={{ backgroundColor: theme.color }}
          type="submit"
          className={`w-full bg-[${theme.color}] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-700 disabled:opacity-50`}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default BankPaymentIntegration;
