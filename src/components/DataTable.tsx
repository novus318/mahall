'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { toast } from './ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { Label } from './ui/label';
import UpdateCollectionPayment from './UpdateCollectionPayment';

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

const DataTable = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<string>('');
  const [bank, setBank] = useState<BankAccount[]>([])
  const [targetAccount, setTargetAccount] = useState<string | null>(null);

  useEffect(() => {
    fetchHouses();
    fetchAccounts()
  }, []);

  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`).then(response => {
      setBank(response.data.accounts)
    })
      .catch(error => {
        console.log("Error fetching accounts:", error)
      })
  }
  const fetchHouses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/get/pending/collections`);
      if (response.data.success) {
        setHouses(response.data.houses);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to fetch houses',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };

  const handleOpenDialog = (house: any) => {
    setSelectedHouse(house);
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
        fetchHouses();
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

  const filteredHouses = houses.filter((house) => {
    return (
      house?.houseId?.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.amount.toString().includes(searchQuery) ||
      house.memberId.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className='w-full p-2 rounded-md border my-2 md:my-4 mx-auto'>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
<p className='text-sm font-semibold text-muted-foreground ms-1'>{filteredHouses?.length} houses are Unpaid</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>House</TableHead>
            <TableHead>Collection Amount</TableHead>
            <TableHead>Family Head</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHouses.map((house, index) => {
            const { dayMonthYear, time } = formatDate(house?.date);
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className='text-sm'>{dayMonthYear}</div>
                  <div className="text-xs text-gray-500">{time}</div>
                </TableCell>
                <TableCell>{house?.houseId?.number}</TableCell>
                <TableCell>₹{(house?.amount).toFixed(2)}</TableCell>
                <TableCell>{house?.memberId?.name}</TableCell>
                <TableCell>{house?.memberId?.whatsappNumber}</TableCell>
                <TableCell>
                 <UpdateCollectionPayment collection={house}/>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredHouses.length === 0 && (
            <TableCell colSpan={5} className="text-center text-gray-600 text-sm">
              <h4 className="text-lg font-bold">No collections...</h4>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
