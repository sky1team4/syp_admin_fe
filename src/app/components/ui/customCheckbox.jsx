import React, { useState } from 'react';

const CustomCheckbox = () => {
  const [checked, setChecked] = useState(false);

  return (
    <label className="relative inline-block w-10 h-5 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <span
        className={`block w-full h-full rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      ></span>
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'transform translate-x-5' : ''
        }`}
      ></span>
    </label>
  );
};

export default CustomCheckbox;
