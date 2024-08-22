'use client';

import { Card, CardContent } from '@/components/ui/card';
import { withAuth } from '@/components/withAuth';
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, isBefore } from 'date-fns';

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
    pid: string;
    roomId: string;
  };
}

const PageComponent = ({ params }: PageProps) => {
  const { pid, roomId } = params;
  const [room, setRoom] = useState<any>(null);
  const [contractDetails, setContractDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/rent/get-ByRoom/${pid}/${roomId}`);
      const room = response.data.room;
      const activeContract = room.contractHistory.find((contract:any) => contract.status === 'active');
    if (activeContract) {
      setContractDetails(activeContract);
    }
    setRoom(room);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchRoomDetails();
  }, [apiUrl, pid, roomId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!room) {
    return <div>No room details found.</div>;
  }

  return (
    <>
    <div className="mt-2 bg-white rounded-lg shadow-md p-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
  <Link href={`/rent`} className="bg-gray-900 text-white rounded-sm py-2 px-3 text-sm">
    Back
  </Link>
  <div className="flex space-x-1">
   <h4 className='font-bold text-muted-foreground'>
     Room number: {room?.roomNumber}
   </h4>
  </div>
</div>
 </div>
 {room?.contractHistory?.length < 1 ? (
  <div>
    <div className="mt-4 flex flex-col md:flex-row justify-between items-center md:items-center space-y-2 md:space-y-0 p-4">
    <div>
    <h4 className="text-sm font-medium">No contract are made.</h4>
    <p className='text-xs text-muted-foreground'>you are requested to create one</p>
    </div>
      <Link href={`/rent/contract-create/${pid}/${roomId}`} className="text-sm font-medium bg-gray-900 text-white px-2 py-1 rounded-sm">
        Create Contract
      </Link>
  </div>
  </div>
):(
  <div className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
    {contractDetails && (
        <div className="grid gap-8">
        <div className="grid gap-4">
          <div>
            <h1 className="text-2xl font-bold">Rental Contract Details</h1>
            <div className="text-base font-bold">
        {contractDetails?.to && isBefore(new Date(contractDetails.to), new Date()) ? (
          <>
            <Link href={`/rent/contract-create/${pid}/${roomId}`} className="mr-2 text-sm font-medium bg-gray-900 text-white px-2 py-1 rounded-sm">
        Create Contract
      </Link>
          <span className="text-red-600">Your contract has been expired</span>
          </>
        ) : (
          <>
          <span className="text-green-700">Active</span>
          </>
        )}
      </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">From</div>
                <div>{contractDetails?.from ? format(contractDetails?.from, 'PPP') : 'Null'}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">To</div>
                <div>{contractDetails?.to? format(contractDetails?.to, 'PPP') : 'Null'}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Rent</div>
                <div>₹{contractDetails?.rent}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Deposit</div>
                <div>₹{contractDetails?.deposit}</div>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Tenant Name</div>
                <div>{contractDetails?.tenant?.name}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Aadhaar Number</div>
                <div>{contractDetails?.tenant?.aadhaar}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Place</div>
                <div>{contractDetails?.tenant?.place}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Phone Number</div>
                <div>{contractDetails?.tenant?.number}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Rent Collection</h2>
          </div>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>August 2023</TableCell>
                  <TableCell>₹1,500</TableCell>
                  <TableCell>
                    <Badge variant="outline">Pending</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )}
    </div>
)}
    </>
  );
};

const Page = withAuth(({ params }: any) => (
  <Suspense fallback={<SkeletonLoader />}>
    <PageComponent params={params} />
  </Suspense>
));

export default Page;
