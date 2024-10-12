'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';


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


const UpdateDeposit = ({ contractDetails, roomId, buildingId,fetchRoomDetails }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');



const handleUpdateDeposit = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/rent/pay-deposit/${buildingId}/${roomId}/${contractDetails._id}`, {
        status:'Paid',
        paymentMethod:paymentMethod,
      });
      toast({
        title: 'Deposit status updated successfully',
        variant: 'default',
      });
      fetchRoomDetails()
      setShowDialog(false);
      setPaymentMethod('')
    } catch (error:any) {
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
        <Badge
          onClick={() => {
            setShowDialog(true)
          }}>
          {contractDetails?.depositStatus}
        </Badge>
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
          <div>
            <Label>
              Select payment type
            </Label>
            <Select onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem  value='Cash'>
                      Cash
                    </SelectItem>
                    <SelectItem  value='Online'>
                      Online
                    </SelectItem>
                </SelectContent>
              </Select>
          </div>
          <DialogFooter>
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
