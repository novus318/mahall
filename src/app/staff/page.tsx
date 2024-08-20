'use client'
import Sidebar from '@/components/Sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Staff {
  _id:string,
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
  }
}
const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [staff,setStaff] =useState<Staff[]>([])
  
  const fetchStaff =async()=>{
    const response = await axios.get(`${apiUrl}/api/staff/all-staff`)
    if(response.data.success){
      setStaff(response.data.staff)
    }
  }
  useEffect(()=>{
    fetchStaff()
  }, [])
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="w-full md:w-1/6 bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-6 bg-white shadow-md">
      <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Staff Management</h2>
          <Link href='/staff/create-staff' className='bg-gray-900 text-white py-1 px-2 rounded'>
          Create  staff
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto">
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">ID</TableHead>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Position</TableHead>
                <TableHead className="px-4 py-2">Phone</TableHead>
                <TableHead className="px-4 py-2">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="px-4 py-2">{item.employeeId}</TableCell>
                  <TableCell className="px-4 py-2">{item.name}</TableCell>
                  <TableCell className="px-4 py-2">{item.position}</TableCell>
                  <TableCell className="px-4 py-2">{item.contactInfo.phone}</TableCell>
                  <TableCell className="px-4 py-2">₹{item.salary}</TableCell>
                  <TableCell className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal size={24} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      </div>
  )
}

export default Page
