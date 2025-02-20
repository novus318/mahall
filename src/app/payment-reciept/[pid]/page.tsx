'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

interface PageProps {
  params: {
    pid: string
  }
}

const CollectionsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Skeleton className="h-8 w-1/4 mb-2" />
      </div>

      <div className="hidden md:flex mb-4 space-x-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>


      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <Skeleton className="h-6 w-1/4" />

            <div className="w-1/4">
              <Skeleton className="h-6 w-full mb-1" />
              <Skeleton className="h-2 w-3/4" />
            </div>

            <Skeleton className="h-6 w-1/4 rounded-full" />

            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

Font.register({
  family: 'AnekMalayalam',
  src: '/AnekMalayalam.ttf', // Standard weight
  fontWeight: 'normal',
});


const PageComponent = ({ params }: PageProps) => {
  const router = useRouter()
  const { pid } = params
  const [collections, setCollections] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const formatDate = (collection: any) => {
    if (collection?.status === 'Paid') {
      return {
        dayMonthYear: format(collection?.PaymentDate, 'dd MMM yyyy'),
        time: format(collection?.PaymentDate, 'hh:mm a'),
      };
    } else {
      return {
        dayMonthYear: 'payment',
        time: 'pending',
      };
    }
  };


  useEffect(() => {
    fetchCollection()
  }, [])
  const fetchCollection = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/kudi-collections/${pid}`)
      if (response.data.success) {
        setCollections(response.data.collections)
        setLoading(false)
      }
    } catch (error: any) {
      toast({
        title: 'Failed to fetch collection',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }
  const formatDaterec = (dateString: any) => {
    return {
      dayMonthYear: format(dateString, 'dd MMM yyyy'),
      day: format(dateString, 'EEEE'),
    };
  };

  const handlePayNowClick = async (c: any) => {
    router.push(`/pay/${c?.receiptNumber}`)
  }

  const handleReceiptClick = async (collection: any) => {
    const { dayMonthYear, day } = formatDaterec(collection?.PaymentDate);
  
    const renderPartialPayments = () => {
      if (collection?.paymentType === 'yearly' && collection.partialPayments?.length > 0) {
        return (
          <View style={styles.partialPaymentsSection}>
            <Text style={styles.partialPaymentsHeading}>Partial Payments:</Text>
            {collection.partialPayments.map((payment: any, index: number) => (
              <View key={index} style={styles.partialPaymentRow}>
                <Text style={styles.partialPaymentText}>
                  Paid: ₹{payment.amount.toFixed(2)} on {format(new Date(payment?.paymentDate ? payment?.paymentDate : new Date), 'dd MMM yyyy')}
                </Text>
                {payment?.receiptNumber && (
                  <Text style={styles.partialPaymentReceipt}>Receipt No: {payment.receiptNumber}</Text>
                )}
              </View>
            ))}
          </View>
        );
      }
      return null;
    };
  
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
  
          {renderPartialPayments()}
  
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
     partialPaymentsSection: {
    marginTop: 10,
  },
  partialPaymentsHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  partialPaymentRow: {
    marginBottom: 4,
  },
  partialPaymentText: {
    fontSize: 9,
    color: '#333',
  },
  partialPaymentDescription: {
    fontSize: 8,
    color: '#555',
    marginLeft: 10,
  },
  partialPaymentReceipt: {
    fontSize: 8,
    color: '#555',
    marginLeft: 10,
  }
  });

  if (loading) return <CollectionsSkeleton />;
  return (
    <div className="container mx-auto p-2">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl md:text-3xl font-semibold text-gray-800">
          Tuition Fees of {collections ? collections[0]?.memberId?.name : ''}
        </h2>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <Table className="w-full text-xs md:text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium text-gray-600 py-3">Date</TableHead>
              <TableHead className="font-medium text-gray-600 py-3">Amount</TableHead>
              <TableHead className="font-medium text-gray-600 py-3">Status</TableHead>
              <TableHead className="font-medium text-gray-600 py-3">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections?.map((collection: any) => (
              <>
                <TableRow key={collection._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-3 text-gray-700">
                    {collection?.paymentType === 'monthly' ? collection?.collectionMonth : collection?.paidYear}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-800">₹{collection.amount.toFixed(2)}</div>
                      {collection.status === 'Partial' && (
                        <>
                          <Progress
                            value={(collection.paidAmount! / collection.amount) * 100}
                            className="h-2 bg-gray-200"
                          />
                          <div className="text-xs text-gray-500">
                            Paid: ₹{collection.paidAmount!.toFixed(2)}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${collection.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : collection.status === 'Partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {collection.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Button
                      className={`w-24 text-sm font-medium ${collection?.status === 'Unpaid'
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          : collection?.status === 'Rejected'
                            ? 'bg-red-100 text-red-700 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        } rounded-md transition-colors`}
                      size="sm"
                      disabled={collection?.status === 'Rejected'}
                      onClick={() => {
                        if (collection?.status === 'Paid') {
                          handleReceiptClick(collection);
                        } else if (collection?.status === 'Unpaid' || 'Partial') {
                          handlePayNowClick(collection);
                        }
                      }}
                    >
                      {collection?.status === 'Unpaid' && 'Pay Now'}
                      {collection?.status === 'Partial' && 'Pay Now'}
                      {collection?.status === 'Paid' && 'Receipt'}
                      {collection?.status === 'Rejected' && 'Rejected'}
                    </Button>
                  </TableCell>
                </TableRow>
                {collection?.paymentType === 'yearly' && collection.partialPayments?.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-3">
                      <div className="space-y-2">
                        {collection?.partialPayments?.map((payment: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600 gap-4">
                            <div>
                              <p className="font-medium">₹{payment.amount.toFixed(2)}</p>
                              {/* <p className="mx-2">•</p> */}
                              <p className="text-xs">
                                {format(new Date(payment?.paymentDate ? payment?.paymentDate : new Date()), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              {payment?.description && <p className='text-xs'>{payment.description}</p>}
                              {payment?.receiptNumber && (
                                <p className="text-gray-500 text-xs font-medium">Receipt: {payment.receiptNumber}</p>
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
            {collections?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                  <h4 className="text-lg font-semibold">No Collections Found</h4>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PageComponent
