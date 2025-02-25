import React from 'react';

const CustomCheckbox = ({ onChange, checked, ...props }) => {
  console.log('CustomCheckbox received checked value:', checked);

  const handleChange = (e) => {
    if (onChange) {
      onChange({
        target: {
          checked: !checked,
          type: 'checkbox',
          name: props.name
        }
      });
    }
  };

  return (
    <label className="relative inline-block w-14 h-7 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked || false}
        onChange={handleChange}
        {...props}
      />
      <span
        className={`block w-full h-full rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      ></span>
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
          checked ? 'transform translate-x-7' : ''
        }`}
      ></span>
    </label>
  );
};

export default CustomCheckbox;
