import React from 'react';

function Dropdown({ id, label, array, selected, error, register }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <select id={id} className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} 
      text-gray-700 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5`}
        {...register}>
        <option value="">{selected}</option>
        {array.map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Dropdown;
