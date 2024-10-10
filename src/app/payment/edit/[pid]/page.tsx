'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { withAuth } from '@/components/withAuth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from '@/components/DatePicker';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

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
  house: { number: string };
}

interface Item {
  description: string;
  amount: number;
}

const EditPaymentPage = ({ params }: any) => {
  const { pid } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [payment, setPayment] = useState<any>(null);
  const [bank, setBank] = useState<BankAccount[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [payCategories, setPayCategories] = useState<any[]>([]);
  const [targetAccount, setTargetAccount] = useState<string | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [otherName, setOtherName] = useState<string>('');
  const [items, setItems] = useState<Item[]>([{ description: '', amount: 0 }]);
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');


  const filteredMembers = members?.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchPayment = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/pay/get-payment/${pid}`);
      if (response.data.success) {
        const paymentData = response.data.payment;
        setPayment(paymentData);
        setTargetAccount(paymentData.accountId || null);
        setTargetCategory(paymentData.categoryId?._id || null);
        setItems(paymentData.items || [{ description: '', amount: 0 }]);
        setDate(new Date(paymentData.date));
        setTotal(paymentData.total);
        setOtherName(paymentData.paymentTo)
      }
    } catch (error) {
      console.error('Error fetching payment data', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`).then(response => {
      setBank(response.data.accounts)
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

  const fetchMembers = (searchQuery: string) => {
    axios
      .get(`${apiUrl}/api/member/all/names-and-ids`, { params: { search: searchQuery } })
      .then((response) => {
        setMembers(response.data.members);
      })
      .catch((error) => {
        console.log('Error fetching members:', error);
      });
  };
  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchMembers(searchQuery);
    } else {
      setMembers([]); // Clear members list if search is empty
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchPayment();
    fetchPayCategories()
    fetchAccounts()
  }, [pid]);

  // Handle form updates
  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const calculateTotal = (updatedItems: Item[]) => {
    const newTotal = updatedItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setTotal(newTotal);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try { 
      const updatedPayment = {
        date,
        accountId: targetAccount,
        categoryId: payCategories.find(c => c._id === targetCategory),
        paymentTo:otherName,
        paymentType: 'Cash',
        items,
        total,
      };
      await axios.put(`${apiUrl}/api/pay/edit-payment/${pid}`, updatedPayment);
      router.push('/payment/recent-payments');
      setLoading(false)
    } catch (error:any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.error || error.response?.data?.message || error.message  || 'An error occurred while trying to update the payment. Please try again later.',
        variant:'destructive'
      })
      setLoading(false);
    }
  };

  if (loading) return <Skeleton className="h-96" />;

  return (
   <div className='p-2'>
     <div className="mb-2 flex justify-between items-center">
    <Link href={`/payment/recent-payments`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
      Back
    </Link>
  </div>
    <div className="p-4 bg-white rounded-md border my-8 max-w-2xl mx-auto">
      <div className='flex justify-between'>
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">Edit Payment</h2>
        <p className='font-bold text-muted-foreground'>Receipt No. {payment?.receiptNumber}</p>
      </div>
      <div className="space-y-4">
        <div className="max-w-full">
          <p className="text-sm font-medium">Date</p>
          <DatePicker date={date} setDate={setDate} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <Label>Select account</Label>
            <Select value={targetAccount || 'Select target account'} onValueChange={setTargetAccount}>
              <SelectTrigger disabled>
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

        
            <div className="w-full">
              <Label>Name</Label>
              <Input value={otherName} onChange={(e) => {
                setOtherName(e.target.value)
              }} placeholder="Enter name" />
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
              <Button size="sm" variant="destructive" onClick={() => handleRemoveItem(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button size="sm" variant="secondary" onClick={handleAddItem}>
            <PlusCircle className='h-4' /> Add Item
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold">Total: ₹{total.toFixed(2)}</h3>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>
            {loading ? <Loader2 className="animate-spin" /> : 'Update'}
          </Button>
        </div>
      </div>
    </div>
   </div>
  );
};

export default withAuth(EditPaymentPage);
