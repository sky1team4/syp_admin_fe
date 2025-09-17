import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createModule, updateModule } from '../redux/features/modulesSlice';
import Input from './cui/input';
import Image from 'next/image';

const FORM_VALIDATION = {
  name: {
    required: 'Module name is required'
  },
  description: {
    required: 'Description is required'
  }
};

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  status: 'basic',
  isActive: true
};

const MODULE_STATUSES = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' }
];

function ModuleSideBar({ isOpen, click, mode = 'edit', data = null, onSubmit }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.modules);
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        status: data.status || 'basic',
        isActive: data.isActive !== undefined ? data.isActive : true
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [data, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = FORM_VALIDATION.name.required;
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = FORM_VALIDATION.description.required;
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        name: formData.name?.trim(),
        description: formData.description?.trim()
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => click()}
          className="fixed inset-0 bg-black opacity-50 z-40"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 text-black">
            <h2 className="text-xl font-semibold">
              Edit Module
            </h2>
            <button
              onClick={() => click()}
              className="text-gray-400 hover:text-gray-600"
            >
              <Image alt="close" src="/FAQ/cross.png" width={20} height={20}/>
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-6">
            Update module details
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input  
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              w="full"
              mdw="full"
              label="Module Name *"
              placeholder="Enter module name"
              error={errors.name}
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                rows={3}
                placeholder="Enter module description"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {MODULE_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Active:
              </label>
              <select
                value={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Saving...' : 'Update Module'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ModuleSideBar;
