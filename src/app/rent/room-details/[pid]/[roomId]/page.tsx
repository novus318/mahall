'use client'
import { Card, CardContent } from '@/components/ui/card';
import { withAuth } from '@/components/withAuth';
import React, { Suspense } from 'react'

const SkeletonLoader = () => (
    <div className="animate-pulse p-2">
      <div className="mb-4 flex justify-between items-center">
        <div className="bg-gray-300 h-8 w-24 rounded"></div>
        <div className="bg-gray-300 h-8 w-24 rounded"></div>
      </div>
      <Card>
        <div className="h-12 bg-gray-200 rounded-t-md mb-2"></div>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 text-sm">
            <div className="bg-gray-200 h-6 col-span-1"></div>
            <div className="bg-gray-200 h-6 col-span-2"></div>
          </div>
          <div className="grid grid-cols-3 text-sm">
            <div className="bg-gray-200 h-6 col-span-1"></div>
            <div className="bg-gray-200 h-6 col-span-2"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  interface PageProps {
    params: {
      pid: string
      roomId: string
    }
  }
  const PageComponent = ({ params }: PageProps) => {
    const { pid } = params
    const { roomId } = params
  return (
    <div>
      {pid}<br/>
      {roomId}
    </div>
  )
}

const Page = withAuth(({ params }: any) => (
  <Suspense fallback={<SkeletonLoader />}>
    <PageComponent params={params} />
  </Suspense>
))

export default Page
