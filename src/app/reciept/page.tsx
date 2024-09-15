'use client'
import CreateRecCategory from '@/components/CreateRecCategory'
import DatePicker from '@/components/DatePicker'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { Loader2} from 'lucide-react'
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
  const [RecieptCategories, setRecieptCategories] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([])
  const [targetAccount, setTargetAccount] = useState<string | null>(null);
  const [recieptTo, setRecieptTo] = useState<string | null>(null); // Added state for paymentTo
  const [selectedMember, setSelectedMember] = useState<string | null>(null); // Added state for selected member
  const [otherName, setOtherName] = useState<string>(''); // Added state for other name
  const [otherNumber, setOtherNumber] = useState<string>(''); // Added state for other number
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [description,setDescription] =useState('')
 const [amount, setAmount] = useState<number>(0); 
  const [date, setdate] = useState(new Date());
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recieptRecieptNo, setrecieptRecieptNo] = useState<any>(''); 

    // Filter members based on the search query
    const filteredMembers = members?.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const fetchAccounts = () => {
      axios.get(`${apiUrl}/api/account/get`).then(response => {
        setBank(response.data.accounts)
      })
        .catch(error => {
          console.log("Error fetching accounts:", error)
        })
    }
    
    const fetchRecCategories = () => {
      axios.get(`${apiUrl}/api/reciept/category/all`).then(response => {
        setRecieptCategories(response.data.categories)
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
  
    const RecieptRecieptNumber = () => {
      axios
        .get(`${apiUrl}/api/reciept/get-reciept/number`)
        .then((response) => {
          if(response.data.success){
            setrecieptRecieptNo(response.data.Number);
          }
        })
        .catch((error) => {
          console.log('Error fetching reciept number:', error);
        });
      }

    useEffect(() => {
      fetchAccounts()
      fetchRecCategories()
      RecieptRecieptNumber()
    }, [])

    const validate = () => {
      let isValid = true;
      if (!targetAccount) {{
        toast({
          title: 'Please select a bank account',
          variant: 'destructive',
        })
        isValid = false;
      }
    }
    if (!date) {
      toast({
        title: 'Please select a reciept date',
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
    if (!selectedMember && recieptTo === 'Other') {
      toast({
        title: 'Please select a member or enter other recipient details',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (recieptTo === 'Other' && (!otherName ||!otherNumber)) {
      toast({
        title: 'Please enter other recipient details',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (selectedMember && recieptTo === 'Member') {
      toast({
        title: 'Please select a member',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (!description) {
      toast({
        title: 'Please enter description',
        variant: 'destructive',
      })
      isValid = false;
    }
    if (!amount || amount < 0) {
      toast({
        title: 'Please enter a valid amount',
        variant: 'destructive',
      })
      isValid = false;
    }
  
      return isValid;
  };
  
    const handleSubmit =async()=>{
      if (!validate()) return;
    setLoading(true);
  try{
      const recipient ={
      name:otherName,
      number:otherNumber
    }
    const data = {
      amount,
      date, 
      description,
      accountId:targetAccount, 
      categoryId:RecieptCategories.find(c => c._id === targetCategory), 
      recieptType:'Cash', 
      memberId:selectedMember, 
      otherRecipient:recipient,
      receiptNumber:recieptRecieptNo
    }
    const response = await axios.post(`${apiUrl}/api/reciept/create-reciept`, data)
    if(response.data.success){
      setAmount(0)
      setTargetAccount(null)
      setOtherName('')
      setOtherNumber('')
      setDescription('')
      setTargetCategory(null)
      setRecieptTo(null)
      setSearchQuery('')
      setSelectedMember(null)
      RecieptRecieptNumber()
      toast({
        title: 'Reciept created successfully',
        description: 'You have created a new reciept.',
        variant:'default'
      })
      setLoading(false)
    }}catch(error:any){
      setLoading(false)
      toast({
        title: 'Failed to create payment',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant:'destructive'
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
        <CreateRecCategory fetchCategories={fetchRecCategories}/>
        <Link href={'/reciept/recent-reciepts'} className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'>
            Recent Reciepts
          </Link>
      </div>
    <div className="p-4 bg-white rounded-md border my-8 max-w-2xl mx-auto">
    <div className='flex justify-between'>
    <h2 className="text-2xl font-semibold mb-4">New Reciept</h2>
    <p className='font-bold text-muted-foreground'>{recieptRecieptNo}</p>
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
              {RecieptCategories?.map((c) => (
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
          <Label>Reciept to</Label>
          <Select value={recieptTo || 'Select reciept to'} onValueChange={setRecieptTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select reciept to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        {recieptTo === 'member' && (
          <div className="w-full">
            <Label>Select Member</Label>
            <Select onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-3 py-2">
                  <Input
                    type="text"
                    className="w-full border border-gray-300 rounded-md"
                    placeholder="Search member"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {filteredMembers?.map((member:any) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name} - <span className='text-muted-foreground'>{member?.house.number}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
  
        {recieptTo === 'other' && (
          <div className="w-full">
            <Label>Name</Label>
            <Input
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              placeholder="Enter name"
            />
            <Label className="mt-2">Number</Label>
            <Input
              value={otherNumber}
              onChange={(e) => setOtherNumber(e.target.value)}
              placeholder="Enter number"
            />
          </div>
        )}
      </div>
  
      <div className="mt-8 space-y-2">
        <h3 className="text-lg font-medium mb-2">Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div className="w-full">
            <Label>Amount</Label>
            <Input
              type="text"
              value={amount === 0 ? '': amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>
  
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit}>
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
