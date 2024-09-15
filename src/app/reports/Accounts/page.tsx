'use client'
import DatePicker from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format, isValid, startOfMonth } from 'date-fns';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Link from 'next/link';



  Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
  });
  const TransactionsSkeleton: React.FC = () => {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  };
const TransactionPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [transactions, setTransactions] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [btloading, setBtLoading] = useState(false);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);

    useEffect(() => {
        fetchInitialTransactions();
      }, []);

      const fetchInitialTransactions = async () => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);
        try {
          const data:any ={
            fromDate:firstDayOfMonth,
            toDate:now
          }
          const response = await axios.get(`${apiUrl}/api/transactions/recent/transactions/byDate`,{params: data});
          if(response.data.success){
            setTransactions(response.data.statement)
            setBtLoading(false);
            setFromDate(response.data.statement.from)
            setToDate(response.data.statement.to)
            setLoading(false)
            toast({
              title: "Transactions fetched successfully.",
              variant: "default",
            });
          }
        } catch (error:any) {
          toast({
            title: "Failed to fetch transactions.",
            description: error.response?.data?.message || error.message || 'something went wrong',
            variant: "destructive",
          })
        } finally {
          setBtLoading(false);
        }
      }

      const fetchTransactions = async () => {
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
            fromDate,
            toDate
          }
          const response = await axios.get(`${apiUrl}/api/transactions/recent/transactions/byDate`,{params: data});
          if(response.data.success){
            setTransactions(response.data.statement)
            setBtLoading(false);
            setFromDate(null)
            setToDate(null)
            setLoading(false)
            toast({
              title: "Transactions fetched successfully.",
              variant: "default",
            });
          }
        } catch (error:any) {
          toast({
            title: "Failed to fetch transactions.",
            description: error.response?.data?.message || error.message || 'something went wrong',
            variant: "destructive",
          })
        } finally {
          setBtLoading(false);
        }
      };
      const formatDate = (dateString:any) => {
        const date = new Date(dateString);
        return {
          dayMonthYear: format(date, 'dd MMM yyyy'),
          time: format(date, 'hh:mm a'),
          day: format(date, 'EEEE'),
        };
      };
      
      const formatAmount = (amount:any, type:any) => {
        return type === 'Credit' ? `+${amount}` : `-${amount}`;
      };
      
      const handleReceiptClick = async (data: any) => {
        const doc = (
          <Document>
            <Page size="A4" style={styles.page}>
              {/* Header Section */}
              <View style={styles.header}>
                <Image src='/VKJ.jpeg' style={styles.logo} />
                <Text style={styles.masjidName}>Juma Masjid, Vellap, Thrikkaripur</Text>
                <Text style={styles.contact}>Phone: +91 9876543210</Text>
                <View style={styles.separator} />
              </View>
      
              {/* Accounts Table Section */}
              <View style={styles.accountsContainer}>
                {/* Opening Accounts */}
                <View style={styles.accountSection}>
                  <Text style={styles.sectionTitle}>From : {formatDate(data.from).dayMonthYear}</Text>
                  <Text style={styles.sectionSubTitle}>Opening Accounts</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderCell}>Account Name</Text>
                      <Text style={styles.tableHeaderCell}>Opening Balance</Text>
                    </View>
                    {data.OpeningAccounts?.map((account: any) => (
                      <View key={account?.accountId} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{account?.accountName}</Text>
                        <Text style={styles.tableCell}>₹{account?.openingBalance.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
      
                {/* Closing Accounts */}
                <View style={styles.accountSection}>
                  <Text style={styles.sectionTitle}>To : {formatDate(data.to).dayMonthYear}</Text>
                  <Text style={styles.sectionSubTitle}>Closing Accounts</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderCell}>Account Name</Text>
                      <Text style={styles.tableHeaderCell}>Closing Balance</Text>
                    </View>
                    {data.ClosingAccounts?.map((account: any) => (
                      <View key={account?.accountId} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{account?.accountName}</Text>
                        <Text style={styles.tableCell}>₹{account?.closingBalance.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
      
              {/* Transaction List */}
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionTextHeader}>Date</Text>
                <Text style={styles.transactionTextHeader}>Category</Text>
                <Text style={styles.transactionTextHeader}>Account</Text>
                <Text style={styles.transactionTextHeaderAmount}>Debit</Text>
                <Text style={styles.transactionTextHeaderAmount}>Credit</Text>
                <Text style={styles.transactionTextHeaderAmount}>Balance</Text>
              </View>
      
              {data.transactions.map((transaction: any, index: number) => (
                <View key={index} style={styles.transactionRow}>
                  <Text style={styles.transactionText}>{formatDate(transaction?.date).dayMonthYear}</Text>
                  <Text style={styles.transactionText}>{transaction?.category}</Text>
                  <Text style={styles.transactionText}>{transaction?.accountName}</Text>
                  <Text style={styles.transactionAmount}>
                    {transaction?.type === 'Debit' ? `₹${transaction?.amount.toFixed(2)}` : '-'}
                  </Text>
                  <Text style={styles.transactionAmount}>
                    {transaction?.type === 'Credit' ? `₹${transaction?.amount.toFixed(2)}` : '-'}
                  </Text>
                  <Text style={styles.transactionAmount}>₹{(transaction?.Balance || 0)?.toFixed(2)}</Text>
                </View>
              ))}
            </Page>
          </Document>
        );
      
        const blob = await pdf(doc).toBlob();
        saveAs(blob, 'statement.pdf');
      };
      
      const styles = StyleSheet.create({
        page: {
          padding: 30,
          fontFamily: 'Roboto',
          fontSize: 12,
          lineHeight: 1.6,
          color: '#333',
        },
        header: {
          textAlign: 'center',
          marginBottom: 10,
        },
        logo: {
          width: 80,
          height: 80,
          alignSelf: 'center',
        },
        masjidName: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000',
          marginTop: 10,
        },
        contact: {
          fontSize: 12,
          color: '#555',
          marginTop: 5,
        },
        separator: {
          borderBottomWidth: 2,
          borderBottomColor: '#E5E7EB',
          marginVertical: 10,
        },
        sectionTitle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#444',
          marginBottom: 5,
        },
        sectionSubTitle: {
          fontSize: 12,
          color: '#666',
          marginBottom: 5,
        },
        period: {
          fontSize: 12,
          color: '#333',
        },
        accountsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        accountSection: {
          width: '48%',
        },
        table: {
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 4,
        },
        tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#F3F4F6',
          padding: 5,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        tableHeaderCell: {
          flex: 1,
          fontSize: 12,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#444',
        },
        tableRow: {
          flexDirection: 'row',
          padding: 5,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        tableCell: {
          flex: 1,
          fontSize: 12,
          textAlign: 'center',
          color: '#333',
        },
        transactionsHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          paddingBottom: 5,
          marginTop: 20,
        },
        transactionTextHeader: {
          fontSize: 12,
          fontWeight: 'bold',
          width: '20%',
          color: '#000',
        },
        transactionTextHeaderAmount: {
          fontSize: 12,
          fontWeight: 'bold',
          width: '20%',
          color: '#000',
          textAlign: 'right'
        },
        transactionRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        },
        transactionText: {
          fontSize: 11,
          width: '20%',
          color: '#333',
        },
        transactionAmount: {

          fontSize: 11,
          width: '20%',
          color: '#333',
          textAlign: 'right'
        },
      });
      
      
      

      
      if (loading) return <TransactionsSkeleton />;
  return (
  <div className='w-full py-5 px-2'>
    <Link href='/reports' className='bg-gray-900 text-white text-base font-medium py-2 px-3 rounded-md'>
    Back</Link>
      <div className='max-w-6xl m-auto my-5'>
        <div>
            <h2 className="text-2xl font-semibold mb-4">Transactions From {formatDate(transactions?.from).dayMonthYear ? formatDate(transactions?.from).dayMonthYear : 'Invalid date'} - To {formatDate(transactions?.to).dayMonthYear ? formatDate(transactions?.to).dayMonthYear : 'Invalid date'}</h2>
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
 <div className='md:pt-4'>
        <Button
        size='sm'
          onClick={fetchTransactions}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {btloading ? <Loader2 className='animate-spin h-5'/> : "Get Transactions"}
        </Button>
      </div>
      <div className='md:pt-4'>
        <Button
        size='sm'
          onClick={
            ()=>handleReceiptClick(transactions)
          }
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
      <TableHead className="font-medium">Description</TableHead>
      <TableHead className="font-medium">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions?.transactions?.map((transaction:any) => {
      const { dayMonthYear, time } = formatDate(transaction?.date);
      const formattedAmount = formatAmount(transaction?.amount, transaction?.type);
      return (
        <TableRow key={transaction._id}>
          <TableCell>
            <div className='text-sm'>{dayMonthYear}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </TableCell>
          <TableCell className='text-xs'>{transaction?.description}</TableCell>
          <TableCell className={transaction?.type === 'Credit' ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
            {formattedAmount}
          </TableCell>
        </TableRow>
      );
    })}
    {transactions.length === 0 && (
        <TableCell colSpan={3} className="text-center text-gray-600 text-sm">
          <h4 className="text-lg font-bold">No transactions...</h4>
        </TableCell>
        )}
  </TableBody>
</Table>
   </div>
    </div>
  </div>
  )
}

export default withAuth(TransactionPage)