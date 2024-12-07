'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Link from 'next/link';
import Spinner from '@/components/Spinner';
import { withAuth } from '@/components/withAuth';
import UpdateSalaryPayment from '@/components/UpdateSalaryPayment';
import { toast } from '@/components/ui/use-toast';

interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary: boolean;
}

const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [salaries, setSalaries] = useState<any[]>([]);
    const [bank, setBank] = useState<BankAccount[]>([]);
    const [loading,setLoading] = useState(true)

    const fetchAccounts = () => {
      axios.get(`${apiUrl}/api/account/get`).then(response => {
        setBank(response.data.data);
      })
        .catch(error => {
          console.log("Error fetching accounts:", error);
        });
    };
      const fetchSalary = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/staff/pending-salaries`);
          if (response.data.success) {
            setSalaries(response.data.payslips);
            setLoading(false)
          }
        } catch (error: any) {
          toast({
            title: 'Failed to fetch salaries',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
          setLoading(false)
        }
      };

      useEffect(() => {
        fetchSalary();
        fetchAccounts();
      },[]);

      function formatMonth(dateString:any) {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'long' }); // e.g., "June"
      }
    
    
  return (
<>
{
    loading ? (<Spinner/>):
    ( <div className='p-2'>
      <div className='max-w-5xl mx-auto'>
          <div className="mb-4 flex justify-between items-center">
              <Link href={`/staff`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                  Back
              </Link>
          </div>
          <div>
          <div className='w-full p-2 rounded-md border my-2 md:my-4 mx-auto'>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>ID</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>House</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.map((salary, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{salary?.staffId?.employeeId}</TableCell>
                  <TableCell>
                  {formatMonth(salary?.salaryPeriod?.startDate)}
                  </TableCell>
                  <TableCell>{salary?.staffId?.name}</TableCell>
                  <TableCell>₹{(salary?.basicPay).toFixed(2)}</TableCell>
                  <TableCell>
                   <UpdateSalaryPayment fetchSalary={fetchSalary} salary={salary} bank={bank} />
                  </TableCell>
                </TableRow>
              );
            })}
            {salaries.length === 0 && (
              <TableCell colSpan={5} className="text-center text-gray-600 text-sm">
                <p className="text-base font-bold">No pending salaries...</p>
              </TableCell>
            )}
          </TableBody>
          <TableFooter>
            <p>{salaries?.length} salaries are Unpaid</p>
          </TableFooter>
        </Table>
  
      </div>
          </div>
      </div>
  </div>)
   }</>
  )
}

export default withAuth(Page)
