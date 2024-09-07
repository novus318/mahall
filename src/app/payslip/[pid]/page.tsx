'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import DownloadPayslip from '@/components/DownloadPayslip';

interface PageProps {
  params: {
    pid: string
  }
}
interface Staff {
  _id: string,
  name: string,
  age: number,
  employeeId: string,
  department: string,
  position: string,
  salary: number,
  joinDate: Date,
  contactInfo: {
    phone: string,
    email: string,
    address: string
  },
  statusHistory: any[]
}

const CollectionsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Collections</h2>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};
const PageComponent = ({ params }: PageProps) => {
  const router = useRouter()
  const { pid } = params
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<Staff>({
    _id: '',
    name: '',
    age: 0,
    employeeId: '',
    department: '',
    position: '',
    salary: 0,
    joinDate: new Date(),
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    statusHistory: []
  })
  const [paySlips, setPaySlips] = useState<any>([])




  useEffect(() => {
    fetchStaffDetails()
  }, [pid])
  const fetchStaffDetails = async () => {
    axios.get(`${apiUrl}/api/staff/get/${pid}`)
      .then(response => {
        if (response.data.success) {
          setStaff(response.data.staff)
          setPaySlips(response.data.payslips)
        }
      })
      .catch(error => {
        console.error("Error fetching staff details:", error)
      })
  }

  if (loading) return <CollectionsSkeleton />;
  return (
    <div className="container mx-auto p-2 mt-5">
      <div className="bg-white rounded-lg border p-2">
            <h2 className="text-lg font-bold mb-2">Payslips of {staff?.name}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paySlips?.map((pay: any) => {
                  return (
                    <TableRow key={pay?._id}>
                      <TableCell>{format(pay?.salaryPeriod?.startDate, 'MMM yyyy')}</TableCell>
                      <TableCell>₹{pay?.status === 'Paid' ? pay?.netPay : pay?.basicPay}</TableCell>
                      <TableCell>
                        {pay?.status === 'Paid' ? (
                          <DownloadPayslip payslip={pay} staff={staff}/>
                        ) : (
                          <Button
                            disabled variant="destructive" size="sm">
                            Rejected
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {paySlips?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>No payslips found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
    </div>
  )
}

export default PageComponent
