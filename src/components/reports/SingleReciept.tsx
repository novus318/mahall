import React from 'react'
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

Font.register({
  family: 'AnekMalayalam',
  src: '/AnekMalayalam.ttf'
});
const SingleReciept = ({reciept}:any) => {

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
              <Text style={styles.organization}>Vellap Khadimul Islam Jamaath</Text>
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
          fontFamily: 'AnekMalayalam',
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
  )
}

export default SingleReciept
