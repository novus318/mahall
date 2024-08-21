'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
  const { toast } = useToast()
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [buildingId, setBuildingId] = useState('')
  const [buildingName, setBuildingName] = useState('')
  const [buildingPlace, setBuildingPlace] = useState('')
  const [roomNumbers, setRoomNumbers] = useState([''])

  const handleRoomChange = (index:any, value:any) => {
    const updatedRooms = [...roomNumbers]
    updatedRooms[index] = value
    setRoomNumbers(updatedRooms)
  }

  const addRoomField = () => {
    setRoomNumbers([...roomNumbers, ''])
  }

  const deleteRoomField = (index:any) => {
    const updatedRooms = [...roomNumbers]
    updatedRooms.splice(index, 1)
    setRoomNumbers(updatedRooms)
  }



  const validate = () => {
    const uniqueRooms = new Set(roomNumbers)
    if (uniqueRooms.size !== roomNumbers.length) {
      toast({
        title: 'All room numbers should be unique',
        variant: 'destructive',
      })
      return
    }
    let isValid = true;
    if (!buildingId) {
      toast({
        title: 'Building ID is required',
        variant: 'destructive',
      });
      isValid = false;
    }
    if (!buildingName) {
      toast({
        title: 'Building Name is required',
        variant: 'destructive',
      });
      isValid = false;
    }
    if (!buildingPlace) {
      toast({
        title: 'Building Place is required',
        variant: 'destructive',
      });
      isValid = false;
    }
    if (uniqueRooms.size !== roomNumbers.length) {
      toast({
        title: 'All room numbers should be unique',
        variant: 'destructive',
      })
      return false;
    }
    if (roomNumbers[0] === '') {
      toast({
        title: 'At least one room number is required',
        variant: 'destructive',
      })
      return false;
    }
    return isValid;
};
  const handleSubmit = async() => {
    if (!validate()) return;
    const data = {
      buildingName:buildingName,
      place:buildingPlace,
      buildingID:buildingId,
      rooms:roomNumbers
    }
    try {
      const response = await axios.post(`${apiUrl}/api/rent/create-building`, data)
      if (response.data.success) {
        toast({
          title: 'Building added successfully',
          variant:'default',
        })
        setBuildingId('')
        setBuildingName('')
        setBuildingPlace('')
        setRoomNumbers([''])
        router.push('/rent')
      }
    } catch (error) {
      
    }
  }
  return (
    <div className='p-2'>
    <div className='max-w-5xl mx-auto'>
        <div className="mb-4 flex justify-between items-center">
            <Link href={`/rent`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                Back
            </Link>
        </div>

        <div className='mx-auto p-4 bg-white rounded-md border my-8'>
          <h2 className='text-2xl font-semibold mb-4'>Add New Building</h2>
          <div className='space-y-4 mb-2'>
            <div>
              <Input
                type="text"
                placeholder="Building ID"
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Building Name"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Building Place"
                value={buildingPlace}
                onChange={(e) => setBuildingPlace(e.target.value)}
              />
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-2'>Room Numbers</h3>
              {roomNumbers.map((room, index) => (
                <div key={index} className='flex items-center mb-2 gap-2'>
                  <Input
                    type="text"
                    placeholder={`Room Number ${index + 1}`}
                    value={room}
                    onChange={(e) => handleRoomChange(index, e.target.value)}
                    className='flex-grow py-2'
                  />
                  <Button
                    type="button"
                    onClick={() => deleteRoomField(index)}
                    size='sm'
                    variant='destructive'
                  >
                    <Trash2 className='h-4 w-4'/>
                  </Button>
                </div>
              ))}
              <Button
              size='sm' type="button" onClick={addRoomField}>Add Room</Button>
            </div>
            <div className='mt-4'>
              <Button onClick={handleSubmit}>Create Building</Button>
            </div>
          </div>
        </div>
</div>
</div>
  )
}

export default Page
