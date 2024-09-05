'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { FilePenIcon, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { Label } from './ui/label'

const EditStaff = ({staff,fetchStaffDetails}:any) => {
    const { toast } = useToast()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: staff?.name,
        age: staff?.age,
        employeeId: staff?.employeeId,
        department: staff?.department,
        position: staff?.position,
        salary: staff?.salary,
        contactInfo: {
            phone: staff?.contactInfo?.phone,
            email: staff?.contactInfo?.email,
            address: staff?.contactInfo?.address
        }
    })
    const [isOpen, setIsOpen] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        if (name.includes('contactInfo.')) {
            const key = name.split('.')[1]; // Get the nested field name (phone, email, address)
            setFormData(prevState => ({
                ...prevState,
                contactInfo: {
                    ...prevState.contactInfo,
                    [key]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.put(`${apiUrl}/api/staff/edit/${staff._id}`, formData); 
            if (response.data.success) {
                toast(
                  {  title: 'Staff updated successfully',
                    variant:'default',}
                );
                setIsOpen(false);
                fetchStaffDetails()
                setLoading(false);
            } 
        } catch (error:any) {
            setLoading(false);
            toast({
                title: 'Failed to add staff',
                description: error.response?.data?.message || error.message || 'something went wrong',
                variant: 'destructive',
            })
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
                    Edit Staff
                </DialogTitle>
                <div>
                        <Label>
                            Name
                        </Label>
                        <Input
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='Name'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Label>
                            Age
                        </Label>
                        <Input
                            type='text'
                            name='age'
                            value={formData.age === 0 ?'' : formData?.age}
                            onChange={handleChange}
                            placeholder='Age'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Label>
                            Department
                        </Label>
                        <Input
                            name='department'
                            value={formData.department}
                            onChange={handleChange}
                            placeholder='Department'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Label>
                            Position
                        </Label>
                        <Input
                            name='position'
                            value={formData.position}
                            onChange={handleChange}
                            placeholder='Position'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Label>
                            Salary
                        </Label>
                        <Input
                            type='text'
                            name='salary'
                            value={formData.salary ===0 ? '': formData?.salary}
                            onChange={handleChange}
                            placeholder='Salary'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Input
                            name='contactInfo.phone'
                            value={formData.contactInfo.phone}
                            onChange={handleChange}
                            placeholder='Phone'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Input
                            name='contactInfo.email'
                            value={formData.contactInfo.email}
                            onChange={handleChange}
                            placeholder='Email'
                            className='w-full'
                        />
                    </div>
                    <div>
                        <Input
                            name='contactInfo.address'
                            value={formData.contactInfo.address}
                            onChange={handleChange}
                            placeholder='Address'
                            className='w-full'
                        />
                    </div>
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
            </DialogContent>
        </Dialog>
    );
}

export default EditStaff