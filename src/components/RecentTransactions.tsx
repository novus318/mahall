'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';


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
        <h2 className="text-2xl font-semibold mb-4">Self-Transfer Transactions</h2>
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
const RecentTransactions = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/dashboard/get-transactions`);
          setTransactions(response.data.recentTransactions);
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
  </TableBody>
</Table>
   </div>
  )
}

export default RecentTransactions