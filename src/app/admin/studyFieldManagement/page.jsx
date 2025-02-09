"use client"
import React from 'react'
import Link from 'next/link'
import Content from './content'
import { selectMemoizedFieldOfStudy } from '../../../redux/selectors/fieldOfstudySelectors'

function page() {
    const link = "/admin/settings/study-field-management"
    return (
        <>
            <div className='flex gap-3 w-full'>
                <Content title="Field Of Study" namePlaceholder="Enter Field of Study" link={link} btnText="Add Field Study" dataSelector={selectMemoizedFieldOfStudy} tableDataSelector={selectMemoizedFieldOfStudy} />
            </div>
        </>
    )
}

export default page