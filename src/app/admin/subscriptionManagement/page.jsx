"use client"
import React from 'react'
import Content from './content'

function page() {
    return (
        <div className='w-full h-full overflow-hidden'>
            <div className='h-full overflow-y-auto'>
                <Content />
            </div>
        </div>
    )
}

export default page