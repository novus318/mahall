'use client'
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast';


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
const RecieptPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [reciepts, setreciepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReciepts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/reciept/get-reciepts`);
     if(response.data.success){
      setreciepts(response.data.reciepts)
      setLoading(false);
     }
    } catch (err) {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReciepts();
  }, []);

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };
  const formatDaterec = (dateString: any) => {
    return {
      dayMonthYear: format(dateString, 'dd MMM yyyy'),
      day: format(dateString, 'EEEE'),
    };
  };
const handleReceiptClick = async (collection: any) => {
    const { dayMonthYear, day } = formatDaterec(collection?.updatedAt);
    const doc = (
      <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.organization}>Vellap Mahal</Text>
          <Text style={styles.contact}>Juma masjid, vellap, thrikkaripur</Text>
          <Text style={styles.contact}>Phone: +91 9876543210</Text>
        </View>

        <View style={styles.dateSection}>
          <View>
            <Text style={styles.dateText}>Date: {dayMonthYear}</Text>
            <Text style={styles.dateText}>Day: {day}</Text>
          </View>
          <Text style={styles.receiptNumber}>Receipt No: {collection?.receiptNumber}</Text>
        </View>

        <View style={styles.details}>
          <Text>Details:</Text>
        </View>

        <View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>Description</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>{collection?.description}</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>{collection?.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>Total</Text>
            <Text style={[styles.tableCell, styles.amountCell, styles.total]}>Rs.{collection?.amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

        <View style={styles.regards}>
          <Text>Regards,</Text>
          <Text>VKIJ</Text>
        </View>
      </Page>
    </Document>
    );

    const blob = await pdf(doc).toBlob();
    saveAs(blob, 'receipt.pdf');
  };
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
    },
    organization: {
      fontSize: 20,
      fontWeight: 'extrabold',
    },
    contact: {
      color: '#333',
      fontSize: 10,
      marginBottom: 4,
    },
    dateSection: {
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateText: {
      fontSize: 12,
    },
    receiptNumber: {
      fontSize: 9,
      textAlign: 'right',
    },
    details: {
      fontSize:15,
      marginBottom: 15,
    },
    table: {
      width: '100%',
      borderRadius: 5,
      border: '1px solid #ccc',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1px solid #ccc',
      overflow: 'hidden',
    },
    tableCell: {
      padding: 10,
      fontSize: 9,
    },
    descriptionCell: {
      width: '80%',
    },
    amountCell: {
      width: '20%',
      textAlign: 'right',
    },
    total: {
      fontSize: 10,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    regards: {
      marginTop: 20,
      textAlign: 'left',
      fontSize: 10,
    },
  });


 const isCurrentMonth = (date:any) => {
    const receiptDate = new Date(date);
    const today = new Date();
    return receiptDate.getMonth() === today.getMonth() && receiptDate.getFullYear() === today.getFullYear();
  };
  

  const handleReject = async (Id: string) => {
    const isConfirmed = window.confirm('Are you sure you want to reject this reciept?');

    if (!isConfirmed) return; 
    try {
      setLoading(true)
      const response = await axios.put(`${apiUrl}/api/reciept/reject-reciept/${Id}`);
    if(response.data.success){
      fetchReciepts()
      setLoading(false)
    }
    } catch (error:any) {
      setLoading(false)
      toast({
        title: 'Error',
        description: error?.response?.data?.error || error.response?.data?.message || error.message  || 'An error occurred while trying to update the payment. Please try again later.',
        variant:'destructive'
      })
    }
  };
  if (loading) return <RecentrecieptSkeleton />;
  return (
    <div className='w-full py-5 px-2'>
      <Link href='/reciept' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
        Back
      </Link>
      <div className='max-w-6xl m-auto my-3'>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent payments</h2>
        </div>
        <div className='rounded-t-md bg-gray-100 p-1'>
          <Table className="bg-white">
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Receipt No.</TableHead>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">From</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reciepts.map((reciept) => {
                const { dayMonthYear, time } = formatDate(reciept?.date);
                const isCurrent = isCurrentMonth(reciept?.date); // Check if receipt date is in the current month
                return (
                  <TableRow
                    key={reciept?._id}
                    className={`${reciept?.status === 'Rejected' ? 'bg-red-100' : ''}`} // Highlight rejected receipts in red
                  >
                    <TableCell>
                      <div className='text-sm'>{dayMonthYear}</div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{reciept?.receiptNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{reciept?.categoryId.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{reciept?.memberId ? reciept?.memberId?.name : reciept?.otherRecipient?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>₹{(reciept?.amount).toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      {reciept?.status === 'Rejected' ? (
                        <Button size="sm" disabled className="bg-red-200">Rejected</Button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button
                            className={` ${reciept?.status === 'Pending' ? 'bg-gray-200': ''}`}
                            size="sm"
                            disabled={reciept?.status === 'Pending'}
                            onClick={() => {
                              if (reciept?.status === 'Completed') {
                                handleReceiptClick(reciept);
                              }
                            }}
                          >
                            {reciept?.status === 'Completed' && 'Receipt'}
                            {reciept?.status === 'Pending' && 'Pending'}
                          </Button>
                          {isCurrent && reciept?.status === 'Completed' && (
                            <>
                              <Link href={`/reciept/edit/${reciept?._id}`} className='text-white bg-gray-950 py-2 px-3 rounded-md hover:underline'>
                          Edit
                        </Link>
                              <Button className="bg-red-500 text-white" size="sm" onClick={() => handleReject(reciept?._id)}>Reject</Button>
                            </>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {reciepts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-600 text-sm">
                    <h4 className="text-lg font-bold">No receipts...</h4>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default withAuth(RecieptPage)
