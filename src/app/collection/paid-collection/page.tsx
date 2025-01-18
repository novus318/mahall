'use client';
import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Download, Receipt, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };

  const filteredCollections = collections.filter((collection) => {
    return (
      collection.memberId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.houseId.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.memberId.whatsappNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Family Head</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.map((collection) => {
                  const { dayMonthYear, time } = formatDate(collection.PaymentDate);
                  return (
                    <TableRow key={collection._id}>
                      <TableCell>
                        <div className="text-sm">{collection.collectionMonth}</div>
                      </TableCell>
                      <TableCell>{collection.houseId.number}</TableCell>
                      <TableCell>₹{collection.amount.toFixed(2)}</TableCell>
                      <TableCell>{collection.memberId.name}</TableCell>
                      <TableCell>{collection.memberId.whatsappNumber}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                          {collection.status}
                        </span>
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