import React from 'react'
import { Button } from '../ui/button'
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';


Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
});
const MembersReport = ({data,
  search,
  dobFilter,
  genderFilter,
  maritalStatusFilter,
  bloodGroupFilter,
  educationFilter,
  madrassaFilter,
  placeFilter,
  relationFilter,
}:any) => {

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
  
                {/* House Header */}
                <View>
                  <Text style={styles.houseInfo}>
                    Filtered By: {
                      dobFilter? `DOB: ${dobFilter}, ` : ''
                    }
                    {genderFilter? `, Gender: ${genderFilter}, ` : ''
                    } 
                    {maritalStatusFilter? `, Marital Status: ${maritalStatusFilter}, ` : ''
                    } 
                    {bloodGroupFilter? `, Blood Group: ${bloodGroupFilter}, ` : ''
                    } 
                    {educationFilter? `, Education: ${educationFilter}, ` : ''
                    } 
                    {madrassaFilter? `, Madrassa: ${madrassaFilter}, ` : ''
                    } 
                    {placeFilter? `, Place: ${placeFilter}, ` : ''
                    }
                    {relationFilter? `, Relation: ${relationFilter}` : ''
                    }
                  </Text>
                  <Text style={styles.houseInfo}>
                    Total Members: 
                    {data.reduce((acc:any, curr:any) => acc + curr.members.length, 0)}
                  </Text>
                </View>
          <View style={styles.table}>
            {/* Single Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>House No.</Text>
              <Text style={styles.tableCellName}>Name</Text>
              <Text style={styles.tableCell}>Status</Text>
              <Text style={styles.tableCell}>Number</Text>
              <Text style={styles.tableCell}>Age</Text>
              <Text style={styles.tableCell}>Gender</Text>
              <Text style={styles.tableCell}>Marital</Text>
              <Text style={styles.tableCell}>Blood Group</Text>
              <Text style={styles.tableCell}>Education</Text>
              <Text style={styles.tableCell}>Place</Text>
            </View>
  
            {/* Table Body */}
            {data.map((house: any, index: number) =>
              house.members.length > 0 ? (
                house.members.map((member: any) => (
                  <View key={member._id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{house.houseNumber}</Text>
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
                ))
              ) : null
            )}
          </View>
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    saveAs(blob, "Data.pdf");
  };
  
  
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Roboto",
      fontSize: 10,
      color: "#333",
      lineHeight: 1.5,
      display: "flex",
      flexDirection: "column",
    },
    houseInfo: {
      fontSize: 11,
      marginBottom: 2,
      color: "#7f8c8d",
    },
    header: {
      textAlign: "center",
      marginBottom: 10,
    },
    headerText: {
      fontSize: 12,
      marginBottom: 4,
      fontWeight: "bold",
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 10,
      alignSelf: "center",
    },
    separator: {
      borderBottomWidth: 2,
      borderBottomColor: "#E5E7EB",
      marginVertical: 15,
    },
    houseContainer: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#d3d3d3",
      paddingBottom: 10,
    },
    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#d3d3d3",
      borderRadius: 8,
      overflow: "hidden",
    },
    tableRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    tableHeader: {
      backgroundColor: "#f3f4f6",
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderBottomColor: "#d3d3d3",
    },
    tableCell: {
      flex: 1,
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: "#d3d3d3",
      textAlign: "center",
    },
    tableCellName: {
      flex: 1.5,
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: "#d3d3d3",
      textAlign: "center",
    },
  });
  
  return (
    <div>
    <Button
    size='sm'
    onClick={
      handleReceiptClick
    }>
      Print
    </Button>
  </div>
  )
}

export default MembersReport
