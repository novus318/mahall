'use client'
import CreatePayCategory from '@/components/CreatePayCategory'
import DatePicker from '@/components/DatePicker'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { Loader2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary: boolean;
}

interface Member {
  _id: string;
  name: string;
}
interface Item {
  description: string;
  amount: number;
}

const Page = () => {
  const [bank, setBank] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(false);
  const [payCategories, setPayCategories] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([])
  const [targetAccount, setTargetAccount] = useState<string | null>(null);
  const [otherName, setOtherName] = useState<string>(''); // Added state for other name// Added state for other number
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [items, setItems] = useState<Item[]>([{ description: '', amount: 0 }]); // Initial item
  const [total, setTotal] = useState<number>(0);
  const [date, setdate] = useState(new Date())
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentRecieptNo, setpaymentRecieptNo] = useState<any>('');

  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`).then(response => {
      setBank(response.data.data)
    })
      .catch(error => {
        console.log("Error fetching accounts:", error)
      })
  }

  const fetchPayCategories = () => {
    axios.get(`${apiUrl}/api/pay/category/all`).then(response => {
      setPayCategories(response.data.categories)
    })
      .catch(error => {
        console.log("Error fetching pay categories:", error)
      })
  }


  const PaymentRecieptNumber = () => {
    axios
      .get(`${apiUrl}/api/pay/get-payment/number`)
      .then((response) => {
        if (response.data.success) {
          setpaymentRecieptNo(response.data.paymentNumber);
        }
      })
      .catch((error) => {
        console.log('Error fetching payment number:', error);
      });
  }

  useEffect(() => {
    fetchAccounts()
    fetchPayCategories()
    PaymentRecieptNumber()
  }, [])
  useEffect(() => {
    // Calculate the total whenever items change
    const newTotal = items.reduce((acc, item) => acc + item.amount, 0);
    setTotal(newTotal);
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === 'description') {
      newItems[index].description = value as string;
    } else if (field === 'amount') {
      newItems[index].amount = parseFloat(value as string) || 0;
    }
    setItems(newItems);
  }
  const validate = () => {
    const bankAccount = bank.find(ac => ac._id === targetAccount)
    let isValid = true;
    if (!targetAccount) {
      {
        toast({
          title: 'Please select a bank account',
          variant: 'destructive',
        })
        isValid = false;
      }
    }
    if (!bankAccount || bankAccount.balance < total) {
      toast({
        title: 'Insufficient balance in selected account',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (!date) {
      toast({
        title: 'Please select a payment date',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (!targetCategory) {
      toast({
        title: 'Please select a pay category',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (!items[0].description) {
      toast({
        title: 'Please enter description for at least one item',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (!items[0].amount) {
      toast({
        title: 'Please enter valid amount',
        variant: 'destructive',
      })
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        items,
        date,
        accountId: targetAccount,
        categoryId: payCategories.find(c => c._id === targetCategory),
        paymentType: 'Cash',
        paymentTo :otherName,
        receiptNumber: paymentRecieptNo
      }
      const response = await axios.post(`${apiUrl}/api/pay/create-payment`, data)
      if (response.data.success) {
        setItems([{ description: '', amount: 0 }])
        setTargetAccount(null)
        setOtherName('')
        setTotal(0)
        setTargetCategory(null)
        setSearchQuery('')
        PaymentRecieptNumber()
        setdate(new Date())
        toast({
          title: 'Payment created successfully',
          description: 'You have created a new payment.',
          variant: 'default'
        })
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      toast({
        title: 'Failed to create payment',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive'
      })
    }
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
        <div className="flex justify-between items-center mb-4 gap-2">
          <CreatePayCategory fetchCategories={fetchPayCategories} />
          <Link href={'/payment/recent-payments'} className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'>
            Recent Payments
          </Link>
        </div>
        <div className="p-4 bg-white rounded-md border my-8 max-w-2xl mx-auto">
          <div className='flex justify-between'>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">New Payment</h2>
            <p className='font-bold text-muted-foreground'>Reciept No.{paymentRecieptNo}</p>
          </div>
          <div className="space-y-4">
            <div className="max-w-full">
              <p className="text-sm font-medium">Date</p>
              <DatePicker date={date} setDate={setdate} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <Label>Select account</Label>
                <Select value={targetAccount || 'Select target account'} onValueChange={setTargetAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bank?.map((acc) => (
                      <SelectItem key={acc._id} value={acc._id}>
                        {acc.name} - {acc.holderName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Label>Select category</Label>
                <Select value={targetCategory || 'Select category'} onValueChange={setTargetCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {payCategories?.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <Label>Payment To</Label>
                  <Input
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    placeholder="Enter name"
                  />
                  </div>
            </div>

            <div className="mt-8 space-y-2">
              <h3 className="text-lg font-medium mb-2">Items</h3>
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-center mb-2">
                  <Input
                    className="flex-1"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                  <Input
                    className="w-full md:w-32"
                    type="text"
                    placeholder="Amount"
                    value={item.amount === 0 ? '' : item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="secondary" onClick={handleAddItem}>
                <PlusCircle className='h-4' />Add Item
              </Button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold">Total: ₹{total.toFixed(2)}</h3>
            </div>

            <div className="flex justify-end mt-4">
              <Button disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 className="animate-spin" /> : 'Create'}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default withAuth(Page)
