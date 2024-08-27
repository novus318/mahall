'use client'
import DataTable from '@/components/DataTable'
import Sidebar from '@/components/Sidebar'
import { withAuth } from '@/components/withAuth'
import { Currency, History } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col md:flex-row">
    <div className="w-full md:w-1/6">
      <Sidebar />
    </div>
    <div className="w-full md:w-5/6 p-4 md:p-8 lg:p-10">
    <div className="h-full flex-1 flex-col md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your Unpaid Collectons!
            </p>
          </div>
          <Link href='/collection/transactions'
            className='flex items-center gap-1 bg-gray-900 text-white py-1 px-3 rounded-md text-sm'>
              <History className='h-4 w-4'/>
            Transactions
            </Link>
            <Link href='/collection/paid-collection'
            className='flex items-center gap-1 bg-gray-900 text-white py-1 px-3 rounded-md text-sm'>
              <Currency className='h-4 w-4'/>
            Paid Collection
            </Link>
        </div>
        <DataTable />
      </div>
    </div>
  </div>
  )
}

export default withAuth (page)
