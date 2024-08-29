'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { Label } from './ui/label'

const CreateRecCategory = ({fetchCategories}:any) => {
    const { toast } = useToast()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if(!formData.name){
            toast({
                title: "Name is required",
                variant: "destructive",
            });
            return;
        }
        if(!formData.description){
            toast({
                title: "Description is required",
                variant: "destructive",
            });
            return;
        }
        setLoading(true);
        try{
            const response = await axios.post(`${apiUrl}/api/reciept/createReciept/category`,formData)
            if(response.data.success){
                setIsOpen(false)
                setFormData({
                    name: '',
                    description: ''
                })
                setLoading(false)
                toast({
                    title: "Category created successfully",
                    variant: "default",
                });
                fetchCategories()
            }       
        }catch{
            setLoading(false)
            toast({
                title: "Error creating account",
                variant: "destructive",
            });
        }
    };


  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
    <DialogTrigger asChild>
        <Button size='sm'>
            Create category
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogTitle>
            Create Reciept category
        </DialogTitle>
        <div>
            <Label>
               Name
            </Label>
            <Input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
            />
        </div>
        <div>
        <Label>
               Description
            </Label>
            <Input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
            />
        </div>
       
        {loading ? (
            <Button disabled>
                <Loader2 className='animate-spin' />
            </Button>
        ) : (
            <Button
            disabled={loading} onClick={handleSubmit}>
                Create
            </Button>
        )}
    </DialogContent>
</Dialog>
  )
}

export default CreateRecCategory
