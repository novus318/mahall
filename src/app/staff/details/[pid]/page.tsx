'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { DownloadIcon, FilePenIcon, IndianRupee, Loader2, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PendingSalaries from '@/components/PendingSalaries'
import EditStaff from '@/components/EditStaff'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import RequestAdvancePay from '@/components/RequestAdvancePay'
import DownloadPayslip from '@/components/DownloadPayslip'
import RepayAdvancePay from '@/components/RepayAdvancePay'
import StaffResign from '@/components/StaffResign'


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
  status:string,
  advancePayment:Number,
  joinDate: Date,
  contactInfo: {
    phone: string,
    email: string,
    address: string
  },
}

const SkeletonLoader = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);
const PageComponent = ({ params }: PageProps) => {
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
    advancePayment: 0,
    joinDate: new Date(),
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    status:''
  })
  const [paySlips, setPaySlips] = useState<any>([])
  const [selectedStatus, setSelectedStatus] = useState('');


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
  useEffect(() => {
    fetchStaffDetails()
  }, [pid])

  if (!staff._id) {
    return <SkeletonLoader />
  }
  return (
    <>
      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <Link href={`/staff`} className="bg-gray-900 text-white rounded-sm py-2 px-3 text-sm">
            Back
          </Link>
       {staff?._id &&
           <div className="flex space-x-1">
           {staff?.status === 'Active' && 
           (<div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
           <EditStaff staff={staff} fetchStaffDetails={fetchStaffDetails} />
             <RequestAdvancePay id={pid} fetchStaffDetails={fetchStaffDetails}/>
             <RepayAdvancePay id={pid} fetchStaffDetails={fetchStaffDetails} staff={staff}/>
            <StaffResign id={pid}/>
            </div>)
       }
            </div>
       }
        </div>

      </div>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={staff.status === 'Resigned' ? 'bg-red-50 rounded-lg border p-4' : 'bg-white rounded-lg border p-4'}>
            <div className="flex items-center mb-4">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarFallback>{staff?.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-base md:text-2xl font-bold">{staff?.name}</h2>
                <p className="text-gray-500 text-sm">{staff?.department} - {staff?.status}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Employee ID</p>
                <p className='text-xs md:text-base'>{staff?.employeeId}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Age</p>
                <p className='text-xs md:text-base'>{staff?.age}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Department</p>
                <p className='text-xs md:text-base'>{staff?.department}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Position</p>
                <p className='text-xs md:text-base'>{staff?.position}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Join Date</p>
                <p className='text-xs md:text-base'>{format(staff?.joinDate, "PPP")}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Salary</p>
                <p className='text-xs md:text-base'>₹{staff?.salary.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Contact number</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Advance Payment</p>
                <p className='text-xs md:text-base'>₹{staff?.advancePayment ? (staff?.advancePayment.toFixed(2)): 0}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Contact email</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.email || 'NIL'}</p>
              </div>
              <div>
              <p className="text-gray-500 font-medium text-xs md:text-base">Address</p>
              <p className='text-xs md:text-base'>{staff?.contactInfo?.address}</p>
            </div>
            </div>
          </div>
          <div>
      <PendingSalaries id={pid} fetchStaffDetails={fetchStaffDetails}/>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-2xl font-bold mb-4">Payslips</p>
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
                          <div
                          className='font-semibold text-red-500'
                          >
                            Rejected due to {pay?.rejectionReason}
                          </div>
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
      </div>
    </>
  )
}
const Page = withAuth(({ params }: any) => (
  <Suspense fallback={<SkeletonLoader />}>
    <PageComponent params={params} />
  </Suspense>
))

export default withAuth(Page)
