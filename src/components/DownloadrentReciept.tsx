import React from 'react'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

const DownloadrentReciept = ({ collection, contractDetails, room }: any) => {

  const formatDaterec = (dateString: any) => {
    return {
      dayMonthYear: format(dateString, 'dd MMM yyyy'),
      day: format(dateString, 'EEEE'),
    };
  };

  Font.register({
    family: 'AnekMalayalam',
    src: '/AnekMalayalam.ttf'
  });

  const handleReceiptClick = async () => {
    const { buildingName, roomNumber } = room;
    const { dayMonthYear, day } = formatDaterec(collection?.date);

    const leaveDays = collection?.onleave?.days || 0;
    const leaveDeductAmount = collection?.onleave?.deductAmount || 0;
    const formatCurrency = (amount:any) => {
      return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };
    const doc = (
      <Document>
        <Page size="A5" style={styles.page}>
          
          {/* Header Section with Logo */}
          <View style={styles.header}>
            <Image src='/vkgclean.png' style={styles.logo} />
            <Text style={styles.headerText}>Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA</Text>
            <Text style={styles.headerText}>VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST</Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
            <View style={styles.separator} />
          </View>

          {/* Date and Rent Period */}
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>Date: {dayMonthYear}</Text>
            <Text style={styles.dateText}>Day: {day}</Text>
            <Text style={styles.dateText}>Rent Period: {collection?.period}</Text>
          </View>

          <View style={styles.separator} />

          {/* Tenant and Payment Information */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Tenant Name:</Text>
              <Text style={styles.tableCell}>{contractDetails?.tenant.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Phone:</Text>
              <Text style={styles.tableCell}>{contractDetails?.tenant.number}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Room Number:</Text>
              <Text style={styles.tableCell}>{roomNumber}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Building Name:</Text>
              <Text style={styles.tableCell}>{buildingName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Shop Name:</Text>
              <Text style={styles.tableCell}>{contractDetails?.shop}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Payment Method:</Text>
              <Text style={styles.tableCell}>{collection?.paymentMethod}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Deduction Days:</Text>
              <Text style={styles.tableCell}>{leaveDays}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Deduction amount:</Text>
              <Text style={styles.tableCell}>{formatCurrency(leaveDeductAmount)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Payment Status:</Text>
              <Text style={styles.tableCell}>{collection?.status}</Text>
            </View>
          </View>

          {/* Payment Calculation */}
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total Paid: {formatCurrency(collection?.PaymentAmount)}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Regards,</Text>
            <Text style={styles.signature}>VKJ</Text>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    saveAs(blob, `${contractDetails?.shop}-${collection?.period}.pdf`);
  };

  const styles = StyleSheet.create({
    page: {
      padding: 10, // Reduced padding
      fontFamily: 'AnekMalayalam',
      fontSize: 10, // Reduced font size
      lineHeight: 1.4, // Reduced line height
    },
    header: {
      textAlign: 'center',
      marginBottom: 2, // Reduced margin
    },
    logo: {
      width: 40, // Reduced size
      height: 40,
      alignSelf: 'center',
    },
    headerText: {
      fontSize: 8, // Reduced font size
      marginBottom: 2,
    },
    separator: {
      borderBottom: '1px solid #E5E7EB',
      marginVertical: 5, // Reduced margin
    },
    dateSection: {
      textAlign: 'left',
      marginBottom: 5, // Reduced margin
    },
    dateText: {
      fontSize: 9, // Reduced font size
      color: '#4B5563',
    },
    tableContainer: {
      marginBottom: 10, // Reduced margin
      paddingVertical: 5, // Reduced padding
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4, // Reduced margin
    },
    tableCellHeader: {
      fontWeight: 'bold',
      fontSize: 10, // Reduced font size
      color: '#4B5563',
    },
    tableCell: {
      fontSize: 10, // Reduced font size
      textAlign: 'right',
      color: '#111827',
    },
    totalSection: {
      textAlign: 'right',
      marginTop: 5, // Reduced margin
    },
    totalText: {
      fontSize: 11, // Reduced font size
      fontWeight: 'bold',
      color: '#111827',
    },
    footer: {
      textAlign: 'left',
      fontSize: 10, // Reduced font size
      marginTop: 10, // Reduced margin
    },
    signature: {
      fontWeight: 'bold',
      fontSize: 10, // Reduced font size
      color: '#4B5563',
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
