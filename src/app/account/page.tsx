'use client'
import CreateAccount from '@/components/CreateAccount'
import Sidebar from '@/components/Sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, MoreHorizontal } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BankAccount {
  _id:string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
}

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [bank, setBank] = useState<BankAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: any) => {
      const { name, value } = e.target;
      setSelectedAccount((prev: any) => ({
          ...prev,
          [name]: value,
      }));
  };

  const handleSelectChange = (value: any) => {
      setSelectedAccount((prev: any) => ({
          ...prev,
          accountType: value,
          accountNumber: '',
          ifscCode: '',
      }));
  };
  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`).then(response => {
      setBank(response.data.accounts)
      console.log(response.data.accounts)
    })
      .catch(error => {
        console.log("Error fetching accounts:", error)
      })
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowEditDialog(true);
  }

  const handleDelete = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowDeleteDialog(true);
  }

  const confirmDelete = async() => {
    if (selectedAccount) {
      const response = await axios.post(`${apiUrl}/api/account/create`,)
      setShowDeleteDialog(false);
    }
  }

  const saveEdit = async() => {
    if (selectedAccount) {
      const response = await axios.put(`${apiUrl}/api/account/edit/${selectedAccount._id}`,selectedAccount)
      if (response.data.success) {
        fetchAccounts()
        setSelectedAccount(null)
        setShowEditDialog(false);
      }
}
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="w-full md:w-1/6 bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-6 bg-white shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Bank Accounts</h2>
          <CreateAccount fetchAccounts={fetchAccounts} />
        </div>
        <div className="mt-6 overflow-x-auto">
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Holder Name</TableHead>
                <TableHead className="px-4 py-2">Account Type</TableHead>
                <TableHead className="px-4 py-2">Balance</TableHead>
                <TableHead className="px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bank.map((account, index) => (
                <TableRow key={index} className="hover:bg-gray-100">
                  <TableCell className="border-t px-4 py-2">{account.name}</TableCell>
                  <TableCell className="border-t px-4 py-2">{account.holderName}</TableCell>
                  <TableCell className="border-t px-4 py-2">{account.accountType}</TableCell>
                  <TableCell className="border-t px-4 py-2">₹{account.balance}</TableCell>
                  <TableCell className="border-t px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none border px-2 rounded">
                        <MoreHorizontal className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(account)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(account)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
 <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account {selectedAccount?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
            size='sm' variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button
            size='sm' variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
                <DialogTitle>Edit Account</DialogTitle>
                <div className="space-y-4">
                    <Input
                        type="text"
                        name="name"
                        placeholder="Account Name"
                        value={selectedAccount?.name || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <Input
                        type="text"
                        name="holderName"
                        placeholder="Holder Name"
                        value={selectedAccount?.holderName || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <Input
                        type="number"
                        name="balance"
                        placeholder="Balance"
                        value={selectedAccount?.balance || 0}
                        onChange={handleInputChange}
                        disabled
                    />
                    <Select
                        value={selectedAccount?.accountType || ''}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Account type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='bank'>Bank</SelectItem>
                            <SelectItem value='cash'>Cash</SelectItem>
                        </SelectContent>
                    </Select>
                    {selectedAccount?.accountType === 'bank' && (
                        <>
                            <Input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={selectedAccount?.accountNumber || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            <Input
                                type="text"
                                name="ifscCode"
                                placeholder="IFSC Code"
                                value={selectedAccount?.ifscCode || ''}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button size='sm' variant="outline" onClick={() => setShowEditDialog(false)} disabled={loading}>Cancel</Button>
                    {loading ? (
                        <Button size='sm' disabled>
                            <Loader2 className='animate-spin' />
                        </Button>
                    ) : (
                        <Button size='sm' onClick={saveEdit}>
                            Save
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default Page
