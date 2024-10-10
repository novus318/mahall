import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

const DownloadPayslip = ({ payslip, staff }: any) => {
  const formatDate = (dateString: string) => {
    return {
      dayMonthYear: format(new Date(dateString), 'dd MMM yyyy'),
      day: format(new Date(dateString), 'EEEE'),
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
            <Image src='/vkgclean.png' style={styles.logo} />
            <Text style={styles.headerText}>Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA</Text>
            <Text style={styles.headerText}>VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST</Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
            <View style={styles.separator} />
          </View>

          {/* Employee Details */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee Name:</Text>
              <Text style={styles.infoValue}>{staff.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID:</Text>
              <Text style={styles.infoValue}>{staff.employeeId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{staff.contactInfo.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>{staff.department}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Position:</Text>
              <Text style={styles.infoValue}>{staff.position}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Payslip Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Join Date:</Text>
              <Text style={styles.infoValue}>{formatDate(staff.joinDate).dayMonthYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Salary Period:</Text>
              <Text style={styles.infoValue}>{format(new Date(payslip.salaryPeriod.startDate), 'MMM yyyy')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Basic Pay:</Text>
              <Text style={styles.infoValue}>₹{payslip.basicPay}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Advance Deduction:</Text>
              <Text style={styles.infoValue}>₹{payslip.advanceDeduction}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>On Leave Days:</Text>
              <Text style={styles.infoValue}>{payslip.onleave.days}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Leave Deduction:</Text>
              <Text style={styles.infoValue}>₹{payslip.onleave.deductAmount}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{payslip.status}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Net Pay Highlighted */}
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
    saveAs(blob, `Payslip-${staff.employeeId}-${format(new Date(payslip.salaryPeriod.startDate), 'MMM yyyy')}.pdf`);
  };

  const styles = StyleSheet.create({
    page: {
      padding: 10,  // Reduced padding for less spacing
      fontFamily: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5,  // Adjusted line height for more compact text
      backgroundColor: '#F3F4F6',
    },
    header: {
      textAlign: 'center',
      marginBottom: 8,  // Reduced margin for less space between elements
    },
    headerText: {
      fontSize: 10,
      marginBottom: 2,  // Reduced margin for tighter layout
    },
    logo: {
      width: 50,
      height: 50,
      alignSelf: 'center',
    },
    separator: {
      borderBottom: '1px solid #D1D5DB',  // Reduced separator thickness
      marginVertical: 8,  // Reduced vertical margin
    },
    infoSection: {
      marginVertical: 8,  // Reduced margin between sections
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,  // Reduced spacing between rows
    },
    infoLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#4B5563',
    },
    infoValue: {
      fontSize: 10,
      color: '#111827',
    },
    totalSection: {
      textAlign: 'right',
      padding: 8,
    },
    totalText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
    },
    footer: {
      marginTop: 15,  // Reduced top margin
      fontSize: 10,
    },
    regards: {
      marginBottom: 4,  // Reduced space before signature
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
