'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import React, { useState } from 'react';
import DatePicker from './DatePicker';

interface UpdatePartialRentCollectionProps {
  selectedCollection: any;
  fetchPendingCollections: () => void;
  bank: any[];
}

const UpdatePartialRentCollection = ({ selectedCollection, fetchPendingCollections, bank }: UpdatePartialRentCollectionProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [targetAccount, setTargetAccount] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [payDate, setPayDate] = useState<Date | null>(null);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setPaymentType('');
    setTargetAccount(null);
    setPaymentAmount(null);
    setPayDate(null);
  };

  const validateInputs = () => {
    if (!paymentType) {
      toast({
        title: 'Payment type is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!targetAccount) {
      toast({
        title: 'Bank account is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: 'Invalid payment amount',
        description: 'Payment amount must be greater than 0',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmitPayment = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/api/rent/update-partial/rent-collection/${selectedCollection.buildingId}/${selectedCollection.roomId}/${selectedCollection.contractId}`,
        {
          rentCollectionId: selectedCollection.rentId,
          paymentDate: payDate,
          paymentType,
          accountId: targetAccount,
          amount: paymentAmount,
        }
      );

      if (response.data.success) {
        toast({
          title: 'Payment updated successfully',
          variant: 'default',
        });
        handleDialogClose();
        fetchPendingCollections();
      }
    } catch (error: any) {
      toast({
        title: 'Failed to update payment',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <>
      <Button size="sm" onClick={handleOpenDialog} className="cursor-pointer">
        Update
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogTitle>Update Payment for Room Number {selectedCollection?.roomNumber}</DialogTitle>
          <DialogDescription className="text-muted-foreground font-semibold text-sm">
            BuildingID: {selectedCollection?.buildingID}
            <br />
            Rent Amount: {formatCurrency(selectedCollection?.amount ?? 0)}
            <br />
            Tenant Name: {selectedCollection?.tenantName}
          </DialogDescription>

          <div className="space-y-4">
            {bank.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label>Select Bank Account</Label>
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
                </div>

                <div className="space-y-2">
                  <Label>Select Payment Type</Label>
                  <Select onValueChange={setPaymentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <p className="text-red-500">No bank accounts available. Please try again later.</p>
            )}

            <div className="space-y-2">
              <Label>Payment Amount</Label>
              <Input
                type="number"
                value={paymentAmount ?? ''}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                placeholder="Enter payment amount"
              />
            </div>

            <input
              type="date"
              className="border border-gray-300 rounded-md p-2 text-sm w-full"
              value={payDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
              onChange={(e:any) => setPayDate(new Date(e.target.value))}
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPayment} disabled={!paymentType || !targetAccount || !paymentAmount || loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdatePartialRentCollection;