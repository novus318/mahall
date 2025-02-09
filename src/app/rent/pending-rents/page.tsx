'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import UpdatePartialRentCollection from '@/components/UpdatePartialRentCollection';
import UpdateRentCollection from '@/components/UpdateRentCollection';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeftCircle } from 'lucide-react';
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
    contractId: string;
    roomId: string;
    buildingId: string;
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

    const handleSendReminder = async (collection: RentCollection, index: number) => {
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
            collection.amount.toString().includes(searchTerm) ||
            collection.tenantNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Skeleton className="w-12 h-12 rounded-full" />
            </div>
        )
    }

    return (
        <div className='p-2'>
            <div className='max-w-7xl mx-auto'>
                <div className="mb-6 flex justify-between items-center">
                    <Link href={`/rent`} className='flex gap-2 items-center bg-gray-900 text-white rounded-lg py-2 px-3 text-sm hover:bg-gray-700 transition-colors'>
                        <ArrowLeftCircle /> Back
                    </Link>
                </div>
                <div className="p-1 bg-white rounded-lg shadow-sm">
                    <h1 className="text-2xl font-semibold mb-6">Pending Rent Collections</h1>
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-6 w-full max-w-md rounded-lg"
                    />
                    <Suspense fallback={<Skeleton className="w-full h-12" />}>
                        <Table className="w-full">
                            <TableHeader className='bg-primary/10'>
                                <TableRow>
                                    <TableHead className="font-semibold">Building Name</TableHead>
                                    <TableHead className="font-semibold">Room Number</TableHead>
                                    <TableHead className="font-semibold">Shop</TableHead>
                                    <TableHead className="font-semibold">Tenant Name</TableHead>
                                    <TableHead className="font-semibold">Number</TableHead>
                                    <TableHead className="font-semibold">Period</TableHead>
                                    <TableHead className="font-semibold">Amount</TableHead>
                                    <TableHead className="font-semibold">Paid Amount</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCollections.map((collection: any, index) => (
                                    <>
                                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                            <TableCell>{collection.buildingName}</TableCell>
                                            <TableCell>{collection.roomNumber}</TableCell>
                                            <TableCell>{collection.shop}</TableCell>
                                            <TableCell>{collection.tenantName}</TableCell>
                                            <TableCell>{collection.tenantNumber}</TableCell>
                                            <TableCell>{collection.period}</TableCell>
                                            <TableCell>
                                                {collection.PaymentAmount && collection.PaymentAmount > 0
                                                    ? collection.PaymentAmount
                                                    : collection?.amount}
                                            </TableCell>
                                            <TableCell>
                                                {collection?.status === 'Partial' ?
                                                    (
                                                        <>
                                                            <Progress
                                                                value={(collection?.paidAmount! / collection.PaymentAmount) * 100}
                                                                className="h-2 rounded-lg"
                                                            />
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Paid: ₹{collection?.paidAmount?.toFixed(2)}
                                                            </div>
                                                        </>
                                                    ) :
                                                    collection?.paidAmount}
                                            </TableCell>
                                            <TableCell>
                                                {collection?.status === 'Pending' ? (
                                                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                                ) : collection?.status === 'Rejected' ? (
                                                    <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                                                ) : collection?.status === 'Partial' ? (
                                                    <Badge className="bg-blue-100 text-blue-800">Partial</Badge>
                                                ) : (
                                                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className='gap-2 flex'>
                                                {collection.status === 'Pending' && <UpdateRentCollection selectedCollection={collection} fetchPendingCollections={fetchPendingCollections} bank={bank} />}
                                                {collection.status === 'Partial' && <UpdatePartialRentCollection selectedCollection={collection} fetchPendingCollections={fetchPendingCollections} bank={bank} />}
                                                <Button
                                                    onClick={() => handleSendReminder(collection, index)}
                                                    size='sm'
                                                    disabled={sendingLoading[index]}
                                                    className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                                                >
                                                    {sendingLoading[index] ? 'Sending...' : 'Remind'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {collection?.partialPayments?.length > 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="py-3">
                                                    <div className="pl-6 space-y-2">
                                                        {collection?.partialPayments.map((payment: any, index: number) => (
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
                                    </>
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