'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { Label } from './ui/label'

const CreateAccount = ({fetchAccounts}:any) => {
    const { toast } = useToast()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        holderName: '',
        accountNumber: '',
        ifscCode: '',
        balance: 0,
        accountType: ''
    });

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value:any) => {
        setFormData(prev => ({
            ...prev,
            accountType: value,
            accountNumber: '',
            ifscCode: ''
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try{
            const response = await axios.post(`${apiUrl}/api/account/create`,formData)
            if(response.data.success){
                fetchAccounts()
                setIsOpen(false)
                setFormData({
                    name: '',
                    holderName: '',
                    accountNumber: '',
                    ifscCode: '',
                    balance: 0,
                    accountType: ''
                })
                setLoading(false)
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
                    Create Account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Create New Account
                </DialogTitle>
                <div>
                    <Label>
                       Account Name
                    </Label>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Account Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </div>
                <div>
                <Label>
                       Account Holder name
                    </Label>
                    <Input
                        type="text"
                        name="holderName"
                        placeholder="Account Holder Name"
                        value={formData.holderName}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </div>
                <div>
                <Label>
                       Account Open balance
                    </Label>
                    <Input
                        type="text"
                        name="balance"
                        placeholder="Balance"
                        value={formData.balance ===0 ? '': formData.balance}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </div>
                <div>
                    <Select
                        value={formData.accountType}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Account type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='bank'>Bank</SelectItem>
                            <SelectItem value='cash'>Cash</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.accountType === 'bank' && (
                    <>
                        <div>
                            <Input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="ifscCode"
                                placeholder="IFSC Code"
                                value={formData.ifscCode}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
                {loading ? (
                    <Button disabled>
                        <Loader2 className='animate-spin' />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit}>
                        Create
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default CreateAccount;
