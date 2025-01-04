import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from './ui/use-toast'



  interface FormDataType {
    deduction: number | null;
  }
const ReturnDeposit = ({ contractDetails, roomId, buildingId,fetchRoomDetails,bank}:any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [paymentMethod, setPaymentMethod] = useState('');
    const [targetAccount, setTargetAccount] = useState<string | null>(null);
    
      const handleUpdateReturn = async () => {
        const balance: any = bank.find((acc:any) => acc._id === targetAccount);
        if (!paymentMethod) {
            toast({
                title: 'Please select a payment method',
                variant: 'destructive',
              });
            return;
        }
          if (!targetAccount) {
                    toast({
                        title: 'Please select a bank account',
                        variant: 'destructive',
                    });
                    return;
                }
     
         if (balance?.balance < contractDetails?.deposit) {
            toast({
              title: 'Insufficient balance',
              variant: 'destructive',
            });
            return;
          }
        setLoading(true);
        try {
            const data ={
                status:'Returned',
                paymentMethod:paymentMethod,
                accountId: targetAccount,
              }
          const response =await axios.post(`${apiUrl}/api/rent/return-deposit/${buildingId}/${roomId}/${contractDetails._id}`,data);
      if(response.data.success){
        toast({
            title: 'Deposit returned successfully',
            variant: 'default',
          });
          setIsOpen(false);
          setPaymentMethod('')
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
    
      <div className='space-y-2'>
                {bank.length > 0 ? (
                  <>
                    <Label>
                      Select bank
                    </Label>
                    <Select onValueChange={setTargetAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bank?.map((acc: any) => (
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
                <Label>
                  Select payment type
                </Label>
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Cash'>
                      Cash
                    </SelectItem>
                    <SelectItem value='Online'>
                      Online
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
           <DialogFooter>
            <Button size='sm' variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button size='sm' disabled={!paymentMethod || loading}
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
