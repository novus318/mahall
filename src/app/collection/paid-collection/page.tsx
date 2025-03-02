'use client';
import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Download, Receipt, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Skeleton Loading Component
const CollectionsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {[...Array(7)].map((_, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-6 w-24" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(7)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface Collection {
  _id: string;
  description: string;
  amount: number;
  status: string;
  PaymentDate: string;
  kudiCollectionType: string;
  collectionMonth: string;
  paymentType: string;
  paidYear: string;
  partialPayments: any;
  category: {
    name: string;
    description: string;
  };
  houseId: {
    _id: string;
    address: string;
    name: string;
    number: string;
  };
  memberId: {
    _id: string;
    name: string;
    whatsappNumber: string;
  };
}

const CollectionsPage: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthYearFilter, setMonthYearFilter] = useState<string>('all');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/house/get/paid/collections`);
        setCollections(response.data.houses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch collections. Please try again later.');
        setLoading(false);
      }
    };

    fetchCollections();
  }, [apiUrl]);

  const filteredCollections = collections.filter((collection) => {
    const matchesSearchQuery =
      collection.memberId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.houseId.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.memberId.whatsappNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonthYearFilter =
      monthYearFilter === 'all' ||
      (collection.paymentType === 'monthly' && collection.collectionMonth === monthYearFilter) ||
      (collection.paymentType === 'yearly' && collection.paidYear === monthYearFilter);

    return matchesSearchQuery && matchesMonthYearFilter;
  });

  const getUniqueMonthsAndYears = () => {
    const monthsAndYears = new Set<string>();
    collections.forEach((collection) => {
      if (collection.paymentType === 'monthly') {
        monthsAndYears.add(collection.collectionMonth);
      } else if (collection.paymentType === 'yearly') {
        monthsAndYears.add(collection.paidYear);
      }
    });
    return Array.from(monthsAndYears).sort();
  };

  if (loading) return <CollectionsSkeleton />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              window.location.href = '/collection';
            }}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Tution Fees</h1>
            <p className="text-xs font-sans text-center">Last 50 collections.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search collections..."
              className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-full">
                {monthYearFilter === 'all' ? 'All Months/Years' : monthYearFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMonthYearFilter('all')}>All Months/Years</DropdownMenuItem>
              {getUniqueMonthsAndYears().map((monthYear) => (
                <DropdownMenuItem key={monthYear} onClick={() => setMonthYearFilter(monthYear)}>
                  {monthYear}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SI No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Family Head</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.map((collection,index) => {
                  return (
                    <React.Fragment key={collection._id}>
                      {/* Main Row */}
                      <TableRow>
                      <TableCell>
                        {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{collection?.paymentType === 'monthly' ? collection?.collectionMonth : collection?.paidYear}</div>
                        </TableCell>
                        <TableCell>
                          <Link className="text-blue-600 hover:underline" href={`/house/house-details/${collection.houseId?._id}`}>
                            {collection.houseId.number}
                          </Link>
                        </TableCell>
                        <TableCell>₹{collection.amount.toFixed(2)}</TableCell>
                        <TableCell>{collection.memberId.name}</TableCell>
                        <TableCell>{collection.memberId.whatsappNumber}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                            {collection.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {collection?.PaymentDate ? format(new Date(collection.PaymentDate), 'MMM dd, yyyy') : 'NIL'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            target="_blank"
                            href={`/payment-reciept/${collection.memberId._id}`}
                            className="flex items-center gap-2 rounded-full hover:bg-gray-100"
                          >
                            <Receipt className="h-4 w-4" />
                            Receipt
                          </Link>
                        </TableCell>
                      </TableRow>

                      {/* Partial Payments Row (for yearly payments) */}
                      {collection?.paymentType === 'yearly' && collection.partialPayments?.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="py-3">
                            <div className="pl-6 space-y-2">
                              {collection.partialPayments.map((payment: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Paid: ₹{payment.amount.toFixed(2)}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-xs font-bold">
                                      {format(new Date(payment?.paymentDate ? payment?.paymentDate : new Date()), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                  <div>
                                    {payment?.description && <span className="text-xs">{payment.description}</span>}
                                    {payment?.receiptNumber && (
                                      <span className="ml-2 text-gray-500 text-xs font-bold">Receipt: {payment.receiptNumber}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
                {filteredCollections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-600 text-sm py-6">
                      <h4 className="text-lg font-bold">No collections found.</h4>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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