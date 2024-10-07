'use client'
import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';


const CollectionsSkeleton: React.FC = () => {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Collections</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  };
interface Collection {
  _id: string;
  description: string;
  amount: number;
  status: string
  PaymentDate: string;
  kudiCollectionType:string
category:{
name: string;
description:string;
}
houseId:{
    _id: string;
    address: string;
    name: string;
    number: string;
}
memberId:{
    _id: string;
    name: string;
}
}

const CollectionsPage: React.FC = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [Collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/house/get/paid/collections`);
        setCollections(response.data.houses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Collections');
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };
  
  const formatAmount = (amount:any, type:any) => {
    return type === 'Credit' ? `+${amount}` : `-${amount}`;
  };

  if (loading) return <CollectionsSkeleton />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
       <div className="mb-4 flex justify-between items-center">
        <Link href='/collection' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Back
        </Link>
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Tution Fees</h2>
      </div>
   <div className='rounded-t-md bg-gray-100 p-1'>
   <Table className="bg-white">
  <TableHeader className='bg-gray-100'>
    <TableRow>
      <TableHead className="font-medium">Date</TableHead>
        <TableHead>House</TableHead>
      <TableHead className="font-medium">Amount</TableHead>
      <TableHead>Family Head</TableHead>
      <TableHead className="font-medium">Status</TableHead>
      <TableHead className="font-medium">Reciept</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {Collections.map((collection) => {
      const { dayMonthYear, time } = formatDate(collection?.PaymentDate);
      return (
        <TableRow key={collection._id}>
          <TableCell>
            <div className='text-sm'>{dayMonthYear}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </TableCell>
          <TableCell >{collection?.houseId?.number}</TableCell>
          <TableCell>
          ₹{collection?.amount.toFixed(2)}
          </TableCell>
          <TableCell>{collection?.memberId?.name}</TableCell>
          <TableCell>{collection?.status}</TableCell>
          <TableCell>
            <Link target='_blank' href={`/payment-reciept/${collection.memberId._id}`} className='text-white bg-gray-900 py-1 px-2 rounded-md'>
              Receipt
            </Link>
          </TableCell>
        </TableRow>
      );
    })}
    {Collections.length === 0 && (
        <TableCell colSpan={3} className="text-center text-gray-600 text-sm">
          <h4 className="text-lg font-bold">No Collections...</h4>
        </TableCell>
      ) 
    }
  </TableBody>
</Table>
   </div>
    </div>
  );
};

const CollectionsWrapper: React.FC = () => {
  return (
    <Suspense fallback={<CollectionsSkeleton />}>
      <CollectionsPage />
    </Suspense>
  );
};

export default CollectionsWrapper;
