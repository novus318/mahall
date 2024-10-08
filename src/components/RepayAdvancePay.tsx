'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { FilePenIcon, IndianRupee, Loader2 } from 'lucide-react'
import { Label } from './ui/label'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from './ui/use-toast'

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

const RepayAdvancePay = ({id,fetchStaffDetails,staff}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [bank, setBank] = useState<BankAccount[]>([])
    const [targetAccount, setTargetAccount] = useState<any>(null);


    const fetchAccounts = () => {
        axios.get(`${apiUrl}/api/account/get`).then(response => {
          setBank(response.data.accounts)
        })
          .catch(error => {
            console.log("Error fetching accounts:", error)
          })
      }
    useEffect(() => {
        fetchAccounts();
      }, [])

      const handleSubmit = async () => {
        const bankBalance:any = bank.find(acc => acc._id === targetAccount)
        if (!targetAccount || amount <= 0) {
          toast({
            title: 'Error',
            description: 'Please fill in all required fields',
            variant: 'destructive',
          });
          return;
        }
        if(amount > staff?.advancePayment){
          toast({
            title: 'Error',
            description: 'The amount to be repaid cannot be more than the advance payment amount',
            variant: 'destructive',
          });
          return;
        }
        if (bankBalance?.balance < amount) {
          toast({
            title: 'Error',
            description: 'Insufficient balance in the selected account',
            variant: 'destructive',
          });
          return;
          }
        try {
            setLoading(true);
         const res = await axios.post(`${apiUrl}/api/staff/repay-advance-pay/${id}`, { amount, targetAccount });
         if (res.data.success) {
            setLoading(false);
            setIsOpen(false);
            toast({
              title: 'Advance Repayment successfully',
              variant: 'default',
            });
            fetchStaffDetails()
         }
        } catch (error:any) {
            setLoading(false);
          toast({
            title: 'Failed to repay advance',
            description: error.response?.data?.message || error.message || 'something went wrong',
            variant: 'destructive',
          });
        }
      };


  return (
     <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
    <DialogTrigger asChild>
    <Button
              size='sm'>
              <IndianRupee className="h-4 w-4 mr-2" />
            Repay advance
            </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogTitle>
            Repay advance payment
        </DialogTitle>
        <div>
                <Label>
                    Amount
                </Label>
                <Input
                type='number'
                    name='amount'
                    value={amount === 0 ? '' : amount}
                    onChange={
                        (e) => {
                          setAmount(Number(e.target.value))
                        }
                    }
                    placeholder='amount'
                    className='w-full'
                />
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
       {loading ? (
            <Button disabled>
                <Loader2 className='animate-spin' />
            </Button>
        ) : (
            <Button
            disabled={loading || !amount || amount < 1 ||!targetAccount}
            onClick={handleSubmit}>
                Pay
            </Button>
        )}
       </div>
    </DialogContent>
</Dialog>
  )
}

export default RepayAdvancePay
