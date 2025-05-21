import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Input from './cui/input';
import Image from 'next/image';
import { fetchSkills } from '../redux/features/skillSlice';
import { IoTrashOutline } from "react-icons/io5";

const FORM_VALIDATION = {
  name: {
    required: 'Name is required',
  },
};

function TableSideBar({
    isOpen,
    click,
    mode = 'create',
    selectedItem = null,
    title = 'Item',
    dis = 'Manage your item',
    subTitle = 'Name *',
    namePlaceholder = 'Enter name',
    saveButtonText = 'Save',
    updateButtonText = 'Update',
    type,
    fetchData,
    saveData,
    updateData,
}) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state[type] || { isLoading: false });
    const { items: skills } = useSelector((state) => state.skill || { items: [] });
    
    const [formData, setFormData] = useState({
        skillId: selectedItem?.skillId || '',
        items: [{ title: '', status: 'Active' }]
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (type === "subSkill") {
            dispatch(fetchSkills());
        }
    }, [dispatch, type]);

    useEffect(() => {
        if (mode === 'edit' && selectedItem) {
            setFormData({
                skillId: selectedItem.skillId || '',
                items: [{
                    title: selectedItem.title || '',
                    id: selectedItem.id,
                    status: selectedItem.status || 'Active'
                }]
            });
        } else {
            setFormData(prev => ({
                skillId: prev.skillId || '',
                items: [{ title: '', status: 'Active' }]
            }));
        }
    }, [selectedItem, mode, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        console.log('Validating form data:', formData);

        if (type === "subSkill" && (!formData.skillId || formData.skillId === '')) {
            console.log('Skill validation failed:', formData.skillId);
            newErrors.skillId = 'Skill is required';
        }

        formData.items.forEach((item, index) => {
            if (!item.title || item.title.trim() === '') {
                newErrors[`title_${index}`] = FORM_VALIDATION.name.required;
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fill in all required fields correctly');
            return false;
        }
        return true;
    };

    const validateUniqueNames = () => {
        // Create a map to store name counts
        const nameCount = new Map();
        
        // Check for empty or whitespace-only names and count occurrences
        for (const item of formData.items) {
            const trimmedTitle = item.title.trim();
            
            // Count occurrences of each name
            nameCount.set(trimmedTitle, (nameCount.get(trimmedTitle) || 0) + 1);
        }

        // Check for duplicates
        const duplicates = Array.from(nameCount.entries())
            .filter(([name, count]) => count > 1)
            .map(([name]) => name);

        if (duplicates.length > 0) {
            toast.error(`Duplicate names found: ${duplicates.join(', ')}`);
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        console.log('Attempting to save with formData:', formData);
        
        if (!validateForm()) {
            return;
        }

        // Add unique name validation
        if (!validateUniqueNames()) {
            return;
        }

        try {
            if (mode === 'edit' && formData.items[0].id) {
                await dispatch(updateData({ 
                    id: formData.items[0].id, 
                    data: { ...formData.items[0], skillId: formData.skillId }
                })).unwrap();
                toast.success(`${title} updated successfully`);
            } else {
                // Save multiple items
                for (const item of formData.items) {
                    const dataToSave = {
                        ...item,
                        skillId: formData.skillId,
                        title: item.title.trim()
                    };
                    console.log('Saving item:', dataToSave);
                    await dispatch(saveData(dataToSave)).unwrap();
                }
                toast.success(`${title}${formData.items.length > 1 ? 's' : ''} created successfully`);
            }
            
            dispatch(fetchData());
            click();
        } catch (err) {
            console.error('Save error:', err);
            toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} ${title}`);
        }
    };

    const addNewItem = () => {
        setFormData(prevState => {
            console.log('Adding new item. Current state:', prevState);
            return {
                ...prevState,
                items: [
                    ...prevState.items,
                    { title: '', status: 'Active', skillId: prevState.skillId }
                ]
            };
        });
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
            const newErrors = { ...errors };
            delete newErrors[`title_${index}`];
            setErrors(newErrors);
        }
    };

    const updateItemField = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSkillChange = (e) => {
        const newValue = e.target.value;
        console.log('Selected skillId:', newValue);
        setFormData(prevState => {
            console.log('Previous state:', prevState);
            return {
                ...prevState,
                skillId: newValue,
                items: prevState.items.map(item => ({
                    ...item,
                    skillId: newValue
                }))
            };
        });
    };

    return (
        <>
            {isOpen && (
                <div onClick={() => click()} className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}

            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 z-50 flex flex-col`}>
                {/* Fixed Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center mb-4 text-black">
                        <h2 className="text-xl font-semibold">Add {title}</h2>
                        <button onClick={() => click()} className="text-gray-400 hover:text-gray-600">
                            <Image src="/FAQ/cross.png" alt="close" width={20} height={20} />
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm">{dis}</p>
                </div>

                {/* Scrollable Content */}
                <div className={`flex-1 overflow-y-auto p-6 ${formData.items.length >= 5 ? 'custom-scrollbar' : ''}`}>
                    <div className="flex flex-col gap-4">
                        {type === "subSkill" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skill *
                                </label>
                                <select
                                    value={formData.skillId}
                                    onChange={handleSkillChange}
                                    className={`w-full h-[42px] px-3 border rounded-md ${
                                        errors.skillId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select a skill</option>
                                    {skills.map((skill) => (
                                        <option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.skillId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.skillId}</p>
                                )}
                            </div>
                        )}

                        {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex-grow">
                                    <Input
                                        id={`title_${index}`}
                                        value={item.title}
                                        onChange={(e) => updateItemField(index, 'title', e.target.value)}
                                        w="full"
                                        mdw="full"
                                        label={index === 0 ? subTitle : ''}
                                        placeholder={namePlaceholder}
                                        error={errors[`title_${index}`]}
                                    />
                                </div>
                                {mode === 'create' && formData.items.length > 1 && (
                                    <div className="flex-shrink-0 self-end mb-[2px]">
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="h-[42px] w-[42px] flex items-center justify-center text-red-400 hover:text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors border border-red-100"
                                        >
                                            <IoTrashOutline size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {mode === 'create' && (
                            <button
                                onClick={addNewItem}
                                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mt-2"
                            >
                                <span className="text-xl">+</span>
                                <span>Add New {title}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white">
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