'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Span } from 'next/dist/trace';


interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: 'Credit' | 'Debit';
    date: string;
    reference:string
    accountId: {
      _id: string;
      name:string;
    }
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
const RecentTransactions = () => {
  const router = useRouter()
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
    
    const formatAmount = (amount: any, type: any) => {
      // Format the amount with commas and two decimal places
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    
      // Prefix with + or - based on the transaction type
      return type === 'Credit' ? `+₹${formatted}` : `-₹${formatted}`;
    };
    
  
    const handleReferenceClick = (reference: string) => {
      router.push(reference)
    };
    if (loading) return <TransactionsSkeleton />;

  return (
 <div>
  <div className='flex justify-between px-2 my-2'>
    <h2 className="text-sm md:text-xl font-bold">Recent Transactions</h2>
    <Link href="/all-transactions" className="text-sm text-gray-800 hover:text-gray-900 bg-gray-200 py-1 px-2 rounded-md">
    All Transactions
    </Link>
  </div>
     <div className='rounded-t-md bg-gray-100 p-1'>
   <Table className="bg-white">
  <TableHeader className='bg-gray-100'>
    <TableRow>
      <TableHead className="font-medium">Date</TableHead>
      <TableHead className="font-medium">Account</TableHead>
      <TableHead className="font-medium">Description</TableHead>
      <TableHead className="font-medium">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions.map((transaction) => {
      const { dayMonthYear, time } = formatDate(transaction?.date);
      const formattedAmount = formatAmount(transaction?.amount, transaction?.type);
      return (
        <TableRow key={transaction._id}
        onClick={
          transaction?.reference
            ? (e: any) =>
                handleReferenceClick(transaction.reference!)
            : undefined
        }>
          <TableCell>
            <div className='text-sm'>{dayMonthYear}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </TableCell>
          <TableCell className='text-xs'>{transaction?.accountId?.name}</TableCell>  {/* replace with actual account details */}  {/* Example: "Savings" */}  {/* replace with actual account details */}  {/* Example: "Savings" */}  {/* replace with actual account details */}  {/* Example: "Savings" */}   {/* replace with actual account details */}  {/* Example: "Savings" */}   {/* replace with actual account details */}  {/* Example: "Savings" */}
          <TableCell className='text-xs'>{transaction?.description} {transaction?.reference && (<span className='text-blue-700 underline'>reference</span>)}</TableCell>
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
  )
}

export default RecentTransactions
