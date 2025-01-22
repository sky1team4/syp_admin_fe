"use client"
import React from 'react'
import Content from './content'

function page() {
    return (
        <div className='w-full min-h-screen overflow-x-hidden'>
            <div className='container px-4'>
                <Content />
            </div>
        </div>
    )
}

export default page