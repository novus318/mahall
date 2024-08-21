'use client'
import Sidebar from '@/components/Sidebar'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    <div className="w-full md:w-1/6 bg-gray-100">
      <Sidebar />
    </div>
    <div className="w-full md:w-5/6 p-4 bg-white">
      <div className="flex justify-between items-center mb-4 gap-2">
        <Input
          placeholder="Search buildings..."
          className="w-full sm:w-1/2"
        />
        <Link href='/rent/create-building' className='bg-gray-900 text-white py-1 px-2 rounded-md'>
        Create Building</Link>
      </div>
      </div>
    </div>
  )
}

export default page