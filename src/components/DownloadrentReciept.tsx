import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
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
    src: '/AnekMalayalam.ttf',
  });

  const handleReceiptClick = async () => {
    const { buildingName, roomNumber } = room;
    const { dayMonthYear, day } = formatDaterec(collection?.date);
  
    const leaveDays = collection?.onleave?.days || 0;
    const leaveDeductAmount = collection?.onleave?.deductAmount || 0;
    const advanceDeduction = collection?.advanceDeduction || 0;
  
    const formatCurrency = (amount: any) => {
      return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };
  
    const totalAmount = collection?.amount;
    const totalDeductions = leaveDeductAmount + advanceDeduction;
    const netAmount = totalAmount - totalDeductions;
  
    const doc = (
      <Document>
        <Page size="A5" style={styles.page}>
          {/* Header Section with Logo */}
          <View style={styles.header}>
            <Image src="/vkgclean.png" style={styles.logo} />
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
            <Text style={styles.dateText}>Payment Date: {formatDaterec(collection?.paymentDate).dayMonthYear}</Text>
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
              <Text style={styles.tableCellHeader}>Deduction Amount:</Text>
              <Text style={styles.tableCell}>{formatCurrency(leaveDeductAmount)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Payment Status:</Text>
              <Text style={styles.tableCell}>{collection?.status}</Text>
            </View>
          </View>
  
          {/* Partial Payments Section */}
          {collection?.partialPayments && collection.partialPayments.length > 0 && (
            <View style={styles.partialPaymentsSection}>
              <Text style={styles.sectionHeader}>Partial Payments:</Text>
              {collection.partialPayments.map((payment: any, index: number) => (
                <View key={index} style={styles.partialPaymentRow}>
                  <Text style={styles.partialPaymentText}>
                    {formatDaterec(payment.paymentDate).dayMonthYear}: {formatCurrency(payment.amount)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
  
          {/* Payment Calculation */}
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total Rent: {formatCurrency(totalAmount)}</Text>
            <Text style={styles.totalText}>Total Deductions: {formatCurrency(totalDeductions)}</Text>
            <Text style={styles.totalText}>Paid Amount: {formatCurrency(collection?.paidAmount)}</Text>
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
      padding: 10,
      fontFamily: 'AnekMalayalam',
      fontSize: 10,
      lineHeight: 1.4,
    },
    header: {
      textAlign: 'center',
      marginBottom: 2,
    },
    logo: {
      width: 40,
      height: 40,
      alignSelf: 'center',
    },
    headerText: {
      fontSize: 8,
      marginBottom: 2,
    },
    separator: {
      borderBottom: '1px solid #E5E7EB',
      marginVertical: 5,
    },
    dateSection: {
      textAlign: 'left',
      marginBottom: 5,
    },
    dateText: {
      fontSize: 9,
      color: '#4B5563',
    },
    tableContainer: {
      marginBottom: 10,
      paddingVertical: 5,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
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
    partialPaymentsSection: {
      marginBottom: 10,
    },
    sectionHeader: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    partialPaymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    partialPaymentText: {
      fontSize: 9,
      color: '#4B5563',
    },
    totalSection: {
      textAlign: 'right',
      marginTop: 5,
    },
    totalText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
    },
    footer: {
      textAlign: 'left',
      fontSize: 10,
      marginTop: 10,
    },
    signature: {
      fontWeight: 'bold',
      fontSize: 10,
      color: '#4B5563',
    },
  });

  return (
    <Button onClick={handleReceiptClick} size="sm">
      <Download className="h-4" />
      Download
    </Button>
  );
};

export default DownloadrentReciept;