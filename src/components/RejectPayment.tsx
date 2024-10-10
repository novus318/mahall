'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogFooter} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { sendOtp } from '@/utils/sendOtp';


const RejectPayment = ({paymentId,fetchPayments}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const otpSentRef = useRef(false);
    const [rejectionReason, setRejectionReason] = useState('');
    
 
  
    const handleOpenDialog = async() => {
        await handleSendOtp()
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
    const handleReject = async () => {
        if (!otpVerified) {
          await handleSendOtp()
          return;
        }
        if (otpVerified && !rejectionReason) {
          toast({
            title: 'Please enter a rejection reason',
            variant: 'destructive',
          });
          return;
        }
        try {
          setLoading(true)
          const response = await axios.put(`${apiUrl}/api/pay/reject-payment/${paymentId}`,{
            rejectionReason:rejectionReason
          });
        if(response.data.success){
          fetchPayments();
          setLoading(false)
        }
        } catch (error:any) {
          setLoading(false)
          toast({
            title: 'Error',
            description: error?.response?.data?.error || error.response?.data?.message || error.message  || 'An error occurred while trying to update the payment. Please try again later.',
            variant:'destructive'
          })
        }
      };
  
 
  

    const handleDialogClose = () => {
      setIsDialogOpen(false);
      setOtpSent(false);
      setOtpVerified(false);
      setEnteredOtp('');
      setOtp('');
      otpSentRef.current = false;
      setRejectionReason('');
    };
  return (
    <>
    <Button variant='destructive' size='sm' onClick={() => handleOpenDialog()} className="cursor-pointer">
      Reject
    </Button>
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogTitle>
          Are you sure rejecting Payment
        </DialogTitle>
        {otpSent && (
          <div className='grid grid-cols-5 items-center gap-2'>
            <div className='col-span-3'>
              {!otpVerified ? (
                <>
                  <Label className="mt-4">Enter OTP</Label>
                  <Input
                    type="number"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter OTP"
                  /></>
              ) : (
                <>
                  <Label className="mt-4">Rejection Reason</Label>
                  <Input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason"
                  />
                </>
              )}
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
            onClick={handleReject}
            disabled={loading}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  )
}

export default RejectPayment
