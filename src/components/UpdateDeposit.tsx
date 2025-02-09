'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';



const UpdateDeposit = ({ contractDetails, roomId, buildingId, fetchRoomDetails, bank }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [targetAccount, setTargetAccount] = useState<string | null>(null);



  const handleUpdateDeposit = async () => {
         if (!paymentMethod) {
                toast({
                    title: 'Please select a payment type',
                    description: 'You must select a payment type before submitting',
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
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/rent/pay-deposit/${buildingId}/${roomId}/${contractDetails._id}`, {
        status: 'Paid',
        paymentMethod: paymentMethod,
        accountId: targetAccount,
      });
      toast({
        title: 'Deposit status updated successfully',
        variant: 'default',
      });
      fetchRoomDetails()
      setShowDialog(false);
      setPaymentMethod('')
    } catch (error: any) {
      toast({
        title: 'Error updating deposit status',
        description: error.response?.data?.message || error.message || 'something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {contractDetails?.depositStatus === 'Pending' ? (
     <>{ contractDetails?.deposit === 0 ?
      <Badge>
      no deposit
    </Badge>
     : <Badge
          onClick={() => {
            setShowDialog(true)
          }}>
          {contractDetails?.depositStatus}
        </Badge>}
     </>   
      ) : (
        <Badge>
          {contractDetails?.depositStatus}
        </Badge>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update deposit status</DialogTitle>
          </DialogHeader>
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
          <DialogFooter className='mt-12 gap-2'>
            <Button size='sm' variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button size='sm' disabled={!paymentMethod || loading}
                onClick={handleUpdateDeposit}>
                Update
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateDeposit
