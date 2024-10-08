'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle, Circle, CircleAlert, Dot, PlusCircle, Trash } from 'lucide-react';
import DatePicker from '@/components/DatePicker';
import axios from 'axios';
import { sendOtp } from '@/utils/sendOtp';

const StaffResign = ({id}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const otpSentRef = useRef(false);
   

  
    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };
  
    const handleSendOtp = async (): Promise<void> => {
      if (otpSentRef.current) return;
      otpSentRef.current = true;
  
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);
  
      const otpSentStatus = await sendOtp(generatedOtp);
      setOtpSent(otpSentStatus);
      toast({
        title: 'OTP sent to your registered number',
        variant: 'default',
      });
    };
  
    const verifyOtp = () => {
      if (enteredOtp === otp) {
        setOtpVerified(true);
        toast({
          title: 'OTP verified',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Invalid OTP',
          variant: 'destructive',
        });
      }
    };
    const handleResign = async () => {
      if (!otpSent) {
        await handleSendOtp()
        return;
      }
      if(!otpVerified){
        toast({
          title: 'Please verify the OTP sent to your registered number',
          variant: 'destructive',
        });
        return;
      }
      setLoading(true);
      try {
        const response = await axios.put(`${apiUrl}/api/staff/update-status/${id}`, {
            newStatus: 'Resigned',
        });
        if (response.data.success) {
          toast({
            title: 'Staff has been resigned successfully',
            variant: 'default',
          });
          setIsDialogOpen(false);
          setLoading(false);
          window.location.reload();
        }
      } catch (error: any) {
        setLoading(false);
        toast({
          title: 'Failed to resign staff',
          description: error.response?.data?.message || error.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    };
  
 
    const handleDialogClose = () => {
      setIsDialogOpen(false);
      setOtpSent(false);
      setOtpVerified(false);
      setEnteredOtp('');
      setOtp('');
      otpSentRef.current = false;
    };
  return (
    <>
    <Button variant='destructive' size='sm' onClick={handleOpenDialog} className="cursor-pointer">
      Staff resigned
    </Button>
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogTitle>
          Resign staff
        </DialogTitle>
     {!otpSent && (
        <div className='py-2 flex gap-2'>
            <CircleAlert className='text-red-400'/>
            <p className='text-red-500 font-medium text-base'>
                please Note clear all pending salaries and advance payments before submiting resignation.
            </p>
        </div>
     )}
        {otpSent && (
          <div className='grid grid-cols-5 items-center gap-2'>
            <div className='col-span-3'>
            
                  <Label className="mt-4">Enter OTP</Label>
                  <Input
                    type="number"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
            </div>
            {!otpVerified ? (
              <Button size='sm' onClick={verifyOtp} className="mt-6">
                Verify OTP
              </Button>
            ) : (
              <CheckCircle className="mr-2 animate-pulse mt-5" />
            )}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleResign}
            disabled={loading}
          >
            Submit resignation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  )
}

export default StaffResign
