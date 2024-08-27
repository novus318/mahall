'use client'
import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';


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
interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  date: string;
}

const TransactionsPage: React.FC = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/transactions/get/kudi-collection`);
        setTransactions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions');
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
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
       <div className="mb-4 flex justify-between items-center">
        <Link href='/collection' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Back
        </Link>
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Kudi collection Transactions</h2>
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
      ) 
    }
  </TableBody>
</Table>
   </div>
    </div>
  );
};

const TransactionsWrapper: React.FC = () => {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsPage />
    </Suspense>
  );
};

export default TransactionsWrapper;
