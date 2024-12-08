'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PageComponent = ({ params }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [collection, setCollection] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const { recieptNo } = params;

    useEffect(() => {
        const fetchTuitionFee = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/razorpay/house-collection/${recieptNo}`);
                if (response.data.success) {
                    setCollection(response.data.houseCollection);
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

        fetchTuitionFee();
    }, [recieptNo, apiUrl]);

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

            const { data } = await axios.post(`${apiUrl}/api/razorpay/create-order`, {
                amount: collection.amount * 100, // Convert to paisa
                receipt: collection.receiptNumber,
            });

            const { id: order_id, currency } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: collection.amount * 100,
                currency,
                name: 'Tution fees',
                description: collection.description,
                order_id,
                handler: async (response: any) => {
                    try {
                        const verifyResponse = await axios.post(`${apiUrl}/api/razorpay/verify-payment`, {
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            recieptNumber:recieptNo
                        });

                        if (verifyResponse.data.success) {
                            toast({
                                title: 'Payment Successful',
                                description: 'Your payment has been processed successfully.',
                                variant: 'default',
                            });
                            window.location.href = `/payment-reciept/${verifyResponse.data.updatedCollection.memberId._id}`
                        }
                    } catch (error: any) {
                        setPaying(false);
                        toast({
                            title: 'Payment Failed',
                            description: error.response?.data?.message || 'Verification failed',
                            variant: 'destructive',
                        });
                    }
                },
                prefill: {
                    name: collection.memberId?.name || 'Anonymous',
                    contact: '',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', (response: any) => {
                setPaying(false);
                toast({
                    title: 'Payment Failed',
                    description: response.error.description,
                    variant: 'destructive',
                });
            });
            razorpay.open();
        } catch (error: any) {
            setPaying(false);
            toast({
                title: 'Payment Initialization Failed',
                description: error.message || 'Something went wrong',
                variant: 'destructive',
            });
        }
    };

    if (!recieptNo) {
        return <h1>Page not found</h1>;
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h1 className="font-bold text-lg my-4">Complete Your Payment</h1>
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">Payment Details</h2>
                <p className="font-bold text-muted-foreground">Receipt No. {recieptNo}</p>
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
                            <span className="font-semibold">Description:</span> {collection.description}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Amount:</span> ₹{collection.amount}
                        </p>
                    </div>
                    <div className="mt-6">
                        <Button
                            className="w-full"
                            onClick={handlePayment}
                            disabled={paying}
                        >
                            {paying ? <Loader2 className='animate-spin'/> : 'Pay Now'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageComponent;
