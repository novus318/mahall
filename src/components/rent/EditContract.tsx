import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { FilePenIcon, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import axios from 'axios'
import DatePicker from '../DatePicker'
import { Label } from '../ui/label'
import { format } from 'date-fns'

const EditContract = ({ buildingID, roomId, fetchRoomDetails, contractDetails }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { toast } = useToast()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [contract, setContract] = useState({
        fromDate: contractDetails?.from,
        toDate: contractDetails?.to,
        rent: contractDetails?.rent,
        shop: contractDetails?.shop,
        tenant: {
            name: contractDetails?.tenant?.name,
            aadhaar: contractDetails?.tenant?.aadhaar,
            place: contractDetails?.tenant?.place,
            number: contractDetails?.tenant?.number,
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
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const data = {
                from: contract.fromDate,
                to: contract.toDate,
                tenant: contract.tenant,
                rent: contract.rent,
                shop: contract.shop,
            }
            const response = await axios.put(`${apiUrl}/api/rent/edit-contract/${buildingID}/${roomId}/${contractDetails._id}`, data);
            if (response.data.success) {
                toast({
                    title: 'Contract edited successfully',
                    variant: 'default',
                });
                setIsOpen(false);
                fetchRoomDetails()
            }
        } catch (error: any) {
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
        <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            <DialogTrigger asChild>
                <Button
                    size='sm' variant="outline">
                    <FilePenIcon className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Edit Contract
                </DialogTitle>
                <div>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <p className='text-sm font-medium'>From Date</p>
                                <DatePicker disabled date={contract.fromDate} setDate={(date: any) => handleDateChange(date, 'fromDate')} />
                            </div>
                            <div>
                                <p className='text-sm font-medium'>To Date:</p>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded-md p-2 text-sm w-full"
                                    value={contract.toDate ? format(new Date(contract.toDate), 'yyyy-MM-dd') : ''}
                                    onChange={(e) => handleDateChange(e.target.value, 'toDate')}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <Label>
                                    Rent
                                </Label>
                                <Input
                                    type='number'
                                    name='rent'
                                    value={contract.rent || ''}
                                    placeholder='Rent Amount'
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
                    </div>
                </div>
                <div>
                    {loading ? (
                        <Button disabled>
                            <Loader2 className='animate-spin' />
                        </Button>
                    ) : (
                        <Button
                            disabled={loading}
                            onClick={handleSubmit}>
                            Update
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditContract
