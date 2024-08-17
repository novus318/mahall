'use client'
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateHouse from '@/components/CreateHouse';
import { useHouseContext } from '@/context/HouseContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import Link from 'next/link';
const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { houses, searchTerm, setSearchTerm,fetchHouses } = useHouseContext();
  const [editHouse,setEditHouse]= useState<any>({})
  const [loading, setloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

const handleSubmitEdit =async()=>{
  setloading(true)
  try {
    const response = await axios.put(`${apiUrl}/api/house/edit-house`, editHouse);
    if (response.data.success) {
      console.log('House edited successfully:', response.data.house);
      setloading(false)
      setEditHouse({})
      setIsOpen(false);
      fetchHouses()
    }
  } catch (error) {
    setloading(false)
    console.error('Error editing house:', error);
  }
}


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
        <div className="flex justify-between items-center mb-4 gap-2">
          <Input
            placeholder="Search houses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2"
          />
          <CreateHouse />
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {houses.map((house:any) => (
            <Card key={house?._id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/house-details/${house?._id}`}>
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
              </CardContent></Link>
              <CardFooter className="flex justify-end">
              <Button variant="outline" size='sm' onClick={
    () => {
      setEditHouse(house)
      setIsOpen(true)
    }
  }>Edit</Button>
         
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Dialog
              open={isOpen} onOpenChange={(v) => {
                if (!v) {
                  setIsOpen(v)
                }
              }}>
  <DialogContent>
   <DialogTitle>
     Edit House
   </DialogTitle>
      <div>
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
        <Input
        disabled={loading}
          type="text"
          placeholder="House Name"
          value={editHouse?.name}
          onChange={(e) => 
            setEditHouse({...editHouse, name: e.target.value })
          }
        />
      </div>
      <div>
        <Textarea
        disabled={loading}
          placeholder="Address"
         value={editHouse?.address}
          onChange={(e) => 
            setEditHouse({...editHouse, address: e.target.value })
          }
        />
      </div>
    { loading ?(  <Button>
        <Loader2 className='animate-spin'/>
      </Button>):(
          <Button onClick={handleSubmitEdit}>
          Edit House
        </Button>
      )}
 </DialogContent>
</Dialog>
    </div>
  );
};

export default Page;
