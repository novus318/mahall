'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PageComponent = ({ params }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [tenant, setTenant] = useState<any>({});
    const [collection, setCollection] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const { buildingId,roomId,contractId,rentId } = params;

    const fetchRent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/razorpay/rent-collection/${buildingId}/${roomId}/${contractId}/${rentId}`);
            if (response.data.success) {
                setCollection(response.data.rentCollection);
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
    }, []);

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
        setPaying(true);
        try {
            await loadRazorpayScript();

            const { data } = await axios.post(`${apiUrl}/api/razorpay/create-rent-order`, {
                amount: collection.amount * 100, // Convert to paisa
                receipt: collection?.period,
                buildingId:buildingId,
                roomId:roomId,
                contractId:contractId,
                rentId:rentId
            });

            const { id: order_id, currency } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: collection.amount * 100,
                currency,
                name: 'Rent collection',
                description: collection.description,
                order_id,
                handler: async (response: any) => {
                    try {
                        const verifyResponse = await axios.post(`${apiUrl}/api/razorpay/verify/rentpayment`, {
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            buildingId:buildingId,
                            roomId:roomId,
                            contractId:contractId,
                            rentId:rentId
                        });

                        if (verifyResponse.data.success) {
                            toast({
                                title: 'Payment Successful',
                                description: 'Your payment has been processed successfully.',
                                variant: 'default',
                            });
                            window.location.href = `/rent-reciept/${buildingId}/${roomId}/${contractId}`
                        }
                    } catch (error: any) {
                        fetchRent()
                        setPaying(false);
                        toast({
                            title: 'Payment Failed',
                            description: error.response?.data?.message || 'Verification failed',
                            variant: 'destructive',
                        });
                    }
                },
                prefill: {
                    name: tenant?.name || 'Anonymous',
                    contact: tenant?.number || 'Anonymous',
                },
                theme: {
                    color: '#3399cc',
                },
                modal: {
                    ondismiss: () => {
                        fetchRent()
                        setPaying(false);
                        toast({
                            title: 'Payment Cancelled try again.',
                            description: 'You closed the payment window without completing the payment.',
                            variant: 'destructive',
                        });
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', (response: any) => {
                fetchRent()
                setPaying(false);
                toast({
                    title: 'Payment Failed',
                    description: response.error.description,
                    variant: 'destructive',
                });
            });
            razorpay.open();
        } catch (error: any) {
            fetchRent()
            setPaying(false);
            toast({
                title: 'Payment Initialization Failed',
                description: error.message || 'Something went wrong',
                variant: 'destructive',
            });
        }
    };

    if (!buildingId && !roomId && !contractId && !rentId) {
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
                        {new Date(collection.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Name:</span> {tenant?.name}
                    </p>
                    {collection?.advanceDeduction > 0 ? (
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Advance Deduction:</span> {collection?.advanceDeduction}
                        </p>
                    ) : null}
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Amount:</span> ₹{collection.amount}
                    </p>
                    {collection?.status === "Paid" && (
                        <p className="text-sm text-green-600 font-bold mt-2">
                            Payment Status: Paid
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <Button
                        className="w-full"
                        onClick={handlePayment}
                        disabled={paying || collection?.status === "Paid"}
                    >
                        {paying ? <Loader2 className="animate-spin" /> : collection?.status === "Paid" ? 'Payment Completed' : 'Pay Now'}
                    </Button>
                </div>
            </div>
        )}
    </div>
    
    );
};

export default PageComponent;
