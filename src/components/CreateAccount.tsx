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
        balance: '',
        accountType: ''
    });

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'balance' ? Number(value) : value,
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
        if(!formData.name){
            toast({
                title: "Name is required",
                variant: "destructive",
            });
            return;
        }

        if (formData.balance === '' || isNaN(Number(formData.balance))) {
            toast({
                title: "Balance must be a number and cannot be empty",
                variant: "destructive",
            });
            return;
        }
        if (Number(formData.balance) < 0) {
            toast({
                title: "Balance cannot be negative",
                variant: "destructive",
            });
            return;
        }
        if(!formData.accountType){
            toast({
                title: "Account type is required",
                variant: "destructive",
            });
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/account/create`, formData);
            if (response.data.success) {
                fetchAccounts();
                setIsOpen(false);
                setFormData({
                    name: '',
                    holderName: '',
                    accountNumber: '',
                    ifscCode: '',
                    balance: '',
                    accountType: ''
                });
                setLoading(false);
            }
        } catch(error:any) {
            setLoading(false);
            toast({
                title: "Error creating account",
                description: error?.response?.data?.message || error.message || 'something went wrong',
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
                       Cash or Bank Name
                    </Label>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Cash or Bank Name"
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
                        type="number"
                        name="balance"
                        placeholder="Balance"
                        value={formData.balance}
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
              <div className='mt-12'>
              {loading ? (
                    <Button disabled>
                        <Loader2 className='animate-spin' />
                    </Button>
                ) : (
                    <Button disabled={loading} onClick={handleSubmit}>
                        Create
                    </Button>
                )}
              </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateAccount;
