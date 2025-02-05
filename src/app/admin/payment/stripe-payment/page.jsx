'use client'
import React from 'react'
import Sidebar from '../../../../components/Sidebar'
import Header from '../../../../components/Header'
import Content from "./content"

function PaymentInte() {
    return (
        <>
            {/* <div className='flex gap-3 bg-gray-50'>
                <Sidebar />
                <div className='flex flex-col gap-3 w-full '>
                    <Header /> */}
            <div className='flex gap-3 w-full h-auto justify-center lg:justify-start px-4 md:px-8 xl:px-16 2xl:px-24'>
                <Content />
            </div>


            {/* </div> */}
            {/* // </div> */}
        </>
    )
}

export default PaymentInte