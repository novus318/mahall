import React from 'react'
import { Button } from '../ui/button'
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';


Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
});
const MembersReport = ({data}:any) => {

  const calculateAge = (dob:any) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };
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
          {data.map((house: any, index: number) =>
            house.members.length > 0 ? (
              <View key={index} style={styles.houseContainer}>
                {/* House Header */}
                <View style={styles.houseHeader}>
                  <Text style={styles.houseTitle}>{house.house}</Text>
                  <Text style={styles.houseInfo}>
                    House Number: {house.houseNumber}
                  </Text>
                  <Text style={styles.houseInfo}>
                    Total Members: {house.totalMembers}
                  </Text>
                </View>
  
                {/* Table */}
                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCellName}>Name</Text>
                    <Text style={styles.tableCell}>Status</Text>
                    <Text style={styles.tableCell}>Number</Text>
                    <Text style={styles.tableCell}>Age</Text>
                    <Text style={styles.tableCell}>Gender</Text>
                    <Text style={styles.tableCell}>Marital Status</Text>
                    <Text style={styles.tableCell}>Blood Group</Text>
                    <Text style={styles.tableCell}>Education</Text>
                    <Text style={styles.tableCell}>Place</Text>
                  </View>
  
                  {/* Table Body */}
                  {house.members.map((member: any) => (
                    <View key={member._id} style={styles.tableRow}>
                      <Text style={styles.tableCellName}>{member.name}</Text>
                      <Text style={styles.tableCell}>{member.status}</Text>
                      <Text style={styles.tableCell}>
                        {member?.mobile || "NIL"}
                      </Text>
                      <Text style={styles.tableCell}>
                        {calculateAge(member.DOB)}
                      </Text>
                      <Text style={styles.tableCell}>{member.gender}</Text>
                      <Text style={styles.tableCell}>
                        {member.maritalStatus}
                      </Text>
                      <Text style={styles.tableCell}>{member.bloodGroup}</Text>
                      <Text style={styles.tableCell}>
                        {member.education.level}
                      </Text>
                      <Text style={styles.tableCell}>
                        {member.place || "N/A"}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null
          )}
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    saveAs(blob, "Data.pdf");
  };
  
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: "Roboto",
      fontSize: 11,
      color: "#333",
      lineHeight: 1.5,
    },
    header: {
      textAlign: "center",
      marginBottom: 10,
    },
    headerText: {
      fontSize: 10,
      marginBottom: 4,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
      alignSelf: "center",
    },
    separator: {
      borderBottomWidth: 2,
      borderBottomColor: "#E5E7EB",
      marginVertical: 15,
    },
    houseContainer: {
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: "#d3d3d3",
      paddingBottom: 10,
    },
    houseHeader: {
      marginBottom: 10,
      paddingBottom: 5,
      borderBottomColor: "#e5e7eb",
      borderBottomWidth: 1,
    },
    houseTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: 4,
    },
    houseInfo: {
      fontSize: 11,
      marginBottom: 2,
      color: "#7f8c8d",
    },
    table: {
      width: "auto",
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#d3d3d3",
      borderRadius: 8, 
    },
    tableRow: {
      flexDirection: "row",
    },
    tableHeader: {
      backgroundColor: "#f3f4f6",
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderBottomColor: "#d3d3d3",
      borderTopLeftRadius: 8, 
      borderTopRightRadius: 8, 
    },
    tableCell: {
      width: "auto",
      padding: 8,
      borderRightWidth: 1,
      borderRightColor: '#d3d3d3',
      textAlign: 'left',
      borderBottomColor: '#d3d3d3',
      flex: 1,
  },
  tableCellName: {
    width: "auto",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#d3d3d3',
    textAlign: 'left',
    borderBottomColor: '#d3d3d3',
    flex: 1.3,
}
  });
  
  return (
    <div>
    <Button
    onClick={
      handleReceiptClick
    }>
      Print
    </Button>
  </div>
  )
}

export default MembersReport
