import React from 'react'

function dropdown(info) {
    return (
        <>
            <div className='flex flex-col gap-3'>
                <label htmlFor={info.id} className="block text-sm font-medium text-gray-700">
                    {info.label}
                </label>
                <select
                    id={info.id}
                    className="block md:w-[40rem] border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
                >
                    <option value="">{info.seleted}</option>
                    {info.array.map((item , index) => (
                        <option key={index} value={item}>
                        {item}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default dropdown