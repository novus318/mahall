'use client'
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHouseContext } from '@/context/HouseContext';
import Link from 'next/link';
import { withAuth } from '@/components/withAuth';


const Page = () => {
  const { houses, fetchHouses } = useHouseContext();
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchHouses()
  }, [])

  const filteredHouses = houses.filter((house: any) =>
    house?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house?.familyHead?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredHouses.map((house: any) => (
            <Card key={house?._id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/house/house-details/${house?._id}`}>
                <CardHeader className="mb-2 bg-gray-100 rounded-t-md">
                  <CardTitle className="text-lg font-medium">House {house?.number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-3 text-sm">
                    <p className="font-semibold">Name:</p>
                    <p className="col-span-2 text-gray-900">{house?.name}</p>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <p className="font-semibold">Address:</p>
                    <p className="col-span-2 text-gray-900 truncate">{house?.address}</p>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <p className="font-semibold">Head:</p>
                    <p className="col-span-2 text-gray-900 truncate">{house?.familyHead?.name || 'NIL'}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
