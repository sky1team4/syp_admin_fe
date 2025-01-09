// import React , {useState } from 'react'

import Input from './ui/input'

function SubscriptionSideBar(info) {
    // const [isOpen, setIsOpen] = useState(false);

    // const toggleSidebar = () => {
    //     setIsOpen(!isOpen);
    // };
    return (
        <>
            {/* Button to toggle the sidebar */}
            {/* <button
                onClick={()=>info.click()}
                className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md"
            >
                Open Sidebar
            </button> */}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
                info.isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300`}
            >
                <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 text-black">
                    <h2 className="text-xl font-semibold">Add Subscriptions</h2>
                    <button
                    onClick={()=> info.click()}
                    className="text-gray-400 hover:text-gray-600"
                    >
                    ✖
                    </button>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-6">
                    Lorem Ipsum has been the industry's standard.
                </p>

                {/* Subscriptions List */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Subscriptions
                    </h3>
                    <div className="flex flex-col gap-4">
                        <Input id={`input_${1}`} w="full" mdw="full" placeholder="Monthly Subscription" />
                    </div>
                </div>

                {/* Add New Subscriptions */}
                <button className="flex items-center mt-6 text-purple-600 hover:text-purple-800 text-sm font-medium">
                    <span className="mr-2 text-lg">➕</span> Add New Subscriptions
                </button>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                <button className="w-full bg-purple-600 text-white py-2 rounded-md">
                    Save
                </button>
                </div>
            </div>
        </>
    )
}

export default SubscriptionSideBar