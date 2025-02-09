'use client';

import { Card, CardContent } from '@/components/ui/card';
import { withAuth } from '@/components/withAuth';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/DatePicker';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

interface PageProps {
    params: {
        pid: string;
        roomId: string;
    };
}

const PageComponent = ({ params }: PageProps) => {
    const { pid, roomId } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { toast } = useToast()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState({
        fromDate: '',
        toDate: '',
        rent: null,
        shop:'',
        deposit: null,
        tenant: {
            name: '',
            aadhaar: '',
            place: '',
            number: '',
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (['name', 'aadhaar', 'place', 'number'].includes(name)) {
            setContract((prevState) => ({
                ...prevState,
                tenant: {
                    ...prevState.tenant,
                    [name]: value,
                },
            }));
        } else {
            setContract((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleDateChange = (date: any, type: 'fromDate' | 'toDate') => {
        setContract((prevState) => ({
            ...prevState,
            [type]: date,
        }));
    };


    const validate = () => {
        let isValid = true;
        if (!contract.fromDate) {
            toast({
                title: 'From Date is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!contract.toDate) {
            toast({
                title: 'To Date is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (contract.fromDate > contract.toDate) {
            toast({
                title: 'From Date should be less than To Date',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!contract.rent || contract.rent <= 0) {
            toast({
                title: 'Rent should be greater than 0',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!contract.tenant.name || contract.tenant.name.trim() === '') {
            toast({
                title: 'Tenant Name is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!contract.tenant.aadhaar || contract.tenant.aadhaar.trim() === '') {
            toast({
                title: 'Adhar Number is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!contract.tenant.place || contract.tenant.place.trim() === '') {
            toast({
                title: 'Tenant Place  is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!contract.tenant.number || contract.tenant.number.trim() === '') {
            toast({
                title: 'Tenant Contact Number is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        return isValid;
    };
    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const data = {
                from: contract.fromDate,
                to: contract.toDate,
                tenant: contract.tenant,
                rent: contract.rent,
                shop:contract.shop,
                deposit: contract.deposit,
            }
            const response = await axios.post(`${apiUrl}/api/rent/add-contract/${pid}/${roomId}`, data);
            if (response.data.success) {
                toast({
                    title: 'Contract created successfully',
                    variant: 'default',
                });
                setContract({
                    fromDate: '',
                    toDate: '',
                    rent: null,
                   shop:'',
                    deposit: null,
                    tenant: {
                        name: '',
                        aadhaar: '',
                        place: '',
                        number: '',
                    },
                });
                router.push(`/rent`);
            } 
        } catch (error:any)   {
            toast({
                title: 'Error creating contract',
                description: error.response?.data?.message || error.message || 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mt-2 bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                    <Link href={`/rent/room-details/${pid}/${roomId}/${roomId}`} className="bg-gray-900 text-white rounded-sm py-2 px-3 text-sm">
                        Back
                    </Link>
                </div>
            </div>
            <div className='mx-auto p-4 bg-white rounded-md border my-8 max-w-5xl'>
                <h2 className='text-2xl font-semibold mb-4'>Create Contract</h2>
                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <p className='text-sm font-medium'>From Date</p>
                            <DatePicker date={contract.fromDate} setDate={(date: any) => handleDateChange(date, 'fromDate')} />
                        </div>
                        <div>
                            <p className='text-sm font-medium'>To Date</p>
                            <DatePicker date={contract.toDate} setDate={(date: any) => handleDateChange(date, 'toDate')} />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>
                                Rent
                            </Label>
                            <Input
                                type='number'
                                name='rent'
                                value={contract.rent||''}
                                placeholder='Rent Amount'
                                onChange={handleChange}
                                className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                            />
                        </div>
                        <div>
                            <Label>
                                Deposit
                            </Label>
                            <Input
                                type='number'
                                name='deposit'
                                value={contract.deposit||''}
                                placeholder='Deposit Amount'
                                onChange={handleChange}
                                className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                            />
                        </div>
                    </div>
                    <div>
                            <Label>
                                Shop name
                            </Label>
                            <Input
                                type='text'
                                name='shop'
                                value={contract.shop}
                                placeholder='Shop Name'
                                onChange={handleChange}
                                className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                            />
                        </div>
                    <h2 className='text-2xl font-semibold mb-4'>Tenant Details</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        <Input
                            type='text'
                            name='name'
                            value={contract.tenant.name}
                            placeholder='Name'
                            onChange={handleChange}
                            className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                        />
                        <Input
                            type='text'
                            name='aadhaar'
                            value={contract.tenant.aadhaar}
                            placeholder='Aadhar Number'
                            onChange={handleChange}
                            className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <Input
                            type='text'
                            name='place'
                            value={contract.tenant.place}
                            placeholder='Place'
                            onChange={handleChange}
                            className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                        />
                        <Input
                            type='tel'
                            name='number'
                            value={contract.tenant.number}
                            placeholder='Phone Number'
                            onChange={handleChange}
                            className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                        />
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Contract'}
                    </Button>
                </div>
            </div>
        </>
    );
};

const Page = withAuth(({ params }: any) => (
    <PageComponent params={params} />
));

export default Page;
