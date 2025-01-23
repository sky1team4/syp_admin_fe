import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { saveBankConfig } from '../../../../redux/features/bankSlice';

// UI Components
import Input from '../../../../components/cui/input'
import Button from '../../../../components/cui/button'
import Dropdown from '../../../../components/cui/dropdown'
import CustomCheckbox from '@/components/cui/customCheckbox';

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
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.bank);

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
    <div className="w-full md:h-full p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Bank Payment Integration</h1>
      <p className="text-gray-500 mb-8">
        Configure your Bank account settings below.
      </p>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8 w-[81.5rem]">
        <div className="flex gap-6 flex-wrap">
          <Input 
            id="accHolderName" 
            {...register('accHolderName', FORM_VALIDATION.accHolderName)}
            w="[20rem]" 
            mdw="[40rem]" 
            label="Account Holder Name *" 
            placeholder="Enter Account Holder Name"
            error={errors.accHolderName?.message}
          />
          <Input 
            id="bankAccNo" 
            {...register('bankAccNo', FORM_VALIDATION.bankAccNo)}
            w="[20rem]" 
            mdw="[40rem]" 
            label="Bank Account Number *" 
            placeholder="Enter Bank Account Number"
            error={errors.bankAccNo?.message}
          />
        </div>

        <div className="flex gap-6 flex-wrap">
          <Input 
            id="ibanNo" 
            {...register('ibanNo', FORM_VALIDATION.ibanNo)}
            w="[20rem]" 
            mdw="[40rem]" 
            label="IBAN Number *" 
            placeholder="Enter IBAN Number"
            error={errors.ibanNo?.message}
          />
          <Input 
            id="swiftCode" 
            {...register('swiftCode', FORM_VALIDATION.swiftCode)}
            w="[20rem]" 
            mdw="[40rem]" 
            label="SWIFT Code *" 
            placeholder="Enter SWIFT Code"
            error={errors.swiftCode?.message}
          />
        </div>

        <div className="flex gap-6 flex-wrap">
          <Input 
            id="bankName" 
            {...register('bankName', FORM_VALIDATION.bankName)}
            w="[20rem]" 
            mdw="[40rem]" 
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

        <div className="flex flex-col gap-3">
          <label htmlFor="bankAddress" className="text-sm font-medium text-gray-700">
            Bank Address *
          </label>
          <textarea 
            id="bankAddress" 
            {...register('bankAddress', FORM_VALIDATION.bankAddress)}
            placeholder='Enter Bank Address'
            className="w-[20rem] md:w-full border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
            rows={5}
          />
          {errors.bankAddress && (
            <span className="text-red-500 text-sm">{errors.bankAddress.message}</span>
          )}
        </div>

        <div className="flex gap-5 md:gap-80 items-center flex-wrap">
          <label htmlFor="enableBankPayment" className="text-sm font-medium text-gray-700">
            Enable Bank Payment
          </label>
          <CustomCheckbox 
            id="enableBankPayment"
            {...register('enableBankPayment')}
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

export default BankPaymentIntegration;
