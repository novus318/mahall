'use client'
import DatePicker from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { withAuth } from '@/components/withAuth';
import { format, startOfMonth } from 'date-fns';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
});

const RecentrecieptSkeleton: React.FC = () => (
  <div className="container mx-auto p-4">
    <h2 className="text-2xl font-semibold mb-4">Recent receipts</h2>
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-7 w-1/4" />
          <Skeleton className="h-7 w-1/4" />
          <Skeleton className="h-7 w-1/4" />
          <Skeleton className="h-7 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

const RentPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [btloading, setBtLoading] = useState(false);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]); // Filtered collections state
  const [statusFilter, setStatusFilter] = useState<string>(''); // Status filter

  const fetchInitialcollection = async () => {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    try {
      const data: any = {
        startDate: firstDayOfMonth,
        endDate: now,
      };
      const response = await axios.get(`${apiUrl}/api/reports/rent-collections/byDate`, { params: data });
      if (response.data.success) {
        setCollections(response.data.collections);
        setFilteredCollections(response.data.collections); 
        setFromDate(firstDayOfMonth);
        setToDate(now);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setFromDate(firstDayOfMonth);
      setToDate(now);
      toast({
        title: 'Failed to fetch.',
        description: error.response?.data?.message || error.message || 'something went wrong',
        variant: 'destructive',
      });
    }
  };

  const fetchCollections = async () => {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 0, 0);
    if (!fromDate || !toDate) {
      toast({
        title: 'Please select a date range.',
        variant: 'destructive',
      });
      return;
    }
    if (new Date(toDate) > currentDate) {
      toast({
        title: 'To Date cannot be in the future.',
        variant: 'destructive',
      });
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast({
        title: 'From Date cannot be after To Date.',
        variant: 'destructive',
      });
      return;
    }
    if (btloading) return;
    setBtLoading(true);
    try {
      const data: any = {
        startDate: fromDate,
        endDate: toDate,
      };
      const response = await axios.get(`${apiUrl}/api/reports/rent-collections/byDate`, { params: data });
      if (response.data.success) {
        setCollections(response.data.collections);
        setFilteredCollections(response.data.collections);
        setBtLoading(false);
        toast({
          title: 'Receipts fetched successfully.',
          variant: 'default',
        });
      }
    } catch (err: any) {
      setBtLoading(false);
      toast({
        title: 'Failed to fetch Receipts.',
        description: err.response?.data?.message || err.message || 'something went wrong',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchInitialcollection();
  }, []);


  useEffect(() => {
    const applyFilters = () => {
      let data: any = collections;

      if (statusFilter) {
        data = data.filter((collection: any) => collection.status === statusFilter);
      }
      setFilteredCollections(data);
    };
  
    applyFilters();
  }, [collections, statusFilter]); 
  


  const formatDate = (dateString: any) => {
    const date = new Date(dateString ||new Date());
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };
  const formatCurrency = (amount:any) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const handleReceiptClick = async (data: any) => {
    const totalAmount = data.reduce((acc: number, collection: any) => acc + collection.amount, 0);
    const totalCollections = data.length;
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image src="/vkgclean.png" style={styles.logo} />
            <Text style={styles.headerText}>Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA</Text>
            <Text style={styles.headerText}>VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST</Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
            <View style={styles.separator} />
          </View>
  
          {/* Date Range Section */}
          <Text style={styles.sectionTitle}>
            Collections From: {formatDate(fromDate).dayMonthYear} - To: {formatDate(toDate).dayMonthYear}
          </Text>
          <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>Total Amount: ₹{formatCurrency(totalAmount)}</Text>
                    <Text style={styles.summaryText}>Total Collections: {totalCollections}</Text>
                </View>
          {/* Table Section */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.headerCell]}>Building</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Room No.</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Tenant Name</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Period</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Due Date</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Pay Date</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Status</Text>
            </View>
  
            {/* Table Data */}
            {data.map((collection: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{collection.buildingName}</Text>
                <Text style={styles.tableCell}>{collection.roomNumber}</Text>
                <Text style={styles.tableCell}>{collection.tenantName}</Text>
                <Text style={styles.tableCell}>{collection.period}</Text>
                <Text style={styles.tableCell}>{formatCurrency(collection.amount)}</Text>
                <Text style={styles.tableCell}>{new Date(collection.dueDate).toLocaleDateString()}</Text>
                <Text style={styles.tableCell}>{collection.paymentDate ? new Date(collection.paymentDate).toLocaleDateString(): 'Pending'}</Text>
                <Text style={styles.tableCell}>{collection?.status}</Text>
              </View>
            ))}
             {data?.length === 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>No collections</Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    saveAs(blob, `Collections From ${formatDate(fromDate).dayMonthYear || 'Invalid date'} - To ${formatDate(toDate).dayMonthYear || 'Invalid date'}.pdf`);
  };
  
  const styles = StyleSheet.create({
    page: {
      padding: 10, // Padding for A4 layout
      fontFamily: 'Roboto',
      fontSize: 11,
      color: '#333',
      lineHeight: 1.5,
    },
    summaryContainer: {
      marginTop: 15,
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#F9F9F9', // Light background for summary
  },
  summaryText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'right', // Right align for a neat summary look
  },
    header: {
      textAlign: 'center',
      marginBottom: 15,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    headerText: {
      fontSize: 10,
      marginBottom: 4,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 10,
      alignSelf: 'center',
    },
    separator: {
      borderBottomWidth: 2,
      borderBottomColor: '#E5E7EB',
      marginVertical: 15,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#444',
      marginBottom: 15,
    },
    tableContainer: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingVertical: 8,
      paddingHorizontal: 5,
    },
    tableHeader: {
      backgroundColor: '#F5F5F5',
      fontWeight: 'bold',
    },
    tableCell: {
      flex: 1,
      textAlign: 'center',
      fontSize: 10,
    },
    headerCell: {
      fontWeight: 'bold',
    },
  });
  

  if (loading) return <RecentrecieptSkeleton />;

  return (
    <div className="w-full py-5 px-2">
      <Link href="/reports" className="bg-gray-900 text-white rounded-sm py-2 px-3 text-sm">
        Back
      </Link>
      <div className="max-w-6xl m-auto my-3">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Collections From {formatDate(fromDate).dayMonthYear || 'Invalid date'} - To{' '}
            {formatDate(toDate).dayMonthYear || 'Invalid date'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-8 gap-3 md:gap-5 mb-2 items-center">
          <div className="md:col-span-2">
            <p className="text-sm font-medium">From Date</p>
            <DatePicker date={fromDate} setDate={setFromDate} />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium">To Date</p>
            <DatePicker date={toDate} setDate={setToDate} />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium">Filter by Status</p>
            <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>All</option>
    <option value='Paid'>Paid</option>
    <option value='Pending'>Pending</option>
    <option value='Rejected'>Rejected</option>
  </select>
          </div>
          <div className="md:pt-4">
            <Button size="sm" onClick={fetchCollections} disabled={loading} className="w-full md:w-auto">
              {btloading ? <Loader2 className="animate-spin h-5" /> : 'Get collections'}
            </Button>
          </div>
          <div className="md:pt-4">
            <Button size="sm" onClick={() => handleReceiptClick(filteredCollections)} className="w-full md:w-auto">
              Print
            </Button>
          </div>
        </div>
        <div className="rounded-t-md bg-gray-100 p-1">
          <Table className="bg-white">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="font-medium">Building</TableHead>
                <TableHead className="font-medium">Room No.</TableHead>
                <TableHead className="font-medium">Tenant Name</TableHead>
                <TableHead className="font-medium">Period</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Due Date</TableHead>
                <TableHead className="font-medium">Pay Date</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections?.map((collection: any, index: number) => (
                <TableRow key={collection?._id}>
                     <TableCell>{collection.buildingName}</TableCell>
                <TableCell>{collection.roomNumber}</TableCell>
                <TableCell>{collection.tenantName}</TableCell>
                <TableCell>{collection.period}</TableCell>
                <TableCell>{formatCurrency(collection.amount)}</TableCell>
                <TableCell>{new Date(collection.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{collection.paymentDate ? new Date(collection.paymentDate).toLocaleDateString(): 'Pending'}</TableCell>
                  <TableCell>{collection?.status}</TableCell>
                </TableRow>
              ))}
              {filteredCollections?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No collections found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(RentPage);
