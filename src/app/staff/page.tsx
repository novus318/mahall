'use client'
import Sidebar from '@/components/Sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Staff {
  _id: string,
  name: string,
  age: number,
  employeeId: string,
  department: string,
  position: string,
  salary: number,
  joinDate: Date,
  status: string,
  contactInfo: {
    phone: string,
    email: string,
    address: string
  }
}

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchStaff = async () => {
    const response = await axios.get(`${apiUrl}/api/staff/all-staff`);
    if (response.data.success) {
      setStaff(response.data.staff);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtered staff based on search term and status filter
  const filteredStaff = staff.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="w-full md:w-1/6 bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-6 bg-white shadow-md">
        <div className="mb-4 grid grid-cols-2 md:grid-cols-5 justify-between items-center">
          <h2 className="text-2xl font-semibold col-span-2 md:col-span-3">Staff Management</h2>
          <div className='space-x-2 col-span-2'>
            <Link href='/staff/pending-salaries' className='bg-gray-900 text-white py-1 px-2 rounded-sm'>
              Pending salary
            </Link>
            <Link href='/staff/create-staff' className='bg-gray-900 text-white py-1 px-2 rounded-sm'>
              Create staff
            </Link>
          </div>
        </div>

        <div className="flex space-x-4 mb-4 max-w-xl">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4"
          />
        <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="bg-gray-900 text-white py-1 px-3 rounded-sm"
  >
    <option value="All">Filter by Status</option>
    <option value="Active">Active</option>
    <option value="Resigned">Resigned</option>
  </select>
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
                <TableHead className="px-4 py-2">Status</TableHead>
                <TableHead className="px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((item) => (
                <TableRow key={item._id} className={item.status === 'Resigned' ? 'bg-red-100': ''}>
                  <TableCell className="px-4 py-2">{item.employeeId}</TableCell>
                  <TableCell className="px-4 py-2">{item.name}</TableCell>
                  <TableCell className="px-4 py-2">{item.position}</TableCell>
                  <TableCell className="px-4 py-2">{item.contactInfo.phone}</TableCell>
                  <TableCell className="px-4 py-2">₹{item.salary}</TableCell>
                  <TableCell className="px-4 py-2">{item.status}</TableCell>
                  <TableCell className="px-4 py-2">
                    <Link href={`/staff/details/${item._id}`} className='bg-gray-900 text-white px-2 py-1 rounded-sm'>
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
