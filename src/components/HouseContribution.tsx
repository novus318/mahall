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
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import axios from 'axios'
import { toast } from './ui/use-toast'
import { format } from 'date-fns'


const HouseContribution = ({id,contribution}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [collections,setCollections]=useState<any>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollection(id);
    }, [id]);

    const fetchCollection=async (pid:any)=>{
        try {
          const response = await axios.get(`${apiUrl}/api/house/kudi-contribution/${pid}`)
          if(response.data.success){
            setCollections(response.data.receipts)
            contribution(response.data.totalContributions)
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

      const formatDate = (collection:any) => {
        if(collection?.status === 'Completed'){
        return {
          dayMonthYear: format(collection?.updatedAt, 'dd MMM yyyy'),
          time: format(collection?.updatedAt, 'hh:mm a'),
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
    return (
        <div className='rounded-t-md bg-gray-100 p-1'>
        <Table className="bg-white">
       <TableHeader className='bg-gray-100'>
         <TableRow>
           <TableHead className="font-medium">Date</TableHead>
           <TableHead className="font-medium">Description</TableHead>
           <TableHead className="font-medium">Amount</TableHead>
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
               {collection?.description}
               </TableCell>
               <TableCell>
               ₹{collection?.amount.toFixed(2)}
               </TableCell>
               <TableCell>
       <Button
       className={` ${collection?.status === 'Pending' ? 'bg-gray-200': ''}`}
         size="sm"
         disabled={collection?.status === 'Pending'}
         onClick={() => {
           if (collection?.status === 'Completed') {
             handleReceiptClick(collection);
           }
         }}
       >
         {collection?.status === 'Completed' && 'Receipt'}
         {collection?.status === 'Pending' && 'Pending'}
       </Button>
     </TableCell>
     
             </TableRow>
           );
         })}
         {collections?.length === 0 && (
             <TableCell colSpan={3} className="text-center text-gray-600 text-sm">
               <h4 className="text-lg font-bold">No Contributions...</h4>
             </TableCell>
           ) 
         }
       </TableBody>
     </Table>
        </div>
    )
}

export default HouseContribution
