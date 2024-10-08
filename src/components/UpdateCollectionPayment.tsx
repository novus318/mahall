import React, { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Label } from './ui/label';
import { sendOtp } from '@/utils/sendOtp';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { toast } from './ui/use-toast';
import { Input } from './ui/input';

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

const UpdateCollectionPayment = ({ collection }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<string>('');
  const [bank, setBank] = useState<BankAccount[]>([]);
  const [targetAccount, setTargetAccount] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const otpSentRef = useRef(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`)
      .then(response => setBank(response.data.accounts))
      .catch(error => console.log("Error fetching accounts:", error));
  };

  const handlePayNowClick = async (c: any) => {
    setSelectedHouse(collection);
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

  const handleRejectPayment = async () => {
if(!otpVerified){
 await handleSendOtp()
      return;
    }
    if(otpVerified && !rejectionReason){
      toast({
        title: 'Please enter a rejection reason',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/house/reject/collection/${selectedHouse?._id}`, {
        rejectionReason,
      });
      if (response.data.success) {
        toast({
          title: 'Payment rejected successfully',
          variant: 'default',
        });
        setPaymentType('');
        setIsDialogOpen(false);
        setOtpSent(false);
        setOtpVerified(false);
        setEnteredOtp('');
        setOtp('');
        otpSentRef.current = false;
        setLoading(false);
        window.location.reload();
      }

    } catch (error: any) {
      toast({
        title: 'Failed to reject payment',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentType) {
      toast({
        title: 'Please select a payment type',
        description: 'You must select a payment type before submitting',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/house/update/collection/${selectedHouse?._id}`, {
        paymentType,
        targetAccount,
      });
      if (response.data.success) {
        toast({
          title: 'Payment updated successfully',
          variant: 'default',
        });
        setPaymentType('');
        setIsDialogOpen(false);
        setLoading(false);
        window.location.reload();
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Failed to update payment',
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
    setRejectionReason('');
  };

  return (
    <>
      <Button className="font-bold" onClick={handlePayNowClick}>
        Pay
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogTitle>
            Update Payment for {selectedHouse?.houseId?.number}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground font-semibold text-sm'>
            House: {selectedHouse?.houseId?.name}
            <br/>
            Collection Amount: ₹{(selectedHouse?.amount ?? 0).toFixed(2)}
            <br />
            Family Head: {selectedHouse?.memberId?.name}
          </DialogDescription>
    {!otpSent && (
         <div>
         <Label>
              Select account
            </Label>
            <Select onValueChange={setTargetAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select target account" />
              </SelectTrigger>
              <SelectContent>
                {bank.map((acc) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.name} - {acc.holderName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>
              Select type
            </Label>
            <Select onValueChange={(value) => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
         </div>
    )}
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
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectPayment}
              disabled={loading}
            >
              {loading ? <Loader2 className='animate-spin' /> : 'Reject Payment'}
            </Button>
            {!otpSent && (
              <Button
                onClick={handleSubmitPayment}
                disabled={!paymentType || !targetAccount || loading}
              >
                {loading ? <Loader2 className='animate-spin' /> : 'Update Payment'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateCollectionPayment;
