'use client'
import React from 'react'
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
import Content from "./content"

function PaymentInte() {
  return (
        <>
            {/* <div className='flex gap-3 bg-gray-50'>
                <Sidebar />
                <div className='flex flex-col gap-3 w-full '>
                    <Header /> */}
                    <div className='flex gap-3 w-full h-full justify-center'>
                        <Content />
                    </div>
                    
                {/* </div> */}
                {/* // </div> */}
        </>
  )
}

export default PaymentInte