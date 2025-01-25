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
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from './ui/use-toast';
import UpdateCollectionPayment from './UpdateCollectionPayment';
import { Button } from './ui/button';
import { AlertCircle, Check, ChevronDown, Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

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
  const [filter, setFilter] = useState<'all' | 'monthly' | 'yearly'>('all');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [bank, setBank] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHouses();
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/account/get`);
      setBank(response.data.data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      toast({
        title: 'Failed to fetch accounts',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemind = async (house: any) => {
    const originalDate = new Date(house.collectionMonth);
    originalDate.setMonth(originalDate.getMonth());
    const month = originalDate.toLocaleString('default', { month: 'long' });
    const houseId = house._id;

    setLoadingStates((prev) => ({ ...prev, [houseId]: true }));

    try {
     if(house?.paymentType === 'yearly'){
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: `${house.memberId.whatsappNumber}`,
          type: 'template',
          template: {
            name: 'yearly_collection_reminder',
            language: {
              code: 'ml'
            },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: `${house.memberId.name}` },
                  { type: 'text', text: `${house?.paidYear}` },
                  { type: 'text', text: `${house?.houseId?.number}` },
                  { type: 'text', text: `${house?.totalAmount}` },
                  { type: 'text', text: `${house?.totalAmount - house?.paidAmount}` },
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
     }else{
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
                  { type: 'text', text: `${house.collectionMonth}` },
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
     }
    } catch (error: any) {
      toast({
        title: 'Failed to send reminder',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [houseId]: false }));
    }
  };

  const filteredHouses = houses.filter((house) => {
    const matchesSearchQuery =
      house?.houseId?.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.amount.toString().includes(searchQuery) ||
      house.memberId.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'monthly' && house.paymentType === 'monthly') ||
      (filter === 'yearly' && house.paymentType === 'yearly');

    return matchesSearchQuery && matchesFilter;
  });

  return (
    <div className="bg-gray-50/50 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back!</h1>
          <p className="text-gray-500">Here&apos;s a list of your Unpaid Collections!</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search collections..."
                className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-full">
                  {filter === 'all' ? 'All Types' : filter === 'monthly' ? 'Monthly' : 'Yearly'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>All Types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('monthly')}>Monthly</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('yearly')}>Yearly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            className="rounded-full"
            onClick={() => {
              window.location.href = '/collection/paid-collection';
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            Paid Collections
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-medium">
              {filteredHouses.length} houses are Unpaid
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Collection Amount</TableHead>
                  <TableHead>Family Head</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-600 text-sm py-6">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredHouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-600 text-sm py-6">
                      <h4 className="text-lg font-bold">No collections found...</h4>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHouses.map((collection, index) => {
                    const isLoading = loadingStates[collection?._id];
                    return (
                      <React.Fragment key={index}>
                        {/* Main Row */}
                        <TableRow className="group">
                          <TableCell>{collection?.paymentType === 'monthly' ? collection?.collectionMonth : collection?.paidYear}</TableCell>
                          <TableCell className="font-medium">
                          <Link className="text-blue-600 hover:underline" href={`/house/house-details/${collection.houseId?._id}`}>
                            <div className="flex flex-col md:flex-row md:items-center">
                              <span className="mb-1 md:mb-0 md:mr-2">{collection?.houseId?.number}</span>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
                                  collection?.paymentType === 'monthly'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-purple-50 text-purple-700'
                                }`}
                              >
                                {collection?.paymentType}
                              </span>
                            </div>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">₹{collection.amount.toFixed(2)}</div>
                              {collection.status === 'Partial' && (
                                <>
                                  <Progress
                                    value={(collection.paidAmount! / collection.amount) * 100}
                                    className="h-2"
                                  />
                                  <div className="text-xs text-gray-500">
                                    Paid: ₹{collection.paidAmount!.toFixed(2)}
                                  </div>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{collection?.memberId?.name}</TableCell>
                          <TableCell>{collection?.memberId?.whatsappNumber}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                collection.status === 'Paid'
                                  ? 'bg-green-50 text-green-700'
                                  : collection.status === 'Partial'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {collection.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <UpdateCollectionPayment collection={collection} bank={bank} />
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => handleRemind(collection)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : "Reminder"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                  
                        {/* Partial Payments Row (for yearly payments) */}
                        {collection?.paymentType === 'yearly' && collection.partialPayments?.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="py-3">
                              <div className="pl-6 space-y-2">
                                {collection.partialPayments.map((payment: any, index: number) => (
                                  <div key={index} className="flex justify-between text-sm text-gray-600">
                                    <div>
                                      <span className="font-medium">Paid: ₹{payment.amount.toFixed(2)}</span>
                                      <span className="mx-2">•</span>
                                      <span className="text-xs font-bold">
                                        {format(new Date(payment?.PaymentDate ? payment?.PaymentDate : new Date()), 'MMM dd, yyyy')}
                                      </span>
                                    </div>
                                    <div>
                                      {payment?.description && <span className="text-xs">{payment.description}</span>}
                                      {payment?.receiptNumber && (
                                        <span className="ml-2 text-gray-500 text-xs font-bold">Receipt: {payment.receiptNumber}</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataTable;