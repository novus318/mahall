import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div>
      <h2
       className='text-2xl font-bold text-gray-900'
      >comming soon...</h2>
      <p className='mb-4'>This page will be available soon.</p>
      <Link className='bg-gray-950 text-white py-2 px-3 m-3 rounded-md' href="/reports">Return to back</Link>
    </div>
  )
}

export default Page
