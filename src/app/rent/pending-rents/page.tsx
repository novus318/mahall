'use client'
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UpdateRentCollection from '@/components/UpdateRentCollection';
import axios from 'axios';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react'



interface RentCollection {
    buildingName: string;
    roomNumber: string;
    tenantName: string;
    period: string;
    amount: number;
    tenantNumber:string;
    dueDate: string;
    shop:string;

    status: 'Pending' | 'Overdue' | 'Paid';
  }
 
const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [collections, setCollections] = useState<RentCollection[]>([]);
    const [loading,setLoading] = useState(true)

 

    useEffect(() => {
       fetchPendingCollections();
      }, []);


  
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


      if(loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <Skeleton />
            </div>
        )
    }
  return (
    <div className='p-2'>
      <div className='max-w-7xl mx-auto'>
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
              <TableHead>Shop</TableHead>
              <TableHead>Tenant Name</TableHead>
              <TableHead>number</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollections.map((collection, index) => (
              <TableRow key={index}>
                <TableCell>{collection.buildingName}</TableCell>
                <TableCell>{collection.roomNumber}</TableCell>
                <TableCell>{collection?.shop}</TableCell>
                <TableCell>{collection.tenantName}</TableCell>
                <TableCell>{collection?.tenantNumber}</TableCell>
                <TableCell>{collection.period}</TableCell>
                <TableCell>{collection.amount}</TableCell>
                <TableCell>{new Date(collection.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
               <UpdateRentCollection selectedCollection={collection} fetchPendingCollections={fetchPendingCollections}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Suspense>
    </div>
    </div>
    </div>
  )
}

export default Page
