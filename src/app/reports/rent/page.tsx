'use client'
import DatePicker from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { withAuth } from '@/components/withAuth';
import { format, startOfMonth } from 'date-fns';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

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

const RentPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [btloading, setBtLoading] = useState(false);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]); // Filtered collections state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [buildingFilter, setBuildingFilter] = useState<any>('');
  const [roomFilter, setRoomFilter] = useState<any>('');

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

      if (buildingFilter) {
        data = data.filter((collection: any) => collection.buildingName === buildingFilter);
      }

      if (roomFilter) {
        data = data.filter((collection: any) => collection.roomNumber === roomFilter);
      }

      setFilteredCollections(data);
    };

    applyFilters();
  }, [collections, statusFilter, buildingFilter, roomFilter]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString || new Date());
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

      const response = await axios.get(`${apiUrl}/api/reports/rent-collections/excel`, {
        params: data,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rent-Collections-${formatDate(fromDate).dayMonthYear}-to-${formatDate(toDate).dayMonthYear}.xlsx`;
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

  const handleReceiptClick = async (data: any) => {
    const totalAmount = data.reduce((acc: number, collection: any) => acc + collection.amount, 0);
    const totalCollections = data.length;
    const doc = (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
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
            <Text style={styles.summaryText}>Total Amount: {formatCurrency(totalAmount)}</Text>
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
              <Text style={[styles.tableCell, styles.headerCell]}>Rent</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Deductions</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Due Amount</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Paid Amount</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Pay Date</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Account</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Status</Text>
            </View>

            {/* Table Data */}
            {data.map((collection: any, index: number) => (
              <View key={index}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{collection.buildingName}</Text>
                  <Text style={styles.tableCell}>{collection.roomNumber}</Text>
                  <Text style={styles.tableCell}>{collection.tenantName}</Text>
                  <Text style={styles.tableCell}>{collection.period}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(collection.amount)}</Text>
                  <Text style={styles.tableCell}>{collection?.onleave?.deductAmount || 0}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(collection.PaymentAmount && collection.PaymentAmount > 0
                    ? collection.PaymentAmount
                    : collection?.amount)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency((collection?.PaymentAmount || collection?.amount) - collection?.paidAmount)}</Text>
                  <Text style={styles.tableCell}>{
                    collection?.status === 'Partial' ?
                    `Paid: ₹${collection?.paidAmount?.toFixed(2)}`
                    :
                    `${collection?.paidAmount}`
                    }</Text>
                  <Text style={styles.tableCell}>{collection.paymentDate ? format(new Date(collection.paymentDate), 'dd MMM yyyy') : 'Pending'}</Text>
                  <Text style={styles.tableCell}>
                    {collection?.accountDetails ? 
                      `${collection.accountDetails.name}${collection.accountDetails.holderName ? `\n${collection.accountDetails.holderName}` : ''}`
                      : '-'
                    }
                  </Text>
                  <Text style={styles.tableCell}>{collection?.status}</Text>
                </View>
                {collection?.partialPayments?.length > 0 && (
                  <View style={[styles.tableRow, styles.partialPaymentsRow]}>
                    <Text style={[styles.tableCell, styles.partialPaymentsCell]}>
                      {collection.partialPayments.map((payment: any, pIndex: number) => (
                        <Text key={pIndex} style={styles.partialPaymentText}>
                          {`Paid: ₹${payment.amount.toFixed(2)} • ${format(new Date(payment?.paymentDate ? payment?.paymentDate : new Date()), 'MMM dd, yyyy')}`}
                          {payment?.description ? ` • ${payment.description}` : ''}
                          {payment?.receiptNumber ? ` • Receipt: ${payment.receiptNumber}` : ''}
                          {'\n'}
                        </Text>
                      ))}
                    </Text>
                  </View>
                )}
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
      padding: 10,
      fontFamily: 'AnekMalayalam',
      fontSize: 11,
      color: '#333',
      lineHeight: 1.5,
      orientation: 'landscape',
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
    partialPaymentsRow: {
      backgroundColor: '#F9FAFB',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    partialPaymentsCell: {
      flex: 12,
      textAlign: 'left',
      paddingLeft: 20,
      fontSize: 9,
      color: '#6B7280',
    },
    partialPaymentText: {
      marginBottom: 2,
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
          <div>
            <p className="text-sm font-medium">From Date</p>
            <DatePicker date={fromDate} setDate={setFromDate} />
          </div>
          <div>
            <p className="text-sm font-medium">To Date</p>
            <DatePicker date={toDate} setDate={setToDate} />
          </div>

          <div>
            <p className="text-sm font-medium">Filter by Status</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 bg-white rounded-sm text-sm w-full"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-medium">Filter by Building</p>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="p-2 border border-gray-300 bg-white rounded-sm text-sm w-full"
            >
              <option value="">All</option>
              {Array.from(new Set(collections.map((collection: any) => collection.buildingName))).map((building: string) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium">Filter by Room No</p>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="p-2 border border-gray-300 bg-white rounded-sm text-sm w-full"
            >
              <option value="">All</option>
              {Array.from(new Set(collections.map((collection: any) => collection.roomNumber))).map((room: string) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          <div className="md:pt-4 col-span-2 md:col-span-1">
            <Button size="sm" onClick={fetchCollections} disabled={loading} className="w-full md:w-auto">
              {btloading ? <Loader2 className="animate-spin h-5" /> : 'Get collections'}
            </Button>
          </div>
          <div className="md:pt-4 col-span-2 md:col-span-1">
            <Button size="sm" onClick={() => handleReceiptClick(filteredCollections)} className="w-full md:w-auto">
              Print
            </Button>
          </div>
          <div className="md:pt-4 col-span-2 md:col-span-1">
            <Button size="sm" onClick={handleExcelDownload} variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Excel
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
                <TableHead>Rent</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="font-semibold">Due Amount</TableHead>
                <TableHead className="font-semibold">Paid Amount</TableHead>
                <TableHead className="font-medium">Pay Date</TableHead>
                <TableHead className="font-medium">Account</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections?.map((collection: any, index: number) => (
                <>
                  <TableRow key={collection?._id}>
                    <TableCell>{collection.buildingName}</TableCell>
                    <TableCell>{collection.roomNumber}</TableCell>
                    <TableCell>{collection.tenantName}</TableCell>
                    <TableCell>{collection.period}</TableCell>
                    <TableCell>{collection.amount}</TableCell>
                    <TableCell>{collection?.onleave?.deductAmount || 0}</TableCell>
                    <TableCell>{formatCurrency(collection.PaymentAmount && collection.PaymentAmount > 0
                      ? collection.PaymentAmount
                      : collection?.amount)}</TableCell>
                    <TableCell>{formatCurrency((collection?.PaymentAmount || collection?.amount) - collection?.paidAmount)}</TableCell>
                    <TableCell>
                      {collection?.status === 'Partial' ?
                        (
                          <>
                            <Progress
                              value={(collection?.paidAmount! / collection.PaymentAmount) * 100}
                              className="h-2 rounded-lg"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              Paid: ₹{collection?.paidAmount?.toFixed(2)}
                            </div>
                          </>
                        ) :
                        collection?.paidAmount}
                    </TableCell>
                    <TableCell>{collection.paymentDate ? format(new Date(collection.paymentDate), 'dd MMM yyyy') : 'Pending'}</TableCell>
                    <TableCell>
                      {collection?.accountDetails ? (
                        <div className="text-xs">
                          <div>{collection.accountDetails.name}</div>
                          {collection.accountDetails.holderName && (
                            <div className="text-gray-500">{collection.accountDetails.holderName}</div>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{collection?.status}</TableCell>
                  </TableRow>
                  {collection?.partialPayments?.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="py-3">
                        <div className="pl-6 space-y-2">
                          {collection?.partialPayments.map((payment: any, index: number) => (
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
                </>
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
