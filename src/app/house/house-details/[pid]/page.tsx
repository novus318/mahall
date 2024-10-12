'use client'
import HouseContribution from '@/components/HouseContribution'
import ListMembers from '@/components/ListMembers'
import PendingTransactions from '@/components/PendingTransactions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  const [totalContribution, setTotalContribution] = useState(<Loader2 className='animate-spin'/>);
  const [familyHead, setFamilyHead] = useState({ memberId: '', amount: 0 })
  const [editHouse, setEditHouse] = useState<any>({})

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
      name:editHouse.name,
      number:editHouse.number,
      address:editHouse.address,
      familyHead:familyHead.memberId,
      collectionAmount:familyHead.amount,
      status:editHouse.status,
      rationsStatus:editHouse.rationStatus,
      panchayathNumber:editHouse.panchayathNumber,
      wardNumber:editHouse.wardNumber
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
          href={`/house/add-member/${house?._id}`}
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
                setEditHouse(house)
                handlFamilyHeadChange('memberId', house?.familyHead?._id)
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
            <CardDescription className='text-lg font-semibold'>Total Contributions from house</CardDescription>
            <CardTitle className="text-3xl font-bold tracking-wider text-gray-800">₹ {totalContribution}</CardTitle>
          </CardHeader>
        </Card>
      </div>
     <div className='my-6'>
       <h2 className='text-lg font-extrabold text-muted-foreground mb-2'>House Collections</h2>
     <PendingTransactions id={house?.familyHead?._id} />
     </div>
      <ListMembers members={members} familyHead={house?.familyHead}/>
      <div className='my-6'>
        <h2 className='text-lg font-extrabold text-muted-foreground mb-2'>
          Contributions from House {house?.number}
        </h2>
        <HouseContribution id={house?._id} contribution={setTotalContribution}/>
      </div>
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
          <div>
          <Label>
          House Number
              </Label>
            <Input
              type="text"
              placeholder="House Number"
              value={editHouse?.number}
              onChange={(e) =>
                setEditHouse({ ...editHouse, number: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div>
            <Label>
            Panchayath Number
            </Label>
                        <Input
                            type="text"
                            placeholder="Panchayath Number"
                            value={editHouse?.panchayathNumber}
                            onChange={(e) => 
                              setEditHouse({...editHouse, panchayathNumber: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>
                    <div>
                      <Label>
                      Ward Number
                      </Label>
                        <Input
                            type="text"
                            placeholder="Ward Number"
                            value={editHouse?.wardNumber}
                            onChange={(e) => 
                              setEditHouse({...editHouse, wardNumber: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>
          <div>
            <Label>
            House Name
              </Label>
            <Input
              disabled={loading}
              type="text"
              placeholder="House Name"
              value={editHouse?.name}
              onChange={(e) =>
                setEditHouse({ ...editHouse, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label>
            Address
              </Label>
            <Textarea
              disabled={loading}
              placeholder="Address"
              value={editHouse?.address}
              onChange={(e) =>
                setEditHouse({ ...editHouse, address: e.target.value })
              }
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>
                House Status
              </Label>
              <Select
                name='status'
                onValueChange={(value) =>
                  setEditHouse({ ...editHouse, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={editHouse?.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='rented'>
                    Rented
                  </SelectItem>
                  <SelectItem value='owned'>
                    Owned
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>
                Ration Status
              </Label>
              <Select
                name='Rationstatus'
                onValueChange={(value) =>
                  setEditHouse({ ...editHouse, rationStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={editHouse?.rationsStatus} />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value='AAY/Yellow'>
                AAY/Yellow
                  </SelectItem>
                  <SelectItem value='BPL/Pink'>
                 BPL/Pink
                  </SelectItem>
                  <SelectItem value='APL/Blue'>
                  APL/Blue
                  </SelectItem>
                  <SelectItem value='White Card'>
                White Card
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
         <div>
         <Label>
            Family head
          </Label>
          <Select value={familyHead.memberId} onValueChange={(value) => handlFamilyHeadChange('memberId', value)}>
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
         </div>
          <div>
            <Label>
            Collection Amount
              </Label>
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
