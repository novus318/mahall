'use client'
import React, { useEffect, useState } from 'react'
import { Card,CardHeader,CardDescription,CardTitle,CardContent } from './ui/card'
import { Table,TableBody,TableCell,TableHeader,TableRow,TableHead } from './ui/table'
import axios from 'axios'
import { Badge } from './ui/badge'
import { format } from 'date-fns'
import { toast } from './ui/use-toast'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash } from 'lucide-react';
import DatePicker from '@/components/DatePicker';
import { Input } from './ui/input'


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

const PendingSalaries = ({id,fetchStaffDetails}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [pendingPaySlips, setPendingPaySlips] = useState<any>([])
    const [paySlipModalOpen, setPaySlipModalOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedSalary, setSelectedSalary] = useState<any>(null);
    const [loading,setLoading] = useState(true)
    const [btLoading,setBtLoading] = useState(false)
    const [bank, setBank] = useState<BankAccount[]>([])
    const [deductions, setDeductions] = useState<any[]>([]);
    const [targetAccount, setTargetAccount] = useState<any>(null);
    const [payDate, setPayDate] = useState(null);

    const fetchPendingCollections = async () => {
        axios.get(`${apiUrl}/api/staff/pending-salary/${id}`)
          .then(response => {
            if (response.data.success) {
              setPendingPaySlips(response.data.payslips)
            }
          })
          .catch(error => {
            console.error("Error fetching pending collections:", error)
          })
      }

      useEffect(() => {
        fetchPendingCollections()
        fetchAccounts();
      }, [id])

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
       const netPay = selectedSalary?.basicPay-selectedSalary?.advancePay - deductions.reduce((acc, deduction) => acc + parseFloat(deduction.amount || 0), 0);
  

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

      const handleRejectPayment = async () =>{
       window.confirm(
         "Are you sure you want to reject this salary?"
        ) 
        if(!window.confirm) return;
        setBtLoading(true)
        try {
          const response = await axios.put(`${apiUrl}/api/staff/update/salary/${selectedSalary?._id}`, {
            status:'Rejected'
          });
          if (response.data.success) {
            toast({
              title: 'Salary has been rejected successfully',
              variant: 'default',
            });
            setIsDialogOpen(false);
            setTargetAccount(null)
            setPayDate(null)
            setDeductions([])
            fetchPendingCollections();
            fetchStaffDetails()
          }
        } catch (error: any) {
          toast({
            title: 'Failed to reject salary',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
        }
        setBtLoading(false)
      }
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
            status:'Paid',
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
            fetchPendingCollections();
            fetchStaffDetails()
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
    <Card>
    <CardHeader>
      <CardTitle>Pending Salaries</CardTitle>
      <CardDescription>pending employee salaries.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Pending Salary</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingPaySlips?.map((payslip: any) => (
            <TableRow key={payslip?._id}>
              <TableCell className="font-medium">
                {payslip?.salaryPeriod?.startDate && format(payslip?.salaryPeriod?.startDate, 'MMM yyyy')}
              </TableCell>
              <TableCell>₹{payslip?.basicPay}</TableCell>
              <TableCell>
                <Badge variant="outline"
                onClick={() => handleOpenDialog(payslip)}>{payslip?.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
          {pendingPaySlips?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No pending payslips found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogTitle>
          Update Payment for {selectedSalary?.staffId?.employeeId}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground font-semibold text-sm">
          Salary: ₹{(selectedSalary?.basicPay || 0).toFixed(2)}<br/>
          Advance payment: ₹{(selectedSalary?.advancePay || 0).toFixed(2)}
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
                value={deduction.amount === 0 ? '': deduction?.amount}
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
          <Button variant="outline" onClick={() => {setIsDialogOpen(false)
            setTargetAccount(null)
            setPayDate(null)
            setDeductions([])
          }}>
            Cancel
          </Button>
          <Button
        variant="destructive"
        onClick={handleRejectPayment} 
        disabled={btLoading}
      >
        Reject
      </Button>
          <Button onClick={handleSubmitPayment} disabled={btLoading || !targetAccount || !payDate}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  )
}

export default PendingSalaries
