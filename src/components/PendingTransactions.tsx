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
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios'
import { toast } from './ui/use-toast'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Label } from './ui/label';

interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary:boolean;
}

const PendingTransactions = ({ id }: any) => {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [collections,setCollections]=useState<any>([])
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedHouse, setSelectedHouse] = useState<any>(null);
    const [paymentType, setPaymentType] = useState<string>('');
    const [bank, setBank] = useState<BankAccount[]>([])
    const [targetAccount, setTargetAccount] = useState<string | null>(null);
    useEffect(() => {
        fetchCollection(id);
        fetchAccounts()
    }, [id]);

    const fetchAccounts = () => {
      axios.get(`${apiUrl}/api/account/get`).then(response => {
        setBank(response.data.accounts)
      })
        .catch(error => {
          console.log("Error fetching accounts:", error)
        })
    }
    const fetchCollection=async (pid:any)=>{
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
      const formatDaterec = (dateString: any) => {
        return {
          dayMonthYear: format(dateString, 'dd MMM yyyy'),
          day: format(dateString, 'EEEE'),
        };
      };
  
      const handlePayNowClick =async(c:any)=>{
        setSelectedHouse(c);
        setIsDialogOpen(true);
    }
    const handleSubmitPayment = async () => {
        if (!paymentType) {
          toast({
            title: 'Please select a payment type',
            description: 'You must select a payment type before submitting',
            variant: 'destructive',
          });
          return;
        }
        setLoading(true);
        try {
          const response = await axios.put(`${apiUrl}/api/house/update/collection/${selectedHouse?._id}`, {
            paymentType,
            targetAccount,
          });
          if (response.data.success) {
            toast({
              title: 'Payment updated successfully',
              variant: 'default',
            });
            setPaymentType('');
            setIsDialogOpen(false);
            setLoading(false);
          } 
        } catch (error: any) {
          setLoading(false)
          toast({
            title: 'Failed to update payment',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          });
        }
      };
    
      const handleReceiptClick = async (collection: any) => {
        const { dayMonthYear, day } = formatDaterec(collection?.PaymentDate);
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
              <Text>Top Organization</Text>
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
               {collection?.description}
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
     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            Update Payment for {selectedHouse?.houseId?.number}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground font-semibold text-sm'>
            House: {selectedHouse?.houseId?.name}
            <br/>
            Collection Amount: ₹{(selectedHouse?.amount ?? 0).toFixed(2)}
            <br />
            Family Head: {selectedHouse?.memberId?.name}
          </DialogDescription>
          <Label>
            Select account
          </Label>
          <Select onValueChange={setTargetAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target account" />
                </SelectTrigger>
                <SelectContent>
                  {bank.map((acc) => (
                    <SelectItem key={acc._id} value={acc._id}>
                      {acc.name} - {acc.holderName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>
            Select type
          </Label>
          <Select onValueChange={(value) => setPaymentType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPayment} disabled={!paymentType ||!targetAccount || loading}>
              {loading ? <Loader2 className='animate-spin' /> : 'Update Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
    )
}

export default PendingTransactions
