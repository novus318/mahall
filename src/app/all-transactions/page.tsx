'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'


interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: 'Credit' | 'Debit';
    date: string;
  }


  const TransactionsSkeleton: React.FC = () => {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  };
const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
          try {
            const response = await axios.get(`${apiUrl}/api/transactions/recent/transactions`);
            setTransactions(response.data.data);
            setLoading(false);
          } catch (err) {
            setLoading(false);
          }
        };
    
        fetchTransactions();
      }, []);
      const formatDate = (dateString:any) => {
        const date = new Date(dateString);
        return {
          dayMonthYear: format(date, 'dd MMM yyyy'),
          time: format(date, 'hh:mm a'),
        };
      };
      
      const formatAmount = (amount:any, type:any) => {
        return type === 'Credit' ? `+${amount}` : `-${amount}`;
      };
    
      if (loading) return <TransactionsSkeleton />;
  return (
  <div className='w-full py-5'>
      <div className='max-w-6xl m-auto my-5'>
        <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        </div>
        <div className='rounded-t-md bg-gray-100 p-1'>
   <Table className="bg-white">
  <TableHeader className='bg-gray-100'>
    <TableRow>
      <TableHead className="font-medium">Date</TableHead>
      <TableHead className="font-medium">Description</TableHead>
      <TableHead className="font-medium">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions.map((transaction) => {
      const { dayMonthYear, time } = formatDate(transaction?.date);
      const formattedAmount = formatAmount(transaction?.amount, transaction?.type);
      return (
        <TableRow key={transaction._id}>
          <TableCell>
            <div className='text-sm'>{dayMonthYear}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </TableCell>
          <TableCell className='text-xs'>{transaction?.description}</TableCell>
          <TableCell className={transaction?.type === 'Credit' ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
            {formattedAmount}
          </TableCell>
        </TableRow>
      );
    })}
    {transactions.length === 0 && (
        <TableCell colSpan={3} className="text-center text-gray-600 text-sm">
          <h4 className="text-lg font-bold">No transactions...</h4>
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