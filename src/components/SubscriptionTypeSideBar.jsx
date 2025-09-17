import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchModules } from '../redux/features/modulesSlice';
import Input from './cui/input';
import Image from 'next/image';

const FORM_VALIDATION = {
  name: {
    required: 'Subscription type name is required'
  },
  modules: {
    required: 'At least one module must be selected'
  }
};

// Option 1: Move outside the component
const INITIAL_FORM_STATE = {
    name: '',
    modules: [],
    status: 'ACTIVE'
};

function SubscriptionTypeSideBar({ isOpen, click, mode = 'create', data = null, onSubmit }) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.subscriptionTypes);
    const { modules } = useSelector((state) => state.modules);
    
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});

    // Fetch modules when component mounts
    useEffect(() => {
        dispatch(fetchModules());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                modules: data.modules || [],
                status: data.status || 'ACTIVE'
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
        
        if (!formData.modules || formData.modules.length === 0) {
            newErrors.modules = FORM_VALIDATION.modules.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleModuleToggle = (moduleId) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.includes(moduleId)
                ? prev.modules.filter(m => m !== moduleId)
                : [...prev.modules, moduleId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // First validate the form
        if (!validateForm()) {
            return;
        }

        // Log form data for debugging
        console.log('Form Data:', formData);

        try {
            await onSubmit({
                ...formData,
                name: formData.name?.trim()
            });
            
            // Reset form after successful submission
            if (mode === 'create') {
                setFormData(INITIAL_FORM_STATE);
                setErrors({});
            }
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
                    onClick={()=>click()}
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 z-50 overflow-y-auto`}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 text-black">
                        <h2 className="text-xl font-semibold">
                            {mode === 'edit' ? 'Edit Subscription Type' : 'New Subscription Type'}
                        </h2>
                        <button
                            onClick={()=>click()}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Image alt="close" src="/FAQ/cross.png" width={20} height={20}/>
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-6">
                        {mode === 'edit' ? 'Update your subscription type details' : 'Create a new subscription type'}
                    </p>

                    {/* Subscription Type Inputs */}
                    <div className="flex flex-col gap-4">
                        <Input  
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            w="full"
                            mdw="full"
                            label="Subscription Type Name *"
                            placeholder="Enter subscription type name"
                            error={errors.name}
                            required
                        />

                        {/* Modules Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Modules *
                            </label>
                            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                                {modules.filter(module => !module.deletedAt && module.isActive).map((module) => (
                                    <div key={module.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`module-${module.id}`}
                                            checked={formData.modules.includes(module.id)}
                                            onChange={() => handleModuleToggle(module.id)}
                                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`module-${module.id}`} className="text-sm text-gray-700">
                                            {module.name}
                                        </label>
                                        <span className="ml-2 text-xs text-gray-500">
                                            ({module.status?.toUpperCase()})
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {errors.modules && (
                                <p className="mt-1 text-sm text-red-600">{errors.modules}</p>
                            )}
                        </div>

                        {/* Selected Modules Display */}
                        {formData.modules.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selected Modules ({formData.modules.length})
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.modules.map((moduleId) => {
                                        const module = modules.find(m => m.id === moduleId && m.isActive);
                                        return module ? (
                                            <span
                                                key={moduleId}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                            >
                                                {module.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleModuleToggle(moduleId)}
                                                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Status:
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="border border-gray-300 rounded-md p-2"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Save')}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SubscriptionTypeSideBar;
