'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Table, TableHead, TableBody, TableRow, TableCell,TableHeader } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { withAuth } from '@/components/withAuth';
import axios from 'axios';


const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [houses, setHouses] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');

const fetchHouses = async () => {
  const response = await axios.get(`${apiUrl}/api/house/get`);
  if (response.data.success) {
    setHouses(response.data.houses);
  } else {
    console.error('Error fetching houses');
  }
}
  useEffect(() => {
    fetchHouses()
  }, [])

  const filteredHouses = houses.filter((house: any) =>
    house?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house?.familyHead?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHouses = useMemo(() => {
    return [...filteredHouses].sort((a: any, b: any) => {
      const numA = a.number.toString().toLowerCase();
      const numB = b.number.toString().toLowerCase();
      return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [filteredHouses]);
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
        <div className="flex justify-between items-center mb-4 gap-2">
          <Input
            placeholder="Search houses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2"
          />
          <Link href='/house/create-house' className='bg-gray-900 text-white py-1 px-2 rounded-md'>
            Create House</Link>
        </div>
        <div >
          <h4 className="text-lg font-semibold">Total Houses : {houses?.length}</h4>
          </div>
      <div>
      <Table className="border rounded-t-lg shadow-sm">
    <TableHeader className='w-f'>
      <TableRow>
        <TableHead className="px-4 py-2 font-medium text-gray-700">House Number</TableHead>
        <TableHead className="px-4 py-2 font-medium text-gray-700">Head</TableHead>
        <TableHead className="px-4 py-2 font-medium text-gray-700">Number</TableHead>
        <TableHead className="px-4 py-2 font-medium text-gray-700">Address</TableHead>
        <TableHead className="px-4 py-2 font-medium text-gray-700">House Name</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sortedHouses.map((house: any) => (
        <TableRow key={house?._id} className="border-t hover:bg-gray-50 transition-colors">
          <TableCell className="px-4 py-2">
            <Link href={`/house/house-details/${house?._id}`}>
              <span className="text-blue-600 hover:underline">House {house?.number}</span>
            </Link>
          </TableCell>
          <TableCell className="px-4 py-2">{house?.familyHead?.name || 'NIL'}</TableCell>
          <TableCell className="px-4 py-2">{house?.familyHead?.whatsappNumber || 'NIL'}</TableCell>
          <TableCell className="px-4 py-2">{house?.address || 'NIL'}</TableCell>
          <TableCell className="px-4 py-2">{house?.name || 'NIL'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
      </div>
        </div>
      </div>
  );
};

export default withAuth(Page);
