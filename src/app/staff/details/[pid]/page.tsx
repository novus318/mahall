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
    joinDate: new Date(),
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    statusHistory: []
  })
  const [paySlips, setPaySlips] = useState<any>([])
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    setLoading(true)
    try {
      const res = await axios.put(`${apiUrl}/api/staff/update-status/${pid}`,{
        newStatus: selectedStatus
      })
      if(res.data.success){
        toast({
          title: 'Success',
          description: 'Staff status updated successfully',
          variant:'default'
        })
        fetchStaffDetails()
        setSelectedStatus('')
        setLoading(false)
      }
  }catch(error:any){
    toast({
      title: 'Error',
      description: error.response?.data?.message || error.message || 'something went wrong',
      variant:'destructive'
    })
    setLoading(false)
  }
}

  // Get the latest status to filter it out (assuming the latest status is the last in the array)
  const latestStatus = staff?.statusHistory?.[staff.statusHistory.length - 1]?.status;
  const statusOptions = ['Active', 'Inactive', 'On Leave'].filter(status => status !== latestStatus);



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
          <div className="flex space-x-1">
         {staff?._id && 
         <EditStaff staff={staff} fetchStaffDetails={fetchStaffDetails} />}
           <RequestAdvancePay id={pid} salary={staff?.salary}/>
          </div>
        </div>

      </div>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-4 max-h-[430px]">
            <div className="flex items-center mb-4">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarFallback>{staff?.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-base md:text-2xl font-bold">{staff?.name}</h2>
                <p className="text-gray-500 text-sm">{staff?.department}</p>
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
                <p className='text-xs md:text-base'>₹{staff?.salary}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Contact number</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs md:text-base">Contact email</p>
                <p className='text-xs md:text-base'>{staff?.contactInfo?.email}</p>
              </div>
            </div>
            <div className='col-span-2'>
              <p className="text-gray-500 font-medium text-xs md:text-base">Address</p>
              <p className='text-xs md:text-base'>{staff?.contactInfo?.address}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                  <h2 className="text-base md:text-2xl font-bold">Attendance</h2>
                  <div className="flex items-center gap-4">
            <Select onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <span>{selectedStatus || 'Select Status'}</span>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleStatusChange} disabled={!selectedStatus || loading}>
              {loading ? <Loader2 className='animate-spin'/> : 'Update Status'}
            </Button>
          </div>
                </CardTitle>
                <CardDescription>View employee attendance records.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff?.statusHistory?.slice(0)
      .reverse().map((history) => (
                      <TableRow key={history?._id}>
                        <TableCell>
                          <div>
                            {format(history?.startDate, 'PP')} - {history?.endDate ? format(history?.endDate, 'PP') : 'Present'}
                          </div>

                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{history?.status}</Badge>
                        </TableCell>
                      </TableRow>

                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div>
      <PendingSalaries id={pid} fetchStaffDetails={fetchStaffDetails}/>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">Payslips</h2>
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
                          <Button variant="outline" size="sm">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download
                          </Button>
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
