import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import Input from './cui/input';
import Image from 'next/image';

const FORM_VALIDATION = {
  name: {
    required: 'Name is required',
  },
};

function TableSideBar({
  title = 'Item',
  isOpen,
  click,
  mode = 'create',
  dis = 'Manage your item',
  subTitle = 'Name *',
  namePlaceholder = 'Enter name',
  saveButtonText = 'Save',
  updateButtonText = 'Update',
  saveItem,
  updateItem,
  deleteItem,
  isLoading,
  error,
  selectedItem,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && selectedItem) {
      setFormData({ name: selectedItem.name || '', id: selectedItem.id || '' });
    } else {
      setFormData({ name: '' });
    }
  }, [selectedItem, mode]);

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
      toast.error('Please fill in all required fields correctly', { id: 'validation-error' });
      return;
    }
    try {
      const itemData = { name: formData.name };
      if (mode === 'edit' && formData.id) {
        await dispatch(updateItem({ ...itemData, id: formData.id }));
      } else {
        await dispatch(saveItem(itemData));
      }
      toast.success(`Field of Study ${mode === 'edit' ? 'updated' : 'created'} successfully`);
      click(false);
    } catch (err) {
      console.error('Error details:', err);
      toast.error(err?.message || 'Failed to save Field of Study');
    }
  };

  const handleDelete = async () => {
    if (mode === 'edit' && formData.id) {
      try {
        await dispatch(deleteItem(formData.id));
        toast.success('Field of Study deleted successfully');
        click(false);
      } catch (err) {
        console.error('Error details:', err);
        toast.error(err?.message || 'Failed to delete Field of Study');
      }
    }
  };

  console.log('Data:', { isOpen, click, mode, title, dis, subTitle, namePlaceholder, saveButtonText, updateButtonText, saveItem, updateItem, deleteItem, isLoading, error, selectedItem });

  return (
    <>
      {isOpen && <div onClick={() => click(false)} className="fixed inset-0 bg-black opacity-50 z-40"></div>}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 text-black">
            <h2 className="text-xl font-semibold">
              Add {title}
            </h2>
            <button onClick={() => click(false)} className="text-gray-400 hover:text-gray-600">
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
            {isLoading ? 'Saving...' : mode === 'edit' ? updateButtonText : saveButtonText}
          </button>
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50 mt-2"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p>Loading...</p>}
    </>
  );
}

export default TableSideBar;
