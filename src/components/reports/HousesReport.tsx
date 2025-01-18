import React from 'react';
import { Button } from '../ui/button';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

Font.register({
  family: 'AnekMalayalam',
  src: '/AnekMalayalam.ttf',
});

const HousesReport = ({ data }: any) => {
  const handleReceiptClick = async () => {
    const doc = (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.header}>
            <Image src="/vkgclean.png" style={styles.logo} />
            <Text style={styles.headerText}>
              Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA
            </Text>
            <Text style={styles.headerText}>
              VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST
            </Text>
            <Text style={styles.headerText}>Phone: +91 9876543210</Text>
            <View style={styles.separator} />
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>House Number</Text>
            <Text style={styles.tableHeaderCell}>Head</Text>
            <Text style={styles.tableHeaderCell}>Number</Text>
            <Text style={styles.tableHeaderCell}>Address</Text>
            <Text style={styles.tableHeaderCell}>House Name</Text>
          </View>

          {/* Table Rows */}
          {data.map((house: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{house.number}</Text>
              <Text style={styles.tableCell}>{house.familyHead?.name || 'NIL'}</Text>
              <Text style={styles.tableCell}>{house.familyHead?.whatsappNumber || 'NIL'}</Text>
              <Text style={styles.tableCell}>{house.address || 'NIL'}</Text>
              <Text style={styles.tableCell}>{house.name || 'NIL'}</Text>
            </View>
          ))}
        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    saveAs(blob, 'HousesReport.pdf');
  };

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'AnekMalayalam',
      fontSize: 10,
      color: '#333',
      lineHeight: 1.5,
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      textAlign: 'center',
      marginBottom: 10,
    },
    headerText: {
      fontSize: 12,
      marginBottom: 4,
      fontWeight: 'bold',
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 10,
      alignSelf: 'center',
    },
    separator: {
      borderBottomWidth: 2,
      borderBottomColor: '#E5E7EB',
      marginVertical: 15,
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      paddingBottom: 5,
      marginBottom: 5,
    },
    tableHeaderCell: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingBottom: 5,
      marginBottom: 5,
    },
    tableCell: {
      flex: 1,
      textAlign: 'center',
    },
  });

  return (
    <div>
      <Button size="sm" onClick={handleReceiptClick}>
        Print
      </Button>
    </div>
  );
};

export default HousesReport;