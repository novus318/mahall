'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface PageComponentProps {
    params: {
        buildingId: string;
        roomId: string;
        contractId: string;
        rentId: string;
    };
}

interface Tenant {
    name: string;
    number: string;
}

interface Collection {
    period: string;
    date: string;
    amount: number;
    paidAmount: number;
    status: string;
    advanceDeduction?: number;
    description?: string;
}

const PageComponent: React.FC<PageComponentProps> = ({ params }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [amountToPay, setAmountToPay] = useState<number>(0);

    const { buildingId, roomId, contractId, rentId } = params;

    const fetchRent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrl}/api/razorpay/rent-collection/${buildingId}/${roomId}/${contractId}/${rentId}`
            );
            if (response.data.success) {
                setCollection(response.data.rentCollection);
                setAmountToPay(response.data.rentCollection.amount - response.data.rentCollection.paidAmount);
                setTenant(response.data.tenant);
            } else {
                toast({
                    title: 'Data Fetch Error',
                    description: 'Failed to fetch collection details.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error Fetching Data',
                description: error.response?.data?.message || 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRent();
    }, [buildingId, roomId, contractId, rentId]);

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                resolve(true); // Already loaded
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Failed to load Razorpay script'));
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!collection || !tenant) return;

        setPaying(true);
        try {
            await loadRazorpayScript();

            const { data } = await axios.post(`${apiUrl}/api/razorpay/create-rent-order`, {
                amount: amountToPay * 100, // Convert to paisa
                receipt: collection.period,
                buildingId,
                roomId,
                contractId,
                rentId,
            });

            const { id: order_id, currency } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amountToPay * 100,
                currency,
                name: 'Rent Collection',
                description: collection.description || 'Rent Payment',
                order_id,
                handler: async (response: any) => {
                    toast({
                        title: 'Payment Initiated',
                        description: 'Your payment is being processed. You will be notified once it is completed.',
                        variant: 'default',
                    });
                    window.location.href = `/rent-reciept/${buildingId}/${roomId}/${contractId}`;
                },
                prefill: {
                    name: tenant.name || 'Anonymous',
                    contact: tenant.number || 'Anonymous',
                },
                theme: {
                    color: '#3399cc',
                },
                modal: {
                    ondismiss: () => {
                        fetchRent();
                        setPaying(false);
                        toast({
                            title: 'Payment Cancelled',
                            description: 'You closed the payment window without completing the payment.',
                            variant: 'destructive',
                        });
                    },
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.on('payment.failed', (response: any) => {
                fetchRent();
                setPaying(false);
                toast({
                    title: 'Payment Failed',
                    description: response.error.description,
                    variant: 'destructive',
                });
            });
            razorpay.open();
        } catch (error: any) {
            fetchRent();
            setPaying(false);
            toast({
                title: 'Payment Initialization Failed',
                description: error.message || 'Something went wrong',
                variant: 'destructive',
            });
        }
    };

    if (!buildingId || !roomId || !contractId || !rentId) {
        return <h1>Page not found</h1>;
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h1 className="font-bold text-lg my-4">Complete Your Payment</h1>
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">Payment Details</h2>
                <p className="font-bold text-muted-foreground">Month: {collection?.period}</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Date:</span>{' '}
                            {new Date(collection?.date || '').toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Name:</span> {tenant?.name}
                        </p>
                        {collection?.advanceDeduction && collection.advanceDeduction > 0 ? (
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">Advance Deduction:</span> ₹{collection.advanceDeduction}
                            </p>
                        ) : null}
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Amount:</span> ₹{collection?.amount}
                        </p>
                        {collection?.status === 'Paid' ? (
                            <p className="text-sm text-green-600 font-bold mt-2">Payment Status: Paid</p>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Paid Amount:</span> ₹{collection?.paidAmount}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Amount Due:</span> ₹{collection ? collection.amount - collection.paidAmount : 0}
                                </p>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Amount to Pay</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={amountToPay}
                                        onChange={(e) => setAmountToPay(Number(e.target.value))}
                                        min="0"
                                        max={collection ? collection.amount - collection.paidAmount : 0}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-6">
                        <Button
                            className="w-full"
                            onClick={handlePayment}
                            disabled={paying || collection?.status === 'Paid'}
                        >
                            {paying ? (
                                <Loader2 className="animate-spin" />
                            ) : collection?.status === 'Paid' ? (
                                'Payment Completed'
                            ) : (
                                'Pay Now'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageComponent;