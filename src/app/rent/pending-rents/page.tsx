'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { PlusCircle, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react'



interface RentCollection {
    buildingName: string;
    roomNumber: string;
    tenantName: string;
    period: string;
    amount: number;
    dueDate: string;
    status: 'Pending' | 'Overdue' | 'Paid';
  }
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
const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [collections, setCollections] = useState<RentCollection[]>([]);
    const [loading,setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedCollection, setSelectedCollection] = useState<any>(null);
    const [paymentType, setPaymentType] = useState<string>('');
    const [bank, setBank] = useState<BankAccount[]>([])
    const [targetAccount, setTargetAccount] = useState<string | null>(null);
    const [deductions, setDeductions] = useState<any[]>([]);

    const addDeduction = () => {
      setDeductions([...deductions, { name: '', amount: 0 }]);
    };
  
    const removeDeduction = (index:any) => {
      const updatedDeductions = deductions.filter((_, i) => i !== index);
      setDeductions(updatedDeductions);
    };
  
    const handleDeductionChange = (index:any, key:any, value:any) => {
      const updatedDeductions = [...deductions];
      updatedDeductions[index][key] = value;
      setDeductions(updatedDeductions);
    };

    const amount = selectedCollection?.amount - deductions.reduce((acc, deduction) => acc + parseFloat(deduction.amount || 0), 0)
    useEffect(() => {
       fetchPendingCollections();
       fetchAccounts()
      }, []);

      const fetchAccounts = () => {
        axios.get(`${apiUrl}/api/account/get`).then(response => {
          setBank(response.data.accounts)
        })
          .catch(error => {
            console.log("Error fetching accounts:", error)
          })
      }
    
  
      const fetchPendingCollections = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/rent/rent-collections/pending`);
            if (response.data.success) {
                setCollections(response.data.pendingCollections);
              setLoading(false)
            }
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      }

      const filteredCollections = collections.filter(
        (collection) =>
          collection.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.amount.toString().includes(searchTerm)
      );

      const handleOpenDialog = (collection: any) => {
        setSelectedCollection(collection);
        setIsDialogOpen(true);
      };

      const handleSubmitPayment = async () => {
        if (!paymentType) {
          toast({
            title: 'Please select a payment type',
            description: 'You must select a payment type before submitting',
            variant: 'destructive',
          });
          return;
        }
        setLoading(true);
        try {
          const response = await axios.put(`${apiUrl}/api/rent/update/rent-collection/${selectedCollection.buildingId}/${selectedCollection.roomId}`, {
            rentCollectionId:selectedCollection.rentId,
            paymentType, 
            newStatus: 'Paid', 
            accountId:targetAccount,
            deductions,
            amount 
          });
          if (response.data.success) {
            toast({
              title: 'Payment updated successfully',
              variant: 'default',
            });
            setPaymentType('');
            setIsDialogOpen(false);
            fetchPendingCollections();
            setLoading(false);
          } 
        } catch (error: any) {
          setLoading(false)
          toast({
            title: 'Failed to update payment',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
        }
      };


  return (
    <div className='p-2'>
      <div className='max-w-5xl mx-auto'>
          <div className="mb-4 flex justify-between items-center">
              <Link href={`/rent`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                  Back
              </Link>
          </div>
       <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Rent Collections</h1>
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Suspense fallback={<Skeleton />}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Building Name</TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Tenant Name</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollections.map((collection, index) => (
              <TableRow key={index}>
                <TableCell>{collection.buildingName}</TableCell>
                <TableCell>{collection.roomNumber}</TableCell>
                <TableCell>{collection.tenantName}</TableCell>
                <TableCell>{collection.period}</TableCell>
                <TableCell>{collection.amount}</TableCell>
                <TableCell>{new Date(collection.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                <Badge onClick={() => handleOpenDialog(collection)} className="cursor-pointer">
                    {collection?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Suspense>
    </div>
    </div>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            Update Payment for Room Number {selectedCollection?.roomNumber}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground font-semibold text-sm'>
            BuildingID: {selectedCollection?.buildingID}
            <br/>
            Rent Amount: ₹{(selectedCollection?.amount ?? 0).toFixed(2)}
            <br />
            Name: {selectedCollection?.tenantName}
          </DialogDescription>
          {bank.length > 0 ? (
            <>
            <Label>
              Select bank
            </Label>
              <Select onValueChange={setTargetAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {bank.map((acc) => (
                    <SelectItem key={acc._id} value={acc._id}>
                      {acc.name} - {acc.holderName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <p>Please close and open again.</p>
          )}
           <Label>
              Select type
            </Label>
          <Select onValueChange={(value) => setPaymentType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>
          {deductions.map((deduction, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-center">
             <div className='col-span-2'>
             <Label >
                  Deduction Name
  </Label>
              <Input
                type="text"
                placeholder="Deduction Name"
                value={deduction.name}
                onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
              />
             </div>
             <div className='col-span-2'>
              <Label>
                Amount
              </Label>
             <Input
                type="text"
                placeholder="Amount"
                value={deduction.amount === 0 ? '': deduction?.amount}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                  handleDeductionChange(index, 'amount', value ? value : 0)}}
                    }
              />
             </div>
              <Button className='mt-4' variant="destructive" size='sm' onClick={() => removeDeduction(index)}>
                <Trash className='h-5'/>
              </Button>
            </div>
          ))}
          <Button className='mt-3' variant="outline" size='sm' onClick={addDeduction}>
            <PlusCircle className='h-4'/> Add deductions
          </Button>
          <h4 className='font-semibold text-muted-foreground'>Amount : ₹{amount}</h4>
          <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPayment} disabled={!paymentType || !targetAccount}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page
