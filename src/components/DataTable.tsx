'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from './ui/use-toast';
import UpdateCollectionPayment from './UpdateCollectionPayment';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react'; // Import Loader component for loading state
import { format } from 'date-fns';


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
const DataTable = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const WHATSAPP_API_URL: any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL; 
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN; 

  const [houses, setHouses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [bank, setBank] = useState<BankAccount[]>([]); // State for loading

  useEffect(() => {
    fetchHouses();
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`)
      .then(response => setBank(response.data.data))
      .catch(error => console.log("Error fetching accounts:", error));
  };

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

  const handleRemind = async (house: any) => {
    const originalDate = new Date(house.date);
  
    // Set the month to one month before the original date
    originalDate.setMonth(originalDate.getMonth() - 1);
    
    // Get the month name from the modified date
    const month = originalDate.toLocaleString('default', { month: 'long' });
    const houseId = house._id; 

    setLoadingStates((prev) => ({ ...prev, [houseId]: true })); // Set loading state to true

    try {
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: `${house.memberId.whatsappNumber}`,
          type: 'template',
          template: {
            name: 'collection_reminder',
            language: {
              code: 'ml' 
            },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: `${house.memberId.name}` }, 
                  { type: 'text', text: `${month}` },
                  { type: 'text', text: `${house?.houseId?.number}` },
                  { type: 'text', text: `${house.amount}` },
                ]
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [
                  { type: 'text', text: `${house.memberId._id}` }  
                ]
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        toast({
          title: 'Reminder sent successfully',
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Failed to send reminder',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [houseId]: false })); // Reset loading state
    }
  };

  const filteredHouses = houses.filter((house) => {
    return (
      house?.houseId?.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.amount.toString().includes(searchQuery) ||
      house.memberId.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };

  return (
    <div className='w-full p-2 rounded-md border my-2 md:my-4 mx-auto'>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <p className='text-sm font-semibold text-muted-foreground ms-1'>{filteredHouses.length} houses are Unpaid</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>House</TableHead>
            <TableHead>Collection Amount</TableHead>
            <TableHead>Family Head</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead> {/* Added Actions Header */}
          </TableRow>
        </TableHeader>
        <TableBody>
        {filteredHouses.map((house, index) => {
             const { dayMonthYear, time } = formatDate(house?.date);
            const isLoading = loadingStates[house._id]; // Check if this house is loading
            return (
              <TableRow key={index}>
                <TableCell>   <div className='text-sm'>{dayMonthYear}</div>
                <div className="text-xs text-gray-500">{time}</div>
                </TableCell>
                <TableCell>{house?.houseId?.number}</TableCell>
                <TableCell>₹{(house?.amount).toFixed(2)}</TableCell>
                <TableCell>{house?.memberId?.name}</TableCell>
                <TableCell>{house?.memberId?.whatsappNumber}</TableCell>
                <TableCell>
                  <UpdateCollectionPayment collection={house} bank={bank} />
                </TableCell>
                <TableCell>
                  <Button size='sm' onClick={() => handleRemind(house)} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Remind'} {/* Show loading indicator */}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredHouses.length === 0 && (
            <TableCell colSpan={7} className="text-center text-gray-600 text-sm">
              <h4 className="text-lg font-bold">No collections...</h4>
            </TableCell>
          )}
          {filteredHouses.length === 0 && (
            <TableCell colSpan={7} className="text-center text-gray-600 text-sm">
              <h4 className="text-lg font-bold">No collections...</h4>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
