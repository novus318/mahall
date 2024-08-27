'use client'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import DatePicker from '@/components/DatePicker';

interface Staff {
    name: string,
    age: number,
    employeeId: string,
    department: string,
    position: string,
    salary: number,
    joinDate: Date,
    contactInfo: {
        phone: string,
        email: string,
        address: string
    }
}

const Page = () => {
    const { toast } = useToast()
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [staff, setStaff] = useState<Staff>({
        name: '',
        age: 0,
        employeeId: '',
        department: '',
        position: '',
        salary: 0,
        joinDate: new Date(),
        contactInfo: {
            phone: '',
            email: '',
            address: ''
        }
    });

    const validate = () => {
        let isValid = true;
        if (!staff.name) {
            toast({
                title: 'Name is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (staff.age < 18 || staff.age > 85) {
            toast({
                title: 'Age must be between 18 and 85',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.employeeId) {
            toast({
                title: 'Employee ID is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.department) {
            toast({
                title: 'Department is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.position) {
            toast({
                title: 'Position is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (staff.salary <= 0) {
            toast({
                title: 'Salary must be greater than zero',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.joinDate) {
            toast({
                title: 'Join date is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.contactInfo.phone) {
            toast({
                title: 'Phone number is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.contactInfo.email) {
            toast({
                title: 'Email address is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        if (!staff.contactInfo.address) {
            toast({
                title: 'Address is required',
                variant: 'destructive',
            });
            isValid = false;
        }
        return isValid;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        // Check if the name includes 'contactInfo', which indicates it's a nested field
        if (name.includes('contactInfo.')) {
            const key = name.split('.')[1]; // Get the nested field name (phone, email, address)
            setStaff(prevState => ({
                ...prevState,
                contactInfo: {
                    ...prevState.contactInfo,
                    [key]: value
                }
            }));
        } else {
            setStaff(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleDateChange = (date: any) => {
        setStaff((prev) => ({ ...prev, joinDate: date }));
      };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const response = await axios.post(`${apiUrl}/api/staff/create`, staff); 
            if (response.data.success) {
                toast({
                    title: 'Staff added successfully!',
                    variant:'default',
                });
                setStaff({
                    name: '',
                    age: 0,
                    employeeId: '',
                    department: '',
                    position: '',
                    salary: 0,
                    joinDate: new Date(),
                    contactInfo: {
                        phone: '',
                        email: '',
                        address: ''
                    }
                });
                router.push('/staff');
            } 
        } catch (error) {
            // Handle error
            console.error('Error adding staff:', error);
        }
    };

    return (
        <div className='p-2'>
            <div className='max-w-5xl mx-auto'>
                <div className="mb-4 flex justify-between items-center">
                    <Link href={`/staff`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                        Back
                    </Link>
                </div>

                <div className='mx-auto p-4 bg-white rounded-md border my-8'>
                    <h2 className='text-2xl font-semibold mb-4'>Add New Staff</h2>
                    <div className='mb-4'>
                        <Label>
                            Name
                        </Label>
                        <Input
                            name='name'
                            value={staff.name}
                            onChange={handleChange}
                            placeholder='Name'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Age
                        </Label>
                        <Input
                            type='number'
                            name='age'
                            value={staff.age}
                            onChange={handleChange}
                            placeholder='Age'
                            className='w-full'
                        />
                    </div>
                    <div>
              <p className='text-sm font-medium' >
                Date of Join
              </p>
              <DatePicker date={staff.joinDate} setDate={handleDateChange} />
            </div>
                    <div className='mb-4'>
                        <Label>
                            Employee ID
                        </Label>
                        <Input
                            name='employeeId'
                            value={staff.employeeId}
                            onChange={handleChange}
                            placeholder='Employee ID'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Department
                        </Label>
                        <Input
                            name='department'
                            value={staff.department}
                            onChange={handleChange}
                            placeholder='Department'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Position
                        </Label>
                        <Input
                            name='position'
                            value={staff.position}
                            onChange={handleChange}
                            placeholder='Position'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label>
                            Salary
                        </Label>
                        <Input
                            type='text'
                            name='salary'
                            value={staff.salary}
                            onChange={handleChange}
                            placeholder='Salary'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Input
                            name='contactInfo.phone'
                            value={staff.contactInfo.phone}
                            onChange={handleChange}
                            placeholder='Phone'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Input
                            name='contactInfo.email'
                            value={staff.contactInfo.email}
                            onChange={handleChange}
                            placeholder='Email'
                            className='w-full'
                        />
                    </div>
                    <div className='mb-4'>
                        <Input
                            name='contactInfo.address'
                            value={staff.contactInfo.address}
                            onChange={handleChange}
                            placeholder='Address'
                            className='w-full'
                        />
                    </div>
                    <Button type='submit' onClick={handleSubmit}>
                        Add Staff
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Page;
