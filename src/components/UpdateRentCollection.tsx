'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { sendOtp } from '@/utils/sendOtp';
import axios from 'axios';
import { CheckCircle, } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from './DatePicker';



const UpdateRentCollection = ({ selectedCollection, fetchPendingCollections, bank }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [paymentType, setPaymentType] = useState<string>('');
    const [targetAccount, setTargetAccount] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const otpSentRef = useRef(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [btLoading, setBtLoading] = useState(false);
    const [payDate, setPayDate] = useState(null);
    const [leaveDays, setLeaveDays] = useState(null);
    const [advanceRepayment, setAdvanceRepayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState<any>(null);



    const handleOpenDialog = (collection: any) => {
        setIsDialogOpen(true);
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
        if (!targetAccount) {
            toast({
                title: 'Please select a bank account',
                variant: 'destructive',
            });
            return;
        }
        if (amount < 0) {
            toast({
                title: 'Invalid amount',
                description: 'Amount cannot be in minus',
                variant: 'destructive',
            });
            return;
        }
        if (advanceRepayment && advanceRepayment > selectedCollection?.advancePayment) {
            toast({
                title: 'Invalid advance repayment amount',
                description: 'Advance repayment amount cannot be more than advance amount',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(`${apiUrl}/api/rent/update/rent-collection/${selectedCollection.buildingId}/${selectedCollection.roomId}/${selectedCollection?.contractId}`, {
                rentCollectionId: selectedCollection.rentId,
                paymentDate: payDate,
                paymentType,
                newStatus: 'Paid',
                accountId: targetAccount,
                PaymentAmount: amount,
                amount: paymentAmount,
                leaveDays: leaveDays,
                leaveDeduction,
                advanceRepayment: advanceRepayment
            });
            if (response.data.success) {
                toast({
                    title: 'Payment updated successfully',
                    variant: 'default',
                });
                setPaymentType('');
                setIsDialogOpen(false);
                fetchPendingCollections();
                setLoading(false);
            }
        } catch (error: any) {
            setLoading(false)
            toast({
                title: 'Failed to update payment',
                description: error.response?.data?.message || error.message || 'Something went wrong',
                variant: 'destructive',
            });
        }
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
        setBtLoading(true);
        try {
            const response = await axios.put(`${apiUrl}/api/staff/update/salary`, {
                status: 'Rejected',
                rejectionReason: rejectionReason
            });
            if (response.data.success) {
                toast({
                    title: 'Salary has been rejected successfully',
                    variant: 'default',
                });
                setIsDialogOpen(false);
                setTargetAccount(null);
            }
        } catch (error: any) {
            toast({
                title: 'Failed to reject salary',
                description: error.response?.data?.message || error.message || 'Something went wrong',
                variant: 'destructive',
            });
        }
        setBtLoading(false);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setOtpSent(false);
        setOtpVerified(false);
        setEnteredOtp('');
        setOtp('');
        otpSentRef.current = false;
        setRejectionReason('');
        setTargetAccount(null);
    };

    const leaveDeduction = (selectedCollection?.amount / 30) * (leaveDays || 0);
    const advanceDeduction = advanceRepayment;
    const amount = selectedCollection?.amount - leaveDeduction - (advanceDeduction || 0)
    const formatCurrency = (amount: any) => {
        // Round off to the nearest integer and then format to two decimal places
        const roundedAmount = Math.round(amount * 100) / 100; // Round to two decimal places
        return `₹${roundedAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    useEffect(() => {
        setPaymentAmount(amount);
    }, [amount])

    return (
        <>
            <Button size='sm' onClick={handleOpenDialog} className="cursor-pointer">
                Update
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent>
                    <DialogTitle>
                        Update Payment for Room Number {selectedCollection?.roomNumber}
                    </DialogTitle>
                    <DialogDescription className='text-muted-foreground font-semibold text-sm'>
                        BuildingID: {selectedCollection?.buildingID}
                        <br />
                        Rent Amount: ₹{(selectedCollection?.amount ?? 0).toFixed(2)}
                        <br />
                        Name: {selectedCollection?.tenantName}<br />
                    </DialogDescription>
                    {!otpSent && (<div>
                        <div>
                            <p className='text-sm font-medium'>Date of Pay</p>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-md p-2 text-sm w-full"
                                value={payDate || ''}
                                onChange={(e: any) => setPayDate(e.target.value)}
                            />
                            {/* <DatePicker date={payDate} setDate={setPayDate} /> */}
                        </div>
                        <div className='space-y-2 mb-3'>
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
                            <div>
                                <Label>deduction (Max 30 days)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={30}
                                    placeholder="Number of deduction days"
                                    value={leaveDays || ''}
                                    onChange={(e: any) => setLeaveDays(e.target.value)} // Ensure leaveDays is between 0 and 30
                                />
                                <p className='text-sm'>Deduction amount: ₹{leaveDeduction.toFixed(2)}</p>
                            </div>

                        </div>
                        <h4 className='font-semibold text-muted-foreground'>Amount : {formatCurrency(amount)}</h4>
                        <Input
                            value={paymentAmount}
                            className="border border-gray-300 rounded-md p-2 text-sm w-full"
                            onChange={
                                (e: any) => setPaymentAmount(e.target.value)
                            }
                        />
                    </div>)}
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
                    <DialogFooter className='mt-14 gap-2'>
                        <Button variant="outline" onClick={handleDialogClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectPayment}
                            disabled={btLoading}
                        >
                            Reject
                        </Button>
                        {!otpSent && (<Button onClick={handleSubmitPayment} disabled={!paymentType || !targetAccount || loading}>
                            Submit
                        </Button>)}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UpdateRentCollection
