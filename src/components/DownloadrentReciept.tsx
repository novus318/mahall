import React from 'react'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// Import organization logo

const DownloadrentReciept = ({collection, contractDetails, room}: any) => {

  const formatDaterec = (dateString: any) => {
    return {
      dayMonthYear: format(dateString, 'dd MMM yyyy'),
      day: format(dateString, 'EEEE'),
    };
  };

  Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
  });

  const handleReceiptClick = async () => {
    const { dayMonthYear, day } = formatDaterec(collection?.date);

    const doc = (
      <Document>
        <Page size="A5" style={styles.page}>
          
          {/* Header Section with Logo */}
          <View style={styles.header}>
            <Image src='/VKJ.jpeg' style={styles.logo} />
            <Text style={styles.contact}>Juma Masjid, Vellap, Thrikkaripur</Text>
            <Text style={styles.contact}>Phone: +91 9876543210</Text>
          </View>

  
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>Date: {dayMonthYear}</Text>
            <Text style={styles.dateText}>Day: {day}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Tenant Name:</Text>
              <Text style={styles.tableCell}>{contractDetails.tenant.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Phone:</Text>
              <Text style={styles.tableCell}>{contractDetails.tenant.number}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Place:</Text>
              <Text style={styles.tableCell}>{contractDetails.tenant.place}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Room Number:</Text>
              <Text style={styles.tableCell}>{room.roomNumber}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Payment Method:</Text>
              <Text style={styles.tableCell}>{collection.paymentMethod}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Rent Period:</Text>
              <Text style={styles.tableCell}>{collection.period}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Payment Date:</Text>
              <Text style={styles.tableCell}>{dayMonthYear}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Status:</Text>
              <Text style={styles.tableCell}>{collection.status}</Text>
            </View>

            {/* Deductions Section */}
            {collection.deductions.length > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellHeader}>Deductions:</Text>
                <View style={styles.deductionsList}>
                  {collection.deductions.map((deduction: any, index: number) => (
                    <Text key={index}>
                      {deduction.name}: ₹{deduction.amount}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Total Section */}
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total Amount Paid: ₹{collection.amount}</Text>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text>Regards,</Text>
            <Text style={styles.signature}>VKJ</Text>
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
      fontSize: 12,
      lineHeight: 1.6,
    },
    header: {
      textAlign: 'center',
      marginBottom: 5,
    },
    logo: {
      width: 50,
      height: 50,
      alignSelf: 'center',
    },
    contact: {
      fontSize: 11,
      color: '#9CA3AF',
    },
    separator: {
      borderBottom: '1px solid #E5E7EB',
      marginVertical: 10,
    },
    dateSection: {
      textAlign: 'left',
      marginBottom: 15,
    },
    dateText: {
      fontSize: 11,
      color: '#4B5563',
    },
    tableContainer: {
      marginBottom: 20,
      paddingVertical: 10,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    tableCellHeader: {
      fontWeight: 'bold',
      fontSize: 10,
      color: '#4B5563',
    },
    tableCell: {
      fontSize: 10,
      textAlign: 'right',
      color: '#111827',
    },
    deductionsList: {
      marginTop: 5,
    },
    totalSection: {
      textAlign: 'right',
      marginTop: 10,
    },
    totalText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#111827',
    },
    footer: {
      textAlign: 'left',
      fontSize: 10,
    },
    signature: {
      fontWeight: 'bold',
      fontSize: 12,
      color: '#4B5563',
      marginTop: 5,
    },
  });

  return (
    <Button onClick={handleReceiptClick} size='sm'>
      <Download className='h-4' />
      Download
    </Button>
  );
};

export default DownloadrentReciept;
