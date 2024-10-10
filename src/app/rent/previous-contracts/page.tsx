'use client'
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns'; 
import { enIN } from 'date-fns/locale'; 
import { withAuth } from '@/components/withAuth';

type Tenant = {
  aadhaar: string;
  name: string;
  number: string; // Added number field
};
type Contract = {
  _id: string;
  from: Date;
  to: Date;
  tenant: Tenant;
  shop: string;
  status: 'active' | 'rejected' | 'inactive';
  rent: number;  // Added rent field
  deposit: number; // Added deposit field
};
type Room = {
  _id: string;
  roomNumber: string;
  contractHistory: Contract[];
};

type Building = {
  _id: string;
  buildingID: string;
  buildingName: string;
  place: string;
  rooms: Room[];
};

const Page = () => {
  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBuildings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/rent/get-buildings`);
      if (response.data.success) {
        setBuildings(response.data.buildings);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Network error',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return (
    <div className='w-full py-5 px-2'>
      <div className="mb-4 flex justify-between items-center">
        <Link href='/rent' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Back
        </Link>
      </div>
      {buildings?.map((building) => (
        <div key={building._id} className='mb-8 p-4 border border-gray-300 rounded-lg shadow-md'>
          <h2 className="text-xl font-bold">{building?.buildingName}</h2>
          <p className="text-muted-foreground text-xs">ID: {building?.buildingID}</p>
          <p className="text-muted-foreground">Place: {building?.place}</p>
          <div className='overflow-x-auto'>
            {building?.rooms?.map((room) => (
              <div key={room._id}>
                <h3 className="text-lg font-bold">{room?.roomNumber}</h3>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>From</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>To</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Shop</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tenant name</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Number</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rent</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Deposit</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {room?.contractHistory.map((contract) => (
                      <tr key={contract._id} className={contract?.status === 'inactive' ? 'bg-orange-100' : 'bg-green-100'}>
                        <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {format(new Date(contract?.from), 'PPP', { locale: enIN })} 
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {format(new Date(contract?.to), 'PPP', { locale: enIN })} 
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{contract?.shop}</td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{contract?.tenant?.name}</td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{contract?.tenant?.number}</td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          ₹{contract?.rent?.toFixed(2)} 
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          ₹{contract?.deposit?.toFixed(2)} 
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{contract?.status}</td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <Link
                            href={`/rent/room-details/${building._id}/${room._id}/${contract?._id}`}
                            className="text-xs font-medium bg-gray-900 text-white px-2 py-1 rounded-md"
                            prefetch={false}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default withAuth(Page);
