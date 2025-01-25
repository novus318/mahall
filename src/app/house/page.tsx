'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { withAuth } from '@/components/withAuth';
import axios from 'axios';
import { ChevronDown, Loader2, Plus, Search } from 'lucide-react';
import HousesReport from '@/components/reports/HousesReport';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [houses, setHouses] = useState<any>([]);
  const [totalHouses, setTotalHouses] = useState<any>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'monthly' | 'yearly'>('all'); // Filter state

  const fetchHouses = async () => {
    setIsLoading(true)
    const response = await axios.get(`${apiUrl}/api/house/get`);
    if (response.data.success) {
      setHouses(response.data.houses);
      setTotalHouses(response.data.total);
    } else {
      setIsLoading(false);
      console.error('Error fetching houses');
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const filteredHouses = useMemo(() => {
    return houses.filter((house: any) => {
      const matchesSearchTerm =
        house?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house?.familyHead?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPaymentFilter =
        paymentFilter === 'all' || house?.paymentType === paymentFilter;

      return matchesSearchTerm && matchesPaymentFilter;
    });
  }, [houses, searchTerm, paymentFilter]);

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
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
          {/* Search and Filter Section */}
          <div className="flex items-center gap-4 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search houses..."
                className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50">
                Filter
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPaymentFilter('all')}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentFilter('monthly')}>
                  Monthly
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentFilter('yearly')}>
                  Yearly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Create House Button */}
          <Link
            href="/house/create-house"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors sm:w-auto w-full"
          >
            <Plus className="h-4 w-4" />
            Create House
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm mt-6">
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-lg font-medium">Total Houses: {totalHouses || 0}</h2>
            <HousesReport data={sortedHouses} />
          </div>
          <div className="overflow-x-auto capitalize">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>House Number</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>House Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHouses.length > 0 ? (
                  sortedHouses.map((house) => (
                    <TableRow key={house.id} className="group hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Link href={`/house/house-details/${house?._id}`}>
                            <span className="text-blue-600 hover:underline">House {house?.number}</span>
                          </Link>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${house.paymentType === 'monthly'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-purple-50 text-purple-700'
                              }`}
                          >
                            {house.paymentType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">{house?.familyHead?.name || 'NIL'}</TableCell>
                      <TableCell className="px-4 py-2">{house?.familyHead?.whatsappNumber || 'NIL'}</TableCell>
                      <TableCell className="px-4 py-2">{house?.address || 'NIL'}</TableCell>
                      <TableCell className="px-4 py-2">{house?.name || 'NIL'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                     {isLoading ? <Loader2 className='animate-spin'/> : "No houses found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
