'use client'
import React, { useEffect, useState } from 'react'
import { Card,CardHeader,CardDescription,CardTitle,CardContent } from './ui/card'
import { Table,TableBody,TableCell,TableHeader,TableRow,TableHead } from './ui/table'
import axios from 'axios'
import UpdateSalaryPayment from './UpdateSalaryPayment'
import { format } from 'date-fns'



const PendingSalaries = ({id,fetchStaffDetails}:any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [pendingPaySlips, setPendingPaySlips] = useState<any>([])

    const fetchPendingCollections = async () => {
        axios.get(`${apiUrl}/api/staff/pending-salary/${id}`)
          .then(response => {
            if (response.data.success) {
              setPendingPaySlips(response.data.payslips)
            }
          })
          .catch(error => {
            console.error("Error fetching pending collections:", error)
          })
      }

      useEffect(() => {
        fetchPendingCollections()
      }, [id])

   
  return (
 <>
    <Card>
    <CardHeader>
      <CardTitle>Pending Salaries</CardTitle>
      <CardDescription>pending employee salaries.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Pending Salary</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingPaySlips?.map((payslip: any) => (
            <TableRow key={payslip?._id}>
              <TableCell className="font-medium">
                {payslip?.salaryPeriod?.startDate && format(payslip?.salaryPeriod?.startDate, 'MMM yyyy')}
              </TableCell>
              <TableCell>₹{payslip?.basicPay}</TableCell>
              <TableCell>
              <UpdateSalaryPayment  salary={payslip} />  </TableCell>
            </TableRow>
          ))}
          {pendingPaySlips?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No pending payslips found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  </>
  )
}

export default PendingSalaries
