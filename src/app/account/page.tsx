'use client'
import CreateAccount from '@/components/CreateAccount'
import Sidebar from '@/components/Sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { History, Loader2, MoreHorizontal } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { withAuth } from '@/components/withAuth'

interface BankAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  holderName: string;
  ifscCode: string;
  name: string;
  primary:boolean;
}

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [bank, setBank] = useState<BankAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [targetAccount, setTargetAccount] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [transferAmount, setTransferAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedAccount((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };


  const fetchAccounts = () => {
    axios.get(`${apiUrl}/api/account/get`).then(response => {
      setBank(response.data.accounts)
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

  const handleTransfer = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowTransferDialog(true);
  }

  const confirmTransfer = async () => {
    if (selectedAccount && targetAccount) {
      if (transferAmount || 0 <= selectedAccount.balance) {
        const response = await axios.post(`${apiUrl}/api/account/inter-account-transfer`, {
          fromAccount: selectedAccount,
          toAccount: bank.find(acc => acc._id === targetAccount),
          amount: transferAmount
        });
        if (response.data.success) {
          fetchAccounts();
          setShowTransferDialog(false);
          setSelectedAccount(null);
          setTargetAccount(null);
          setTransferAmount(null);
        }
      } else {
        toast({
          title: 'Insufficient balance',
          variant: 'destructive',
        });
      }
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

  const handleSetPrimary = async(account:any)=>{
    if (account) {
      const response = await axios.post(`${apiUrl}/api/account/set-primary`,{
        accountId: account._id,
      })
      if (response.data.success) {
        fetchAccounts()
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
          <h2 className="text-sm md:text-xl lg:text-2xl font-semibold">Bank Accounts</h2>
          <div className='flex gap-2'>
            <Link href='/all-transactions'
            className='flex items-center gap-1 bg-gray-900 text-white py-1 px-3 rounded-md text-sm'>
              <History className='h-4 w-4'/>
            Transactions
            </Link>
          <CreateAccount fetchAccounts={fetchAccounts} />
          </div>
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
                  <TableCell className="border-t px-4 py-2">{account?.name}<span className='text-muted-foreground font-semibold'>{account?.primary && ' - Primary'}</span></TableCell>
                  <TableCell className="border-t px-4 py-2">{account?.holderName}</TableCell>
                  <TableCell className="border-t px-4 py-2">{account?.accountType}</TableCell>
                  <TableCell className="border-t px-4 py-2">₹{account?.balance}</TableCell>
                  <TableCell className="border-t px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none border px-2 rounded">
                        <MoreHorizontal className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleTransfer(account)}>Transfer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(account)}>Edit</DropdownMenuItem>
                        {!account?.primary && <DropdownMenuItem onClick={() => handleSetPrimary(account)}>Set primary</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inter Account Transfer</DialogTitle>
          </DialogHeader>
          {bank.length > 1 ? (
            <>
              <p className='font-medium text-sm'>Available Balance: ₹{selectedAccount?.balance}</p>
              <Select onValueChange={setTargetAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target account" />
                </SelectTrigger>
                <SelectContent>
                  {bank.filter(acc => acc._id !== selectedAccount?._id).map((acc) => (
                    <SelectItem key={acc._id} value={acc._id}>
                      {acc.name} - {acc.holderName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>
                       Amount
                    </Label>
              <Input
                type="text"
                name="transferAmount"
                placeholder="Transfer Amount"
                value={transferAmount as any}
                onChange={(e:any) => setTransferAmount(e.target.value)}
                max={selectedAccount?.balance}
                disabled={loading}
              />
            </>
          ) : (
            <p>You need to create another bank account for transfer.</p>
          )}
          <DialogFooter>
            <Button size='sm' variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button size='sm' onClick={confirmTransfer} disabled={!targetAccount || (transferAmount as any) > (selectedAccount?.balance as any) ||  (transferAmount as any) <= 0}>
                Transfer
              </Button>
            )}
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
              type="text"
              name="balance"
              placeholder="Balance"
              value={selectedAccount?.balance || 0}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <DialogFooter>
            <Button size='sm' variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button size='sm' onClick={saveEdit}>Update</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default withAuth(Page)
