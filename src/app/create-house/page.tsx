'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useHouseContext } from '@/context/HouseContext'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from '@/components/DatePicker'
import { useToast } from '@/components/ui/use-toast'
import Spinner from '@/components/Spinner'
import { useRouter } from 'next/navigation'


interface Member {
    name: string
    status: string,
    DOB: Date,
    maritalStatus: string
    education: string,
    gender: string,
    mobile: string,
    place:string
}

const Page = () => {
    const { toast } = useToast()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [houseName, setHouseName] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [rationstatus, setRationStatus] = useState<string>('');
    const [houseAddress, setHouseAddress] = useState<string>('');
    const [collection, setCollection] = useState<number>(0);
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const [newMember, setNewMember] = useState<Member>({
        name: '',
        status: '',
        DOB: new Date(),
        maritalStatus: '',
        gender: '',
        education: '',
        mobile: '',
        place:''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewMember((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: any) => {
        setNewMember((prev) => ({ ...prev, DOB: date }));
    };

    const validate = () => {
        const currentYear = new Date().getFullYear();
const dobYear = new Date(newMember.DOB).getFullYear();
        let isValid = true;
        if (!houseNumber) {
            toast({
                title: "House Number is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!houseName) {
            toast({
                title: "House Name is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!houseAddress) {
            toast({
                title: "House Address is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!status) {
            toast({
                title: "Please select status",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!rationstatus) {
            toast({
                title: "Please enter ration status",
                variant: "destructive",
            });
            isValid = false;
        }
        if(!collection && collection < 1){
            toast({
                title: "Please enter valid collection Amount",
                variant: "destructive",
            });
            isValid = false;
        }
        if(!newMember.name){
            toast({
                title: "Please Fill Family head Name",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!newMember.status) {
            toast({
                title: "Please fill current ocupation",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!newMember.maritalStatus) {
            toast({
                title: "Please fill marital status",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!newMember.gender) {
            toast({
                title: "Please fill gender",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!newMember.education) {
            toast({
                title: "Please fill education if there else NILL",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!newMember.DOB || dobYear === currentYear) {
            toast({
                title: "Please enter a valid Date of Birth",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!newMember.place) {
            toast({
                title: "Please select place",
                variant: "destructive",
                });
        }
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setloading(true);
        try {
            const newHouse = {
                number: houseNumber,
                name: houseName,
                address: houseAddress,
                status: status,
                rationsStatus: rationstatus,
                collectionAmount: collection,
            };
            const data = {
                newHouse,
                newMember
            };

            // Send POST request to create a new house
            const response = await axios.post(`${apiUrl}/api/house/create-house`, data);

            if (response.data.success) {
                toast({
                    title: "House created successfully",
                    variant: "default",
                });
                setHouseNumber('');
                setHouseName('');
                setHouseAddress('');
                setCollection(0);
                setNewMember(
                    {
                        name: '',
                        status: '',
                        DOB: new Date(),
                        maritalStatus: '',
                        gender: '',
                        education: '',
                        mobile: '',
                        place:''
                    })
                    setloading(false);
                    router.push('/house');
            }
        } catch (error:any) {
            toast({
                title: "Error creating house",
                description: error?.response?.data?.message || error.message,
                variant: "destructive",
            });
            setloading(false);
        }
    };

    return (
       <>
       {loading ? (
<Spinner/>
       ):
       ( <div className='p-2'>
        <div className='max-w-5xl mx-auto'>
            <div className="mb-4 flex justify-between items-center">
                <Link href={`/house`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                    Back
                </Link>
            </div>

            <div className='mx-auto p-4 bg-white rounded-md border my-8'>
                <h2 className='text-2xl font-semibold mb-4'>Add New House</h2>
                <div className='space-y-4 mb-2'>
                    <div>
                        <Input
                            type="text"
                            placeholder="House Number"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="House Name"
                            value={houseName}
                            onChange={(e) => setHouseName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Textarea
                            placeholder="Address"
                            value={houseAddress}
                            onChange={(e) => setHouseAddress(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                    <Select
                name='status'
                onValueChange={(value) => 
                    setStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='rented'>
                    Rented
                  </SelectItem>
                  <SelectItem value='owned'>
                  Owned
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                            type="text"
                            placeholder="Ration status"
                            value={rationstatus}
                            onChange={(e) => setRationStatus(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder="Collection amount"
                            value={collection}
                            onChange={(e) => setCollection(Number(e.target.value))}
                            disabled={loading}
                        />
                    </div>
                </div>
                <h2 className='text-xl font-semibold mb-4'>Add Family Head</h2>
                <div className='space-y-4'>
                    <div>
                        <Input
                            type='text'
                            name='name'
                            placeholder='Enter name'
                            value={newMember.name}
                            onChange={handleChange}
                            className='block w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <Input
                            type='text'
                            name='status'
                            placeholder='Current occupation'
                            value={newMember.status}
                            onChange={handleChange}
                            className='block w-full border px-2 py-4 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                        <Select
                            name='gender'
                            onValueChange={(value) => setNewMember((prev) => ({ ...prev, gender: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='male'>male</SelectItem>
                                <SelectItem value='female'>female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid grid-cols-2 gap-1'>
                        <div>
                            <p className='text-sm font-medium'>Date of birth</p>
                            <DatePicker date={newMember.DOB} setDate={handleDateChange} />
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Marital status</p>
                            <Select
                                name='maritalStatus'
                                onValueChange={(value) => setNewMember((prev) => ({ ...prev, maritalStatus: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='married'>married</SelectItem>
                                    <SelectItem value='unmarried'>unmarried</SelectItem>
                                    <SelectItem value='divorced'>divorced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Input
                            type='text'
                            name='education'
                            placeholder='Enter education'
                            value={newMember.education}
                            onChange={handleChange}
                            className='block w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <div>
                        <Input
                            type='tel'
                            name='mobile'
                            placeholder='Enter mobile number'
                            value={newMember.mobile}
                            onChange={handleChange}
                            className='block w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <div>
                    <Select
                name='place'
                onValueChange={(value) => setNewMember((prev) => ({ ...prev, place: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Place" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='house'>
                   House
                  </SelectItem>
                  <SelectItem value='UAE'>
                    UAE
                  </SelectItem>
                  <SelectItem value='Malaysia'>
                  Malaysia
                  </SelectItem>
                  <SelectItem value='Singapore'>
                  Singapore
                  </SelectItem>
                  <SelectItem value='Local'>
                  Local
                  </SelectItem>
                </SelectContent>
              </Select>
                    </div>
                </div>
                <div className='mt-4'>
                        <Button onClick={handleSubmit}>Create House</Button>
                </div>
            </div>
        </div>
    </div>)}</>
    )
}

export default Page
