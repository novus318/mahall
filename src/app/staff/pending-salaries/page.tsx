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
import Spinner from '@/components/Spinner';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash } from 'lucide-react';
import DatePicker from '@/components/DatePicker';


interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary:boolean;
}
const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [salaries, setSalaries] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedSalary, setSelectedSalary] = useState<any>(null);
    const [loading,setLoading] = useState(true)
    const [btLoading,setBtLoading] = useState(false)
    const [bank, setBank] = useState<BankAccount[]>([])
    const [deductions, setDeductions] = useState<any[]>([]);
    const [targetAccount, setTargetAccount] = useState<any>(null);
    const [payDate, setPayDate] = useState(null);
  
    const addDeduction = () => {
      setDeductions([...deductions, { name: '', amount: 0 }]);
    };
  
    const removeDeduction = (index:any) => {
      const updatedDeductions = deductions.filter((_, i) => i !== index);
      setDeductions(updatedDeductions);
    };
  
    const handleDeductionChange = (index:any, key:any, value:any) => {
      const updatedDeductions = [...deductions];
      updatedDeductions[index][key] = value;
      setDeductions(updatedDeductions);
    };
     const netPay = selectedSalary?.basicPay - deductions.reduce((acc, deduction) => acc + parseFloat(deduction.amount || 0), 0);


    useEffect(() => {
        fetchSalary();
        fetchAccounts();
      }, []);

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
      const fetchAccounts = () => {
        axios.get(`${apiUrl}/api/account/get`).then(response => {
          setBank(response.data.accounts)
        })
          .catch(error => {
            console.log("Error fetching accounts:", error)
          })
      }

      function formatMonth(dateString:any) {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'long' }); // e.g., "June"
      }
    
      const handleOpenDialog = (salary: any) => {
        setSelectedSalary(salary);
        setIsDialogOpen(true);
      };

      const handleSubmitPayment = async () => {
        const balance:any = bank.find(acc => acc._id === targetAccount)
        if (!targetAccount) {
          toast({
            title: 'Please select an account',
            variant: 'destructive',
          });
          return;
        }
        if(balance?.balance < netPay){
          toast({
            title: 'Insufficient balance',
            variant: 'destructive',
          });
          return;
        }
        if (!payDate) {
          toast({
            title: 'Please select payment date',
            variant: 'destructive',
          });
          return;
        }
        setBtLoading(true)
        try {
          const response = await axios.put(`${apiUrl}/api/staff/update/salary/${selectedSalary?._id}`, {
            deductions:deductions,
            netPay:netPay,
            paymentDate:payDate,
            accountId:targetAccount
          });
          if (response.data.success) {
            toast({
              title: 'Salary has been updated successfully',
              variant: 'default',
            });
            setIsDialogOpen(false);
            setTargetAccount(null)
            setPayDate(null)
            setDeductions([])
            fetchSalary();
          } 
        } catch (error: any) {
          toast({
            title: 'Failed to update Salary',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
        }  finally{
          setBtLoading(false)
        }
      };
    
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
                <p className="text-base font-bold">No pending salaries...</p>
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
        <DialogDescription className="text-muted-foreground font-semibold text-sm">
          Salary: ₹{(selectedSalary?.basicPay || 0).toFixed(2)}
        </DialogDescription>
        <div>
              <p className='text-sm font-medium' >
                Date of Pay
              </p>
              <DatePicker date={payDate} setDate={setPayDate} />
            </div>
        <div>
        <Label>
          Account
        </Label>
        <Select onValueChange={setTargetAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select debit account" />
                </SelectTrigger>
                <SelectContent>
                  {bank?.map((acc) => (
                    <SelectItem key={acc._id} value={acc._id}>
                      {acc.name} - {acc.holderName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </div>
        <div>
          {deductions.map((deduction, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-center">
             <div className='col-span-2'>
             <Label >
                  Deduction Name
  </Label>
              <Input
                type="text"
                placeholder="Deduction Name"
                value={deduction.name}
                onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
              />
             </div>
             <div className='col-span-2'>
              <Label>
                Amount
              </Label>
             <Input
                type="text"
                placeholder="Amount"
                value={deduction.amount}
                onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
              />
             </div>
              <Button className='mt-4' variant="destructive" size='sm' onClick={() => removeDeduction(index)}>
                <Trash className='h-5'/>
              </Button>
            </div>
          ))}
          <Button className='mt-3' variant="outline" size='sm' onClick={addDeduction}>
            <PlusCircle className='h-4'/> Add deductions
          </Button>
        </div>
        <h4 className='font-semibold text-muted-foreground'>Netpay : ₹{netPay.toFixed(2)}</h4>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitPayment} disabled={btLoading}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </div>
          </div>
      </div>
  </div>)
   }</>
  )
}

export default Page
