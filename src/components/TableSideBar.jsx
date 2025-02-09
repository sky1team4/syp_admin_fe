import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Input from './cui/input';
import Image from 'next/image';

const FORM_VALIDATION = {
  name: {
    required: 'Name is required'
  }
};

function TableSideBar({
    isOpen,
    click,
    mode = 'create',
    data = null,
    title = 'Item',
    dis = 'Manage your item',
    subTitle = 'Name *',
    namePlaceholder = 'Enter name',
    saveButtonText = 'Save',
    updateButtonText = 'Update',
    type,
    fetchData,
    saveData,
    updateData
}) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state[type] || { isLoading: false });
    
    const [formData, setFormData] = useState({
        name: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData({
                name: data.name || data.title || ''
            });
        } else {
            setFormData({
                name: ''
            });
        }
    }, [mode, data]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = FORM_VALIDATION.name.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        try {
            const itemData = { name: formData.name };

            if (mode === 'edit' && data?.id) {
                await dispatch(updateData({ id: data.id, data: itemData })).unwrap();
                toast.success(`${title} updated successfully`);
            } else {
                await dispatch(saveData(itemData)).unwrap();
                toast.success(`${title} created successfully`);
            }
            
            dispatch(fetchData());
            click(false);
        } catch (err) {
            toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} ${title}`);
        }
    };

    return (
        <>
            {isOpen && (
                <div onClick={() => click()} className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 z-50`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 text-black">
                        <h2 className="text-xl font-semibold">Add {title}</h2>
                        <button onClick={() => click()} className="text-gray-400 hover:text-gray-600">
                            <Image src="/FAQ/cross.png" alt="close" width={20} height={20} />
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mb-6">{dis}</p>

                    <div className="flex flex-col gap-4">
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            w="full"
                            mdw="full"
                            label={subTitle}
                            placeholder={namePlaceholder}
                            error={errors.name}
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (mode === 'edit' ? updateButtonText : saveButtonText)}
                    </button>
                </div>
            </div>
        </>
    );
}

export default TableSideBar;
