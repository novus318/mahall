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
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import axios from 'axios'
import { toast } from './ui/use-toast'
import { format } from 'date-fns'
import UpdateCollectionPayment from './UpdateCollectionPayment';



const PendingTransactions = ({ id }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [collections,setCollections]=useState<any>([])

    useEffect(() => {
        fetchCollection(id);
    }, [id]);

    const fetchCollection=async (pid:any)=>{
        try {
          const response = await axios.get(`${apiUrl}/api/house/kudi-collections/${pid}`)
          if(response.data.success){
            setCollections(response.data.collections)
          }
        } catch (error:any) {
          toast({
            title: 'Failed to fetch collection',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant:'destructive'
          })
        }
      }

      const formatDate = (collection:any) => {
        if(collection?.status === 'Paid'){
        return {
          dayMonthYear: format(collection?.PaymentDate, 'dd MMM yyyy'),
          time: format(collection?.PaymentDate, 'hh:mm a'),
        };
      }else if (collection?.status === 'Rejected'){
        return {
          dayMonthYear: 'payment',
          time: 'recjected',
        };
      }else{
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


    return (
        <div className='rounded-t-md bg-gray-100 p-1'>
        <Table className="bg-white">
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
       {collections?.map((collection:any) => {
           const { dayMonthYear, time } = formatDate(collection);
           return (
             <TableRow key={collection._id}>
               <TableCell>
                  <div className='text-sm'>{dayMonthYear}</div>
                  <div className="text-xs text-gray-500">{time}</div>
               </TableCell>
               <TableCell>
               {collection?.description} {collection?.status === 'Rejected' && `Was rejected due to ${collection?.rejectionReason}`}
               </TableCell>
               <TableCell>
               ₹{collection?.amount.toFixed(2)}
               </TableCell>
               <TableCell>{collection?.status}</TableCell>
               <TableCell>
                {collection?.status === 'Paid' ? (
                   <Button size='sm'
                    className="font-bold py-2 px-4 rounded-md" onClick={() => handleReceiptClick(collection)}>
                    Receipt
                   </Button>
                ): collection?.status === 'Unpaid' ? (
                  <UpdateCollectionPayment collection={collection}/>
                ):(
                   <div
                   className="bg-red-200 text-red-500 px-2 py-1 rounded-md">
                    Rejected
                   </div>
                )}
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
    )
}

export default PendingTransactions
