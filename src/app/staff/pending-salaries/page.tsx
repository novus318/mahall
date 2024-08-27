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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogDescription } from '@radix-ui/react-dialog';
import Link from 'next/link';

const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [salaries, setSalaries] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedSalary, setSelectedSalary] = useState<any>(null);
    const [loading,setLoading] = useState(false)


    useEffect(() => {
        fetchSalary();
      }, []);

      const fetchSalary = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/staff/pending-salaries`);
          if (response.data.success) {
            setSalaries(response.data.payslips);
          }
        } catch (error: any) {
          toast({
            title: 'Failed to fetch salaries',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
        }
      };

      function formatMonth(dateString:any) {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'long' }); // e.g., "June"
      }
    
      const handleOpenDialog = (salary: any) => {
        setSelectedSalary(salary);
        setIsDialogOpen(true);
      };

      const handleSubmitPayment = async () => {
        try {
          const response = await axios.put(`${apiUrl}/api/house/update/collection/`, {
          });
          if (response.data.success) {
            toast({
              title: 'Payment updated successfully',
              variant: 'default',
            });
            setIsDialogOpen(false);
            fetchSalary();
          } 
        } catch (error: any) {
          toast({
            title: 'Failed to update payment',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
        }
      };
    
  return (
    <div className='p-2'>
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
                {formatMonth(salary?.salaryPeriod?.startDate)} - {formatMonth(salary?.salaryPeriod?.endDate)}
                </TableCell>
                <TableCell>{salary?.staffId?.name}</TableCell>
                <TableCell>₹{(salary?.basicPay).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge onClick={() => handleOpenDialog(salary)} className="cursor-pointer">
                    {salary?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
          {salaries.length === 0 && (
            <TableCell colSpan={5} className="text-center text-gray-600 text-sm">
              <h4 className="text-lg font-bold">No pending salaries...</h4>
            </TableCell>
          )}
        </TableBody>
        <TableFooter>
          <p>{salaries?.length} salaries are Unpaid</p>
        </TableFooter>
      </Table>

      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogTitle>
            Update Payment for {selectedSalary?.staffId?.employeeId}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground font-semibold text-sm'>
            Salary: ₹{(selectedSalary?.basicPay || 0).toFixed(2)}
          </DialogDescription>

          <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPayment} disabled={loading}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
        </div>
    </div>
</div>
  )
}

export default Page
