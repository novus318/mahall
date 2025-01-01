'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import UpdateRentCollection from '@/components/UpdateRentCollection';
import axios from 'axios';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';

interface RentCollection {
    buildingName: string;
    roomNumber: string;
    tenantName: string;
    period: string;
    amount: number;
    tenantNumber: string;
    dueDate: string;
    shop: string;
    status: 'Pending' | 'Overdue' | 'Paid';
    contractId:string;
    roomId:string;
    buildingId:string;
}
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

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const WHATSAPP_API_URL: any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL; 
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN; 
  const [bank, setBank] = useState<BankAccount[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [collections, setCollections] = useState<RentCollection[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingLoading, setSendingLoading] = useState<boolean[]>([]); // Array to track loading states for each reminder

    useEffect(() => {
        fetchPendingCollections();
        fetchAccounts();
    }, []);

    const fetchAccounts = () => {
        axios.get(`${apiUrl}/api/account/get`).then(response => {
            setBank(response.data.data)
        })
            .catch(error => {
                console.log("Error fetching accounts:", error)
            })
    }
    const fetchPendingCollections = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/rent/rent-collections/pending`);
            if (response.data.success) {
                setCollections(response.data.pendingCollections);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const handleSendReminder = async (collection: RentCollection,index: number) => {
      const rent = collection.amount.toFixed(2)
      setSendingLoading(prev => {
        const newLoadingState = [...prev];
        newLoadingState[index] = true; // Set loading for this index
        return newLoadingState;
    });
        try {
            const response = await axios.post(
                WHATSAPP_API_URL,
                {
                    messaging_product: 'whatsapp',
                    to: `${collection.tenantNumber}`,
                    type: 'template',
                    template: {
                        name: 'rent_reminder',
                        language: {
                            code: 'ml'
                        },
                        components: [
                            {
                                type: 'body',
                                parameters: [
                                    { type: 'text', text: collection.tenantName },
                                    { type: 'text', text: collection.period },
                                    { type: 'text', text: collection.roomNumber },
                                    { type: 'text', text: rent.toString() }
                                ]
                            },
                            {
                                type: 'button',
                                sub_type: 'url',
                                index: '0',
                                parameters: [
                                    { type: 'text', text: `${collection.buildingId}/${collection.roomId}/${collection.contractId}` }
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
            if (response.status === 200) {
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
        setSendingLoading(prev => {
          const newLoadingState = [...prev];
          newLoadingState[index] = false; // Reset loading for this index
          return newLoadingState;
      });
      }
  };

    const filteredCollections = collections.filter(
        (collection) =>
            collection.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collection.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collection.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collection.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collection.amount.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Skeleton />
            </div>
        )
    }

    return (
        <div className='p-2'>
            <div className='max-w-7xl mx-auto'>
                <div className="mb-4 flex justify-between items-center">
                    <Link href={`/rent`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                        Back
                    </Link>
                </div>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Pending Rent Collections</h1>
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />
                    <Suspense fallback={<Skeleton />}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Building Name</TableHead>
                                    <TableHead>Room Number</TableHead>
                                    <TableHead>Shop</TableHead>
                                    <TableHead>Tenant Name</TableHead>
                                    <TableHead>Number</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCollections.map((collection, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{collection.buildingName}</TableCell>
                                        <TableCell>{collection.roomNumber}</TableCell>
                                        <TableCell>{collection.shop}</TableCell>
                                        <TableCell>{collection.tenantName}</TableCell>
                                        <TableCell>{collection.tenantNumber}</TableCell>
                                        <TableCell>{collection.period}</TableCell>
                                        <TableCell>{collection.amount}</TableCell>
                                        <TableCell>{new Date(collection.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell className='space-x-2'>
                                            <UpdateRentCollection selectedCollection={collection} fetchPendingCollections={fetchPendingCollections} bank={bank}/>
                                            <Button
                                                onClick={() => handleSendReminder(collection, index)}
                                                size='sm'
                                                disabled={sendingLoading[index]} // Disable the button while loading
                                            >
                                                {sendingLoading[index] ? 'Sending...' : 'Remind'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default Page;
