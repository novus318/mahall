'use client'
import ListMembers from '@/components/ListMembers'
import PendingTransactions from '@/components/PendingTransactions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'

// Skeleton component for loading state
const SkeletonLoader = () => (
  <div className="animate-pulse p-2">
    <div className="mb-4 flex justify-between items-center">
      <div className="bg-gray-300 h-8 w-24 rounded"></div>
      <div className="bg-gray-300 h-8 w-24 rounded"></div>
    </div>
    <Card>
      <div className="h-12 bg-gray-200 rounded-t-md mb-2"></div>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-3 text-sm">
          <div className="bg-gray-200 h-6 col-span-1"></div>
          <div className="bg-gray-200 h-6 col-span-2"></div>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <div className="bg-gray-200 h-6 col-span-1"></div>
          <div className="bg-gray-200 h-6 col-span-2"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

interface PageProps {
  params: {
    pid: string
  }
}
interface Member {
  name: string
  status: string,
  DOB: Date,
  maritalStatus: string
  education: string,
  gender: string,
  mobile: string,

  // Add other fields as needed
}

const PageComponent = ({ params }: PageProps) => {
  const { pid } = params
  const [house, setHouse] = useState<any>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [familyHead, setFamilyHead] = useState({ memberId: '', amount: 0 })


  useEffect(() => {
    fetchHouse(pid)
    fetchMembers()
  }, [pid])
  const fetchMembers = async () => {
    axios.get(`${apiUrl}/api/member/all-members/${pid}`)
      .then(response => {
        if (response.data.success) {
          setMembers(response.data.members)
        }
      })
      .catch(error => {
        console.error("Error fetching members:", error)
      })
  }
  const fetchHouse = async (id: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/get/${id}`);
      setHouse(response.data.house);
      setFamilyHead({
        memberId: response.data.house?.familyHead,
        amount: response.data.house?.collectionAmount || 0
      })
    } catch (error) {
      console.error('Error fetching house:', error);
    }
  }
  const handlFamilyHeadChange = (field: string, value: string) => {
    setFamilyHead(prevState => ({
      ...prevState,
      [field]: value
    }))
  }
  const handleSubmitEdit =async()=>{
    setloading(true)
    const data ={
      _id:house._id,
      name:house.name,
      number:house.number,
      address:house.address,
      familyHead:familyHead.memberId,
      collectionAmount:familyHead.amount
    }
    try {
      const response = await axios.put(`${apiUrl}/api/house/edit-house`, data);
      if (response.data.success) {
        setloading(false)
        setFamilyHead(
          {memberId: '',
          amount:0}
        )
        setIsOpen(false);
        fetchHouse(pid)
      }
    } catch (error) {
      setloading(false)
      console.error('Error editing house:', error);
    }
  }
  if (!house) {
    return <SkeletonLoader />
  }

  return (
    <div className='p-2'>
      <div className="mb-4 flex justify-between items-center">
        <Link href='/house' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Back
        </Link>
        <Link
          href={`/add-member/${house?._id}`}
          className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Add Member
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='max-w-full col-span-1 lg:col-span-2'>
          <CardHeader className="mb-2 bg-gray-100 rounded-t-md">
            <CardTitle className="text-lg font-medium">House {house?.number}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 text-sm">
              <p className="font-semibold">Name:</p>
              <p className="col-span-2 text-gray-900">{house?.name}</p>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <p className="font-semibold">Address:</p>
              <p className="col-span-2 text-gray-900 truncate">{house?.address}</p>
            </div>
          </CardContent>
          {house?.familyHead ?
          (<CardFooter className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-800">Family Head: {house?.familyHead.name}</p>
              <p className="text-xs text-gray-600">Collection: ₹{house?.collectionAmount}</p>
            </div>
            <Button variant="outline" size='sm' onClick={
              () => {
                setIsOpen(true)
              }
            }>Edit</Button>

          </CardFooter>):(
            <CardFooter className="flex justify-end">
            <Button variant="outline" size='sm' onClick={
              () => {
                setIsOpen(true)
              }
            }>Set Family head</Button>

          </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">455</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              1% from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">453 AED</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              2% from last month
            </div>
          </CardContent>
        </Card>
      </div>
      <PendingTransactions id={pid} />
      <ListMembers members={members} familyHead={house?.familyHead}/>
      <Dialog
        open={isOpen} onOpenChange={(v) => {
          if (!v) {
            setIsOpen(v)
          }
        }}>
        <DialogContent>
          <DialogTitle>
            Family head
          </DialogTitle>
          <Select onValueChange={(value) => handlFamilyHeadChange('memberId', value)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Member' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {members.map((member: any) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div>
            <Input
              disabled={loading}
              type="number"
              placeholder="Amount"
              value={familyHead.amount}
              onChange={(e) => handlFamilyHeadChange('amount', e.target.value)}
            />
          </div>
          {loading ? (<Button>
            <Loader2 className='animate-spin' />
          </Button>) : (
            <Button
            onClick={handleSubmitEdit}>
              Submit
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const Page = withAuth(({ params }: any) => (
  <Suspense fallback={<SkeletonLoader />}>
    <PageComponent params={params} />
  </Suspense>
))

export default Page
