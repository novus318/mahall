import React from 'react'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// Import organization logo

const DownloadPayslip = ({payslip,staff}: any) => {
  const formatDate = (dateString: any) => {
    return {
      dayMonthYear: format(dateString, 'dd MMM yyyy'),
      day: format(dateString, 'EEEE'),
    };
  };

  Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
  });
  const handlePayslipClick = async () => {
    const doc = (
      <Document>
        <Page size="A5" style={styles.page}>
  
          {/* Header Section with Logo */}
          <View style={styles.header}>
            <Image src='/VKJ.jpeg' style={styles.logo} />
            <Text style={styles.companyInfo}>Vellap, Thrikkaripur</Text>
            <Text style={styles.companyInfo}>Phone: +91 9876543210</Text>
          </View>
  
          {/* Payslip Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID:</Text>
              <Text style={styles.infoValue}>{staff.employeeId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Join Date:</Text>
              <Text style={styles.infoValue}>{formatDate(staff.joinDate).dayMonthYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Salary Period:</Text>
              <Text style={styles.infoValue}>{format(payslip?.salaryPeriod?.startDate, 'MMM yyyy')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Basic Pay:</Text>
              <Text style={styles.infoValue}>₹{payslip.basicPay}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{payslip.status}</Text>
            </View>
          </View>
  
          <View style={styles.separator} />
  
          {/* Employee Details */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Employee Name:</Text>
              <Text style={styles.tableCell}>{staff.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Phone:</Text>
              <Text style={styles.tableCell}>{staff.contactInfo.phone}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Department:</Text>
              <Text style={styles.tableCell}>{staff.department}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Position:</Text>
              <Text style={styles.tableCell}>{staff.position}</Text>
            </View>
          </View>
  
          {/* Deductions Section */}
          {payslip.deductions.length > 0 && (
            <View style={styles.deductionsSection}>
              <Text style={styles.tableCellHeader}>Deductions:</Text>
              {payslip.deductions.map((deduction: any, index: number) => (
                <View key={index} style={styles.deductionItem}>
                  <Text style={styles.deductionText}>{deduction.name}</Text>
                  <Text style={styles.deductionAmount}>₹{deduction.amount}</Text>
                </View>
              ))}
            </View>
          )}
  
          {/* Total Section */}
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Net Pay: ₹{payslip.netPay}</Text>
          </View>
  
          <View style={styles.separator} />
  
          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.regards}>Regards,</Text>
            <Text style={styles.signature}>VKJ</Text>
          </View>
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    saveAs(blob, 'payslip.pdf');
  };
  
  const styles = StyleSheet.create({
    page: {
      padding: 15,
      fontFamily: 'Roboto',
      fontSize: 12,
      lineHeight: 1.6,
      backgroundColor: '#F3F4F6',
    },
    header: {
      textAlign: 'center',
      marginBottom: 10,
    },
    logo: {
      width: 50,
      height: 50,
      alignSelf: 'center',
    },
    companyInfo: {
      fontSize: 11,
      color: '#6B7280',
    },
    infoSection: {
      marginVertical: 10,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    infoLabel: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#4B5563',
    },
    infoValue: {
      fontSize: 11,
      color: '#111827',
    },
    separator: {
      borderBottom: '2px solid #D1D5DB',
      marginVertical: 10,
    },
    tableContainer: {
      marginBottom: 10,
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
      color: '#111827',
      textAlign: 'right',
    },
    deductionsSection: {
      marginBottom: 20,
    },
    deductionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    deductionText: {
      fontSize: 10,
    },
    deductionAmount: {
      fontSize: 10,
      color: '#EF4444',
    },
    totalSection: {
      textAlign: 'right',
      marginTop: 10,
    },
    totalText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
    },
    footer: {
      marginTop: 20,
      fontSize: 10,
    },
    regards: {
      marginBottom: 5,
    },
    signature: {
      fontWeight: 'bold',
      fontSize: 10,
      color: '#4B5563',
    },
  });
  return (
    <Button onClick={handlePayslipClick} size='sm'>
      <Download className='h-4' />
      Download
    </Button>
  );
};

export default DownloadPayslip;

