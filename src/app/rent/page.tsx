'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import axios from 'axios'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent } from '@/components/ui/card'


type Room = {
  _id: string;
  roomNumber: string;
};

type Building = {
  _id: string;
  buildingID: string;
  buildingName: string;
  place: string;
  rooms: Room[];
};

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

const Page = () => {
  const { toast } = useToast()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [buildings, setBuildings] = useState<Building[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/rent/get-buildings`)
        if (response.data.success) {
          setBuildings(response.data.buildings)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        toast({
          title: 'network error',
          variant: 'destructive',
        })
      }
    }

    fetchBuildings()
  }, [])

  // Filter buildings based on search term
  const filteredBuildings = buildings.filter(building =>
    building.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.buildingID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.place.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
        <div className="flex justify-between items-center mb-4 gap-2">
          <Input
            placeholder="Search buildings..."
            className="w-2/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link href='/rent/create-building' className='bg-gray-900 text-white py-1 px-2 rounded text-xs md:text-base'>
            Create Building
          </Link>
        </div>

        <div>
     {loading ? (
      <SkeletonLoader/>
     ):(
         <div className="grid gap-6">
         {filteredBuildings.length > 0 ? (
             filteredBuildings.map(building => (
         <div key={building._id} className="grid gap-4 border rounded-md p-4 bg-background">
             <div className="flex items-center justify-between">
               <div className="grid gap-1">
                 <h2 className="text-xl font-bold">{building?.buildingName}</h2>
                 <p className="text-muted-foreground text-xs">ID: {building?.buildingID}</p>
                 <p className="text-muted-foreground">Place: {building?.place}</p>
               </div>
              <Button
              size='sm'>
              <PlusIcon className="w-4 h-4" />
              Add Room
              </Button>
             </div>
             <div className="grid gap-4">
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {building?.rooms.map(room => (
               <div key={room._id} className="grid gap-2 border rounded-sm p-4 bg-muted">
                   <div className="flex items-center justify-between">
                     <div className="text-sm font-medium">Room number: {room?.roomNumber}</div>
                     <Link
                       href={`/rent/room-details/${building._id}/${room._id}`}
                       className="text-xs font-medium bg-gray-900 text-white px-2 py-1 rounded-md"
                       prefetch={false}
                     >
                       Details
                     </Link>
                   </div>
                 </div>
   ))}
                 </div>
               </div>
             </div>
       ))
     ) : (
       <div className="text-center text-gray-600 text-sm">
        <h4
        className="text-lg font-bold"
        > No buildings...</h4>
       </div>
     )}
           </div>
     )}
        </div>
      </div>
    </div>
  )
}

export default Page
