'use client'
import Sidebar from '@/components/Sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { BookOpenTextIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [reports,setReports] = useState([])

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/dashboard`)
        if(response.data.success)
        setReports(response.data.data)
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    }
    fetchReports()
  }, [])
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    <div className="w-full md:w-1/6 bg-gray-100">
      <Sidebar />
    </div>
    <div className="w-full md:w-5/6 p-4 bg-white">
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reports Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reports.map((report:any) => (
         <Link key={report.title} href={`/reports/${report.link}`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-3xl font-bold ">{report.title}</CardTitle>
              <BookOpenTextIcon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{report?.value}</div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>
    </div>
      </div>
    </div>
  )
}

export default withAuth(Page)
