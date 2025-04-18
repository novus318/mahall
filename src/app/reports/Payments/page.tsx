'use client'
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format, startOfMonth } from 'date-fns';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import DatePicker from '@/components/DatePicker';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

Font.register({
  family: 'AnekMalayalam',
  src: '/AnekMalayalam.ttf'
});
const RecentrecieptSkeleton: React.FC = () => {

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Recent reciepts</h2>
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
};
const PaymentPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [btloading, setBtLoading] = useState(false);
const [fromDate, setFromDate] = useState<any>(null);
const [toDate, setToDate] = useState<any>(null);
const [selectedCategory, setSelectedCategory] = useState('');
const [categories,setCategories] =useState<any>([])

const filteredPayments = selectedCategory
  ? payments.filter((payment) => payment?.categoryId?.name === selectedCategory)
  : payments;



  const fetchPayCategories = () => {
    axios.get(`${apiUrl}/api/pay/category/all`).then(response => {
      setCategories(response.data.categories)
    })
      .catch(error => {
        console.log("Error fetching pay categories:", error)
      })
  }

const fetchInitialPayments = async () => {
  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  try {
    const data:any ={
      startDate:firstDayOfMonth,
      endDate:now
    }
    const response = await axios.get(`${apiUrl}/api/reports/get/payment/byDate`,{params: data});
   if(response.data.success){
    setPayments(response.data.payments)
    setFromDate(firstDayOfMonth)
    setToDate(now)
    setLoading(false);
   }
  } catch (error:any) {
    setLoading(false);
    toast({
      title: "Failed to fetch transactions.",
      description: error.response?.data?.message || error.message || 'something went wrong',
      variant: "destructive",
    })
  }
};
  const fetchPayments = async () => {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 0, 0);
    if (!fromDate || !toDate) {
      toast({
        title: 'Please select a date range.',
        variant: 'destructive'
      });
      return;
    }
    if (new Date(toDate) > currentDate) {
      toast({
        title: "To Date cannot be in the future.",
        variant: "destructive",
      });
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast({
        title: "From Date cannot be after To Date.",
        variant: "destructive",
      });
      return;
    }
    if(btloading) return;
    setBtLoading(true);
    try {
      const data:any ={
        startDate:fromDate,
        endDate:toDate
      }
      const response = await axios.get(`${apiUrl}/api/reports/get/payment/byDate`,{params: data});
     if(response.data.success){
      setPayments(response.data.payments)
      setBtLoading(false);
      toast({
        title: "Reciepts fetched successfully.",
        variant: "default",
      })
     }
    } catch (err:any) {
      setBtLoading(false);
      toast({
        title: "Failed to fetch Reciepts.",
        description: err.response?.data?.message || err.message || 'something went wrong',
        variant: "destructive",
      })
    }
  };
  
  useEffect(() => {
    fetchInitialPayments();
    fetchPayCategories();
  }, []);

  const formatCurrency = (amount:any) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };

  const handleReceiptClick = async (data: any) => {
    const totalAmount = data.reduce((acc: number, receipt: any) => acc + receipt.total, 0);
    const totalPayments = data.length;
    const doc = (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image src="/vkgclean.png" style={styles.logo} />
            <Text style={styles.headerText}>Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA</Text>
            <Text style={styles.headerText}>VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST</Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
          </View>
          <Text style={styles.sectionTitle}>Payment Report</Text>
          <Text style={[styles.sectionTitle, { fontSize: 10, marginBottom: 12 }]}>
            From: {formatDate(fromDate).dayMonthYear} - To: {formatDate(toDate).dayMonthYear}
          </Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total Amount: {formatCurrency(totalAmount)}</Text>
            <Text style={styles.summaryText}>Total Payments: {totalPayments}</Text>
          </View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderItem, styles.dateColumn]}>Date</Text>
            <Text style={[styles.tableHeaderItem, styles.receiptColumn]}>Receipt No.</Text>
            <Text style={[styles.tableHeaderItem, styles.categoryColumn]}>Category</Text>
            <Text style={[styles.tableHeaderItem, styles.statusColumn]}>Status</Text>
            <Text style={[styles.tableHeaderItem, styles.fromColumn]}>To</Text>
            <Text style={[styles.tableHeaderItem, styles.amountColumn]}>Amount</Text>
            <Text style={[styles.tableHeaderItem, styles.accountDetailsColumn]}>Account</Text>
          </View>
  
          {/* Table Body */}
          {data?.map((receipt: any, index: number) => {
            const { dayMonthYear } = formatDate(receipt?.date);
            return (
              <View key={receipt?._id} style={styles.tableRow}>
                <Text style={[styles.tableItem, styles.dateColumn]}>{dayMonthYear}</Text>
                <Text style={[styles.tableItem, styles.receiptColumn]}>{receipt?.receiptNumber}</Text>
                <Text style={[styles.tableItem, styles.categoryColumn]}>{receipt?.categoryId?.name}</Text>
                <Text style={[styles.tableItem, styles.statusColumn]}>{receipt?.status}</Text>
                <Text style={[styles.tableItem, styles.fromColumn]}>
                  {receipt?.paymentTo}
                </Text>
                <Text style={[styles.tableItem, styles.amountColumn]}>
                  {formatCurrency(receipt?.total)}
                </Text>
                <Text style={[styles.tableItem, styles.accountDetailsColumn]}>
                  {receipt?.accountId?.name} ({receipt?.accountId?.holderName})
                </Text>
              </View>
            );
          })}
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    saveAs(blob, `Payments From ${formatDate(fromDate).dayMonthYear ? formatDate(fromDate).dayMonthYear : 'Invalid date'} - To ${formatDate(toDate).dayMonthYear ? formatDate(toDate).dayMonthYear : 'Invalid date'}.pdf`);
  };
  
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "AnekMalayalam",
      fontSize: 10,
      color: "#333",
      lineHeight: 1.4,
    },
    header: {
      textAlign: "center",
      marginBottom: 15,
      borderBottom: '1px solid #E5E7EB',
      paddingBottom: 10,
    },
    headerText: {
      fontSize: 9,
      marginBottom: 3,
      color: '#666',
    },
    summaryContainer: {
      marginBottom: 15,
      padding: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#F9F9F9',
      borderRadius: 4,
    },
    summaryText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'right',
      marginBottom: 3,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 8,
      alignSelf: "center",
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      marginVertical: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#444',
      marginBottom: 8,
      textAlign: 'center',
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      paddingBottom: 6,
      marginBottom: 8,
      backgroundColor: '#F3F4F6',
    },
    tableHeaderItem: {
      fontWeight: "bold",
      fontSize: 9,
      color: '#374151',
    },
    tableRow: {
      flexDirection: "row",
      marginBottom: 4,
      paddingBottom: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: '#E5E7EB',
    },
    tableItem: {
      fontSize: 9,
      color: '#4B5563',
    },
    dateColumn: {
      width: "10%",
      paddingRight: 4,
    },
    receiptColumn: {
      width: "8%",
      paddingRight: 4,
    },
    categoryColumn: {
      width: "12%",
      paddingRight: 4,
    },
    statusColumn: {
      width: "8%",
      paddingRight: 4,
    },
    accountColumn: {
      width: "15%",
      paddingRight: 4,
    },
    fromColumn: {
      width: "10%",
      paddingRight: 4,
    },
    amountColumn: {
      width: "15%",
      textAlign: "right",
      paddingRight: 4,
    },
    accountDetailsColumn: {
      textAlign: 'center',
      width: "22%",
      paddingRight: 4,
    },
  });
  
  


  if (loading) return <RecentrecieptSkeleton />;
  return (
    <div className='w-full py-5 px-2'>
      <Link href='/reports' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
        Back
      </Link>
      <div className='max-w-6xl m-auto my-3'>
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Payments From {formatDate(fromDate).dayMonthYear || 'Invalid date'} - To {formatDate(toDate).dayMonthYear || 'Invalid date'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-8 gap-3 md:gap-5 mb-2 items-center">
          <div className='md:col-span-2'>
            <p className="text-sm font-medium">From Date</p>
            <DatePicker date={fromDate} setDate={setFromDate} />
          </div>
          <div className='md:col-span-2'>
            <p className="text-sm font-medium">To Date</p>
            <DatePicker date={toDate} setDate={setToDate} />
          </div>
          <div className='md:col-span-2'>
            <p className="text-sm font-medium">Category</p>
            <select
              className='border border-gray-300 rounded-sm p-1 bg-white'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value=''>All Categories</option>
              {categories.map((category:any) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className='md:pt-4'>
            <Button
              size='sm'
              onClick={fetchPayments}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {btloading ? <Loader2 className='animate-spin h-5' /> : "Get Receipts"}
            </Button>
          </div>
          <div className='md:pt-4'>
            <Button
              size='sm'
              onClick={() => handleReceiptClick(filteredPayments)}
              className="w-full md:w-auto"
            >
              Print  
            </Button>
          </div>
        </div>
        <div className='rounded-t-md bg-gray-100 p-1'>
          <Table className="bg-white">
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Receipt No.</TableHead>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">To</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const { dayMonthYear, time } = formatDate(payment?.date);
                return (
                  <TableRow key={payment?._id}>
                    <TableCell>
                      <div className='text-sm'>{dayMonthYear}</div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.receiptNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.categoryId.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.status}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.paymentTo}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{formatCurrency(payment?.total)}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.accountId?.name} ({payment?.accountId?.holderName})</div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredPayments.length === 0 && (
                <TableCell colSpan={6} className="text-center text-gray-600 text-sm">
                  <h4 className="text-lg font-bold">No payments...</h4>
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default withAuth(PaymentPage)
