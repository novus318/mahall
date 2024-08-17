'use client'
import DataTable from '@/components/DataTable'
import Sidebar from '@/components/Sidebar'
import { withAuth } from '@/components/withAuth'
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
              Here&apos;s a list of your houses to collect!
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
              Select and generate collection
            </p>
        </div>
        <DataTable />
      </div>
    </div>
  </div>
  )
}

export default withAuth (page)
