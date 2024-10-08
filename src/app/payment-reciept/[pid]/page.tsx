'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Document, Page, Text, View, StyleSheet, pdf, Font,Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';

interface PageProps {
    params: {
      pid: string
    }
  }

  const CollectionsSkeleton: React.FC = () => {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Collections</h2>
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

  Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
  });
const PageComponent = ({ params }: PageProps) => {
  const router = useRouter()
    const { pid } = params  
    const [collections,setCollections]=useState<any>([])
    const [loading, setLoading]=useState(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const formatDate = (collection:any) => {
      if(collection?.status === 'Paid'){
      return {
        dayMonthYear: format(collection?.PaymentDate, 'dd MMM yyyy'),
        time: format(collection?.PaymentDate, 'hh:mm a'),
      };
    }else{
      return {
        dayMonthYear: 'payment',
        time: 'pending',
      };
    }
    };


    useEffect(()=>{
        fetchCollection()
    },[])
    const fetchCollection=async ()=>{
      try {
        const response = await axios.get(`${apiUrl}/api/house/kudi-collections/${pid}`)
        if(response.data.success){
          setCollections(response.data.collections)
          setLoading(false)
        }
      } catch (error:any) {
        toast({
          title: 'Failed to fetch collection',
          description: error.response?.data?.message || error.message || 'Something went wrong',
          variant:'destructive'
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

    const handlePayNowClick =async(c:any)=>{
      router.push(`/pay/${c.houseId.number}/${c.amount}/${c.memberId.name}`)
    }
  
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
      saveAs(blob, 'receipt.pdf');
    };
    const styles = StyleSheet.create({
      page: {
        padding: 20,
        fontFamily: 'Roboto',
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

    if (loading) return <CollectionsSkeleton />;
  return (
    <div className="container mx-auto p-4">
       <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Tution Fees of {(collections ? collections[0]?.memberId?.name : '')}</h2>
      </div>
   <div className='rounded-t-md bg-gray-100 p-1'>
   <Table className="bg-white">
  <TableHeader className='bg-gray-100'>
    <TableRow>
      <TableHead className="font-medium">Date</TableHead>
      <TableHead className="font-medium">Amount</TableHead>
      <TableHead className="font-medium">Status</TableHead>
      <TableHead className="font-medium">Reciept</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {collections?.map((collection:any) => {
      const { dayMonthYear, time } = formatDate(collection);
      return (
        <TableRow key={collection._id}>
          <TableCell>
             <div className='text-sm'>{dayMonthYear}</div>
             <div className="text-xs text-gray-500">{time}</div>
          </TableCell>
          <TableCell>
          ₹{collection?.amount.toFixed(2)}
          </TableCell>
          <TableCell>{collection?.status}</TableCell>
          <TableCell>
  <Button
  className={`${collection?.status === 'Unpaid' ? 'bg-gray-200 text-gray-950': ''} ${collection?.status === 'Rejected' ? 'bg-red-500': ''}`}
    size="sm"
    disabled={collection?.status === 'Rejected'}
    onClick={() => {
      if (collection?.status === 'Paid') {
        handleReceiptClick(collection);
      } else if (collection?.status === 'Unpaid') {
        handlePayNowClick(collection); // Assume this is your function to handle payment
      }
    }}
  >
    {collection?.status === 'Unpaid' && 'Pay Now'}
    {collection?.status === 'Paid' && 'Receipt'}
    {collection?.status === 'Rejected' && 'Rejected'}
  </Button>
</TableCell>

        </TableRow>
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
   </div>
    </div>
  )
}

export default PageComponent
