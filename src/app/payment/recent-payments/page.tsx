'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


const RecentpaymentsSkeleton: React.FC = () => {

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Recent payments</h2>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-7 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};
const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [payments, setpayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/pay/get/payments`);
     if(response.data.success){
      setpayments(response.data.payments)
      setLoading(false);
     }
    } catch (err) {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };

  if (loading) return <RecentpaymentsSkeleton />;
  return (
    <div className='w-full py-5 px-2'>
          <Link href='/payment' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Back
        </Link>
    <div className='max-w-6xl m-auto my-3'>
      <div>
          <h2 className="text-2xl font-semibold mb-4">Recent payments</h2>
      </div>
      <div className='rounded-t-md bg-gray-100 p-1'>
 <Table className="bg-white">
<TableHeader className='bg-gray-100'>
  <TableRow>
    <TableHead className="font-medium">Date</TableHead>
    <TableHead className="font-medium">Reciept No.</TableHead>
    <TableHead className="font-medium">Category</TableHead>
    <TableHead className="font-medium">Amount</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {payments.map((payment) => {
    const { dayMonthYear, time } = formatDate(payment?.date);
    return(
      <TableRow key={payment?._id}>
        <TableCell>
        <div className='text-sm'>{dayMonthYear}</div>
        <div className="text-xs text-gray-500">{time}</div>
        </TableCell>
        <TableCell>
          <div className='text-sm'>{payment?.receiptNumber}</div>
        </TableCell>
        <TableCell>
          <div className='text-sm'>{payment?.categoryId.name}</div>
        </TableCell>
        <TableCell>
          <div className='text-sm'>₹{(payment?.total).toFixed(2)}</div>
        </TableCell>
      </TableRow>
      )
  })}
  {payments.length === 0 && (
      <TableCell colSpan={3} className="text-center text-gray-600 text-sm">
        <h4 className="text-lg font-bold">No Payments...</h4>
      </TableCell>
      )}
</TableBody>
</Table>
 </div>
  </div>
</div>
  )
}

export default withAuth(Page)
