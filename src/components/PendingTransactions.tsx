'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import axios from 'axios'
import { toast } from './ui/use-toast'
import { format } from 'date-fns'
import UpdateCollectionPayment from './UpdateCollectionPayment';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';


interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary: boolean;
}

Font.register({
  family: 'AnekMalayalam',
  src: '/AnekMalayalam.ttf'
});

const PendingTransactions = ({ id, totalCollections }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [collections, setCollections] = useState<any>([])
  const [bank, setBank] = useState<BankAccount[]>([]);

  useEffect(() => {
    fetchCollection(id);
    fetchAccounts();
  }, [id]);

  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`)
      .then(response => setBank(response.data.data))
      .catch(error => console.log("Error fetching accounts:", error));
  };
  const fetchCollection = async (pid: any) => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/kudi-collections/${pid}`)
      if (response.data.success) {
        setCollections(response.data.collections)
        totalCollections((response.data.totalCollections).toFixed(2))
      }
    } catch (error: any) {
      toast({
        title: 'Failed to fetch collection',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive'
      })
    }
  }

  const formatDate = (collection: any) => {
    if (collection?.status === 'Paid') {
      return {
        dayMonthYear: format(collection?.PaymentDate, 'dd MMM yyyy'),
        time: format(collection?.PaymentDate, 'hh:mm a'),
      };
    } else if (collection?.status === 'Rejected') {
      return {
        dayMonthYear: 'payment',
        time: 'recjected',
      };
    } else {
      return {
        dayMonthYear: 'payment',
        time: 'pending',
      };
    }
  };
  const formatDaterec = (dateString: any) => {
    return {
      dayMonthYear: format(dateString, 'dd MMM yyyy'),
      day: format(dateString, 'EEEE'),
    };
  };



  const handleReceiptClick = async (collection: any) => {
    const { dayMonthYear, day } = formatDaterec(collection?.PaymentDate);
    const doc = (
      <Document>
        <Page size="A5" style={styles.page}>
          <View style={styles.header}>
            <Image src='/vkgclean.png' style={styles.logo} />
            <Text style={styles.headerText}>Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA</Text>
            <Text style={styles.headerText}>VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST</Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
            <View style={styles.separator} />
          </View>


          <View style={styles.dateSection}>
            <View>
              <Text style={styles.dateText}>Date: {dayMonthYear}</Text>
              <Text style={styles.dateText}>Day: {day}</Text>
            </View>
            <Text style={styles.receiptNumber}>Receipt No: {collection?.receiptNumber}</Text>
          </View>
          <View style={styles.fromSection}>
            <Text style={styles.fromText}>From: {collection?.memberId?.name}</Text>
            <Text style={styles.fromText}>House: {collection?.houseId?.number}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.detailsHeading}>Details:</Text>
          </View>

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
              <Text style={[styles.tableCell, styles.amountCell, styles.total]}>₹{collection?.amount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.regards}>
            <Text>Regards,</Text>
            <Text>VKJ</Text>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    saveAs(blob, `Receipt-${collection?.receiptNumber}-${dayMonthYear} for ${collection?.houseId?.number}.pdf`);
  };
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: 'AnekMalayalam',
      fontSize: 10, // Ensure smaller size for A5
    },
    header: {
      textAlign: 'center',
      marginBottom: 10,
    },
    headerText: {
      fontSize: 10,
      marginBottom: 4,
    },
    logo: {
      width: 60,
      height: 60,
      alignSelf: 'center',
    },
    masjidName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 8,
    },
    contact: {
      fontSize: 10,
      color: '#555',
      marginTop: 3,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      marginVertical: 8,
    },
    fromSection: {
      marginBottom: 10,
      textAlign: 'left',
    },
    fromText: {
      fontSize: 12,
      color: '#333',
    },
    dateSection: {
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateText: {
      fontSize: 10,
    },
    receiptNumber: {
      fontSize: 10,
      textAlign: 'right',
    },
    details: {
      fontSize: 12,
      marginBottom: 8,
    },
    detailsHeading: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    table: {
      width: '100%',
      borderRadius: 5,
      border: '1px solid #ccc',
      marginBottom: 15,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1px solid #ccc',
    },
    tableCell: {
      padding: 6,
      fontSize: 9,
    },
    descriptionCell: {
      width: '75%',
    },
    amountCell: {
      width: '25%',
      textAlign: 'right',
    },
    total: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    regards: {
      marginTop: 15,
      fontSize: 10,
    },
  });


  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Description</TableHead>
              <TableHead className="font-medium">Amount</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Reciept</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections?.map((collection: any) => {
              return (
                <>
                  <TableRow key={collection._id}>
                    <TableCell>{collection?.paymentType === 'monthly' ? collection?.collectionMonth : collection?.paidYear}
                      <span
                        className={`ms-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${collection?.paymentType === 'monthly'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                          }`}
                      >
                        {collection?.paymentType}
                      </span>
                    </TableCell>
                    <TableCell>
                      {collection?.description} {collection?.status === 'Rejected' && `Was rejected due to ${collection?.rejectionReason}`}
                    </TableCell>
                    <TableCell>
                      ₹{collection?.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${collection.status === 'Paid'
                        ? 'bg-green-50 text-green-700'
                        : collection.status === 'Partial'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                        }`}>
                        {collection.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {collection?.status === 'Paid' ? (
                        <Button size='sm'
                          className="font-bold py-2 px-4 rounded-md" onClick={() => handleReceiptClick(collection)}>
                          Receipt
                        </Button>
                      ) : collection?.status === 'Unpaid' ? (
                        <UpdateCollectionPayment collection={collection} bank={bank} />
                      ) : (
                        <div
                          className="bg-red-200 text-red-500 px-2 py-1 rounded-md">
                          Rejected
                        </div>
                      )}
                    </TableCell>

                  </TableRow>
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
                                  {format(new Date(payment?.PaymentDate ? payment?.PaymentDate : new Date()), 'MMM dd, yyyy')}
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
              );
            })}
            {collections?.length === 0 && (
              <TableCell colSpan={3} className="text-center text-gray-600 text-sm">
                <h4 className="text-lg font-bold">No Collections...</h4>
              </TableCell>
            )
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default PendingTransactions
