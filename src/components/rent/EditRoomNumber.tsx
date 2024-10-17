'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FilePenIcon, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from '../ui/use-toast'

const EditRoomNumber = ({roomId,buildingId,fetchRoomDetails,room,building}:any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [roomNumber, setRoomNumber] = useState(room)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [buildingName, setBuildingName] = useState(building)
    const [showRoomDialog, setShowRoomDialog] = useState(false);

    const handleSubmit = async () => {
        setLoading(true)
        const data = {
          roomNumber,
          buildingName,
        }
        try {
          const response = await axios.put(`${apiUrl}/api/rent/edit-room/${buildingId}/${roomId}`, data)
          if (response.data.success) {
            toast({
              title: 'Edited successfully',
              variant: 'default',
            })
            setShowRoomDialog(false);
            setLoading(false)
            fetchRoomDetails()
          }
        } catch (error: any) {
          toast({
            title: 'Failed to edit building',
            description: error.response?.data?.message || error.message || 'Something went wrong',
            variant: 'destructive',
          })
          setLoading(false)
        }
      }
  return (
        <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogTrigger asChild>
       <Button
      size='sm' variant="outline">
      <FilePenIcon className="h-4 w-4 mr-2" />
      Edit
    </Button>
    </DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit room number and building name </DialogTitle>
            <Input
              type="text"
              placeholder={`Room Number`}
              value={roomNumber}
              onChange={(e: any) => setRoomNumber(e.target.value)}
              className='flex-grow py-2'
            />
            <Input
              type="text"
              placeholder={`Building Name`}
              value={buildingName}
              onChange={(e: any) => setBuildingName(e.target.value)}
              className='flex-grow py-2'
              disabled={loading}
              />
            <DialogFooter>
              <Button size='sm' variant="outline" onClick={() => setShowRoomDialog(false)}>Cancel</Button>
              {loading ? (
                <Button size='sm' disabled>
                  <Loader2 className='animate-spin' />
                </Button>
              ) : (
                <Button size='sm'
                  disabled={loading} onClick={handleSubmit}>
                    {loading ? <Loader2 className='animate-spin'/>:'Update'}
                  </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}

export default EditRoomNumber
