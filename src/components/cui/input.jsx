"use client";
import React from 'react';

function Input({ id, label, placeholder, error, ...rest }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input id={id} type="text" placeholder={placeholder}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} 
        text-black rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5`}
        {...rest} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Input;
