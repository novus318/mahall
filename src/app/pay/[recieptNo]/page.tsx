'use client'
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
    const [amountToPay, setAmountToPay] = useState<any>(null);
    const { recieptNo } = params;

    useEffect(() => {
        const fetchTuitionFee = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/razorpay/house-collection/${recieptNo}`);
                if (response.data.success) {
                    setCollection(response.data.houseCollection);
                    if (response.data.houseCollection.paymentType === 'yearly') {
                        setAmountToPay(response.data.houseCollection.amount - response.data.houseCollection.paidAmount);
                    } else {
                        setAmountToPay(response.data.houseCollection.amount);
                    }
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
        if (collection.paymentType === 'yearly' && (collection.paidAmount + Number(amountToPay)) > collection.totalAmount) {
            setPaying(false);
            toast({
                title: 'Payment Error',
                description: 'The payment amount exceeds the total amount due.',
                variant: 'destructive',
            });
            return; // Stop further execution
        }
        setPaying(true);
        try {
            await loadRazorpayScript();

            const { data } = await axios.post(`${apiUrl}/api/razorpay/create-order`, {
                amount: Number(amountToPay) * 100,
                receipt: collection.receiptNumber,
            });

            const { id: order_id, currency } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: Number(amountToPay) * 100,
                currency,
                name: 'Tution fees',
                description: collection.description,
                order_id,
                handler: async (response: any) => {
                    toast({
                        title: 'Payment Initiated',
                        description: 'Your payment is being processed. You will be notified once it is completed.',
                        variant: 'default',
                    });
                    window.location.href = `/payment-reciept/${collection?.memberId?._id}`
                },
                prefill: {
                    name: collection.memberId?.name || 'Anonymous',
                    contact: collection.memberId?.whatsappNumber || 'Anonymous',
                },
                theme: {
                    color: '#3399cc',
                },
                modal: {
                    ondismiss: () => {
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
                            <span className="font-semibold">Total Amount:</span> ₹{collection.amount}
                        </p>
                        {collection.paymentType === 'yearly' && (
                            <>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Paid Amount:</span> ₹{collection.paidAmount}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Amount Due:</span> ₹{collection.amount - collection.paidAmount}
                                </p>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Amount to Pay</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={amountToPay }
                                        onChange={(e:any) => setAmountToPay(e.target.value)}
                                        min="0"
                                        max={collection.amount - collection.paidAmount}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-6">
                   {collection.status === 'Partial' || collection.status === 'Unpaid' ? 
                        <Button
                        className="w-full"
                        onClick={handlePayment}
                        disabled={paying || (collection.paymentType === 'yearly' && amountToPay <= 0)}
                    >
                        {paying ? <Loader2 className='animate-spin' /> : 'Pay Now'}
                    </Button>:
                    <Button
                        className="w-full"
                        disabled
                    >{collection?.status}</Button>
                   }
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageComponent;