import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios'
import { Loader2 } from 'lucide-react'
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
    primary: boolean;
  }
const ReturnDeposit = ({ contractDetails, roomId, buildingId,fetchRoomDetails}:any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [bank, setBank] = useState<BankAccount[]>([])
    const [targetAccount, setTargetAccount] = useState<string | null>(null);
    const [RecieptCategories, setRecieptCategories] = useState<any[]>([]);
    const [targetCategory, setTargetCategory] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      deduction:null,
    });

    const fetchAccounts = () => {
        axios.get(`${apiUrl}/api/account/get`).then(response => {
          setBank(response.data.accounts)
        })
          .catch(error => {
            console.log("Error fetching accounts:", error)
          })
      }
    
      const fetchRecCategories = () => {
        axios.get(`${apiUrl}/api/reciept/category/all`).then(response => {
          setRecieptCategories(response.data.categories)
        })
         .catch(error => {
            console.log("Error fetching pay categories:", error)
          })
      }
      useEffect(() => {
        fetchAccounts()
        fetchRecCategories()
      }, [])
      const handleUpdateReturn = async () => {
        const bankBalance:any = bank.find(acc => acc._id === targetAccount)
        if (!targetAccount) {
            toast({
                title: 'Please select a bank account',
                variant: 'destructive',
              });
            return;
        }
        if((formData.deduction || 0) > 0 && !targetCategory){
            toast({
                title: 'Please select deduction reason',
                variant: 'destructive',
              });
            return;
        }
        if(returnAmount < 0){
            toast({
                title: 'Return amount should be greater than 0',
                variant: 'destructive',
              });
            return;
        }
        if(bankBalance?.balance < returnAmount){
            toast({
                title: 'Insufficient balance in selected bank account',
                variant: 'destructive',
              });
            return;
        }
        setLoading(true);
        try {
            const data ={
                deduction:formData.deduction,
                accountId:targetAccount,
                status:'Returned',
                amount:returnAmount,
                receiptId:targetCategory
              }
          const response =await axios.post(`${apiUrl}/api/rent/return-deposit/${buildingId}/${roomId}/${contractDetails._id}`,data);
      if(response.data.success){
        toast({
            title: 'Deposit returned successfully',
            variant: 'default',
          });
          setIsOpen(false);
          setFormData({
            deduction:null,
          });
          fetchRoomDetails();
      }
        } catch (error:any) {
          toast({
            title: 'Error returning deposit',
            description: error.response?.data?.message || error.message || 'something went wrong',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }

      const returnAmount = contractDetails?.deposit - (formData.deduction || 0);

  return (  <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
  <DialogTrigger asChild>
  <Button
    size='sm'>
      {contractDetails?.status === 'active' ? 'Cancel contract' :  'Return Deposit'}
    </Button>
  </DialogTrigger>
  <DialogContent>
      <DialogTitle>
          Return deposit
      </DialogTitle>
      <p className='font-semibold text-muted-foreground'>Deposit: ₹{contractDetails?.deposit}</p>
      {bank.length > 1 ? (
            <>
            <Label>
              Select bank
            </Label>
              <Select onValueChange={setTargetAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {bank.map((acc) => (
                    <SelectItem key={acc._id} value={acc._id}>
                      {acc.name} - {acc.holderName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <p>Please close and open again.</p>
          )}
          <div className='space-y-2'>
            <Label>
              Any deductions
            </Label>
            <Input
              type='text'
              value={formData.deduction || ''}
              onChange={(e) => setFormData({...formData, deduction: Number(e.target.value) })}
              placeholder='Deduction Amount'
              />
            <div className="w-full">
          <Label>Select category</Label>
          <Select value={targetCategory || 'Select category'} onValueChange={setTargetCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {RecieptCategories?.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          </div>
          <p className='font-semibold text-gray-700'>Return Amount: ₹{returnAmount}</p>
          <DialogFooter>
            <Button size='sm' variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button size='sm' disabled={!targetAccount || loading}
              onClick={handleUpdateReturn}>
                Update
              </Button>
            )}
            </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default ReturnDeposit
