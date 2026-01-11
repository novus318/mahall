'use client'
import DatePicker from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { withAuth } from '@/components/withAuth';
import { format, startOfMonth } from 'date-fns';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

Font.register({
  family: 'AnekMalayalam',
  src: '/AnekMalayalam.ttf',
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

const TutionPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [btloading, setBtLoading] = useState(false);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]); // Filtered collections state
  const [statusFilter, setStatusFilter] = useState<string>(''); // Status filter
  const [monthYearFilter, setMonthYearFilter] = useState<string>('all');

  const fetchInitialcollection = async () => {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    try {
      const data: any = {
        startDate: firstDayOfMonth,
        endDate: now,
      };
      const response = await axios.get(`${apiUrl}/api/reports/get/collections/byDate`, { params: data });
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
      const response = await axios.get(`${apiUrl}/api/reports/get/collections/byDate`, { params: data });
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

      if (monthYearFilter !== 'all') {
        data = data.filter((collection: any) => {
          if (collection.paymentType === 'monthly') {
            return collection.collectionMonth === monthYearFilter;
          } else if (collection.paymentType === 'yearly') {
            return collection.paidYear === monthYearFilter;
          }
          return false;
        });
      }

      setFilteredCollections(data);
    };

    applyFilters();
  }, [collections, statusFilter, monthYearFilter]);



  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };
  const formatCurrency = (amount: any) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleExcelDownload = async () => {
    if (!fromDate || !toDate) {
      toast({
        title: 'Please select a date range.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data: any = {
        startDate: fromDate,
        endDate: toDate,
      };

      const response = await axios.get(`${apiUrl}/api/reports/get/collections/excel`, {
        params: data,
        responseType: 'blob', // Important for file download
      });

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tuition-Collections-${formatDate(fromDate).dayMonthYear}-to-${formatDate(toDate).dayMonthYear}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Excel file downloaded successfully.',
        variant: 'default',
      });
    } catch (err: any) {
      toast({
        title: 'Failed to download Excel file.',
        description: err.response?.data?.message || err.message || 'something went wrong',
        variant: 'destructive',
      });
    }
  };

  const handleReceiptClick = async (data:any) => {
    const totalAmount = data.reduce((sum:any, collection:any) => sum + (collection?.amount || 0), 0);
    const totalCollections = data.length;
  
    const doc = (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Image src="/vkgclean.png" style={styles.logo} />
            <Text style={styles.headerText}>Reg. No: 1/88 K.W.B. | P.O. TRIKARIPUR-671310, KASARGOD DIST</Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
            <View style={styles.separator} />
          </View>
  
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>
              Collections From: {formatDate(fromDate).dayMonthYear} - To: {formatDate(toDate).dayMonthYear}
            </Text>
            <Text style={styles.summaryText}>Total Amount: {formatCurrency(totalAmount)}</Text>
            <Text style={styles.summaryText}>Total Collections: {totalCollections}</Text>
          </View>
  
          {/* Table */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              {['#', 'Date', 'Receipt No.', 'House', 'Amount', 'Paid Amount', 'Family Head', 'Payment Date', 'Account', 'Status'].map((header, index) => (
                <Text key={index} style={[styles.tableCell, styles.headerCell]}>{header}</Text>
              ))}
            </View>
  
            {/* Table Data */}
            {data.length > 0 ? (
              data.map((collection:any, index:any) => (
                <View key={index}>
                  <View style={[styles.tableRow, index % 2 ? styles.altRow : {}]}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{collection?.paymentType === 'monthly' ? collection?.collectionMonth : collection?.paidYear}</Text>
                    <Text style={styles.tableCell}>{collection?.receiptNumber}</Text>
                    <Text style={styles.tableCell}>{collection?.houseId?.number}</Text>
                    <Text style={styles.tableCell}>{formatCurrency(collection?.amount)}</Text>
                    <Text style={styles.tableCell}>
                      {collection?.paymentType === 'monthly' && collection?.status === 'Paid'
                        ? formatCurrency(collection?.amount || 0)
                        : formatCurrency(collection?.paidAmount || 0)}
                    </Text>
                    <Text style={styles.tableCell}>{collection?.memberId?.name}</Text>
                    <Text style={styles.tableCell}>{collection?.PaymentDate ? format(new Date(collection.PaymentDate), 'MMM dd, yyyy') : 'NIL'}</Text>
                    <Text style={styles.tableCell}>
                      {collection?.accountId ? 
                        `${collection.accountId.name}` 
                        : 'NIL'}
                    </Text>
                    <Text style={styles.tableCell}>{collection?.status}</Text>
                  </View>
  
                  {/* Partial Payments Section */}
                  {collection?.paymentType === 'yearly' && collection.partialPayments?.length > 0 && (
                    <View style={styles.partialPaymentContainer}>
                      <Text style={styles.partialTitle}>Partial Payments for {collection?.receiptNumber}</Text>
                      {collection.partialPayments.map((payment:any, idx:any) => (
                        <View key={idx} style={styles.partialRow}>
                          <Text style={styles.partialCell}>
                            {formatCurrency(payment.amount)} - {format(new Date(payment?.paymentDate || new Date()), 'MMM dd, yyyy')}
                            {payment?.description && ` (${payment.description})`}
                            {payment?.receiptNumber && ` - Receipt: ${payment.receiptNumber}`}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.noData}>No collections found.</Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    saveAs(
      blob,
      `Tution-fee-From ${formatDate(fromDate).dayMonthYear || 'Invalid date'} - To ${formatDate(toDate).dayMonthYear || 'Invalid date'}.pdf`
    );
  };
  
  // Styles
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: 'AnekMalayalam',
      fontSize: 10,
      color: '#333',
      lineHeight: 1.4,
    },
    header: {
      textAlign: 'center',
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    headerText: {
      fontSize: 9,
      marginBottom: 3,
    },
    logo: {
      width: 60,
      height: 60,
      marginBottom: 8,
      alignSelf: 'center',
    },
    separator: {
      borderBottomWidth: 2,
      borderBottomColor: '#E5E7EB',
      marginVertical: 10,
    },
    summaryContainer: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#F9F9F9',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    summaryText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'right',
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    tableHeader: {
      backgroundColor: '#F5F5F5',
      fontWeight: 'bold',
    },
    tableCell: {
      flex: 1,
      textAlign: 'center',
      fontSize: 9,
    },
    headerCell: {
      fontWeight: 'bold',
    },
    altRow: {
      backgroundColor: '#f7f7f7',
    },
    noData: {
      textAlign: 'center',
      fontSize: 9,
      fontWeight: 'bold',
      padding: 8,
    },
    rightAlign: {
      textAlign: 'right',
    },
    partialPaymentContainer: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#F9F9F9',
    },
    partialTitle: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    partialRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    partialCell: {
      fontSize: 9,
      color: '#444',
    },
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

  if (loading) return <RecentrecieptSkeleton />;

  return (
    <div className="w-full py-5 px-2">
      <Link href="/reports" className="bg-gray-900 text-white rounded-sm py-2 px-3 text-sm">
        Back
      </Link>
      <div className="max-w-6xl m-auto my-3">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Tution fee From {formatDate(fromDate).dayMonthYear || 'Invalid date'} - To{' '}
            {formatDate(toDate).dayMonthYear || 'Invalid date'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-9 gap-3 md:gap-5 mb-2 items-center">
          <div className="md:col-span-2">
            <p className="text-sm font-medium">From Date</p>
            <DatePicker date={fromDate} setDate={setFromDate} />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium">To Date</p>
            <DatePicker date={toDate} setDate={setToDate} />
          </div>
          <div className="md:col-span-1 w-full">
            <p className="text-sm font-medium">Filter by Status</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='w-full p-2 border border-gray-300 bg-white rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All</option>
              <option value='Paid'>Paid</option>
              <option value='Partial'>Partial</option>
              <option value='Unpaid'>Unpaid</option>
              <option value='Rejected'>Rejected</option>
            </select>
          </div>
          <div className="md:col-span-2">
          <p className="text-sm font-medium">Filter by Date</p>
     <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-lg w-full">
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
          <div className="md:pt-4">
            <Button size="sm" onClick={handleExcelDownload} variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
        <div className="rounded-t-md bg-gray-100 p-1 overflow-x-auto">
        <Table className="bg-white min-w-[1200px]">
  <TableHeader className="bg-gray-100">
    <TableRow>
      <TableHead className="font-medium">Serial No.</TableHead>
      <TableHead className="font-medium">Date</TableHead>
      <TableHead className="font-medium">Receipt No.</TableHead>
      <TableHead className="font-medium">House</TableHead>
      <TableHead className="font-medium">Collection Amount</TableHead>
      <TableHead className="font-medium">Amount Paid</TableHead>
      <TableHead className="font-medium">Family Head</TableHead>
      <TableHead className="font-medium">Payment Date</TableHead>
      <TableHead className="font-medium">Account</TableHead>
      <TableHead className="font-medium">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredCollections?.map((collection: any, index: number) => (
      <React.Fragment key={collection?._id}>
        {/* Main Row */}
        <TableRow>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{collection?.paymentType === 'monthly' ? collection?.collectionMonth : collection?.paidYear}</TableCell>
          <TableCell>{collection?.receiptNumber}</TableCell>
          <TableCell>{collection?.houseId?.number}</TableCell>
          <TableCell>{formatCurrency(collection?.amount)}</TableCell>
          <TableCell>{collection?.paymentType === 'monthly' && collection?.status === 'Paid' ? formatCurrency(collection?.amount||0) : formatCurrency(collection?.paidAmount||0)}</TableCell>
          <TableCell>{collection?.memberId?.name}</TableCell>
          <TableCell>
            {collection?.PaymentDate ? format(new Date(collection.PaymentDate), 'MMM dd, yyyy') : 'NIL'}
          </TableCell>
          <TableCell>
            {collection?.accountId ? (
              <div className="text-sm">
                <div className="font-medium">{collection.accountId.name}</div>
              </div>
            ) : 'NIL'}
          </TableCell>
          <TableCell>{collection?.status}</TableCell>
        </TableRow>

        {/* Partial Payments Row (for yearly payments) */}
        {collection?.paymentType === 'yearly' && collection.partialPayments?.length > 0 && (
          <TableRow>
            <TableCell colSpan={7} className="py-3">
              <div className="pl-6 space-y-2">
                {collection.partialPayments.map((payment: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Paid: {formatCurrency(payment.amount)}</span>
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
    ))}
    {filteredCollections?.length === 0 && (
      <TableRow>
        <TableCell colSpan={7} className="text-center">
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

export default withAuth(TutionPage);
