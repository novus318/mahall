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
        <DataTable />
      </div>
    </div>
  )
}

export default withAuth(page)
