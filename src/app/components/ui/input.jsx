import React from 'react'

function input(info) {
  return (
    <>
        <div className='flex flex-col gap-3'>
            <label htmlFor={info.id} className="text-sm font-medium text-gray-700">
                {info.label}
            </label>
            <input
                id={info.id}
                type="text"
                // {...register('publishableKey')}
                placeholder={info.placeholder}
                // className="w-[20rem] md:w-[40rem] border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5"
                className={`w-${info.w} md:w-${info.mdw} border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5`}
            />
        </div>
    </>
  )
}

export default input