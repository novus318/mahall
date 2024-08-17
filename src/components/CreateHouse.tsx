import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import axios from 'axios'
import { useHouseContext } from '@/context/HouseContext'
import { Loader2 } from 'lucide-react'

const CreateHouse = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [houseName, setHouseName] = useState<string>('');
    const [houseAddress, setHouseAddress] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setloading] = useState(false);
    const { fetchHouses} = useHouseContext();
    const handleSubmit = async () => {
        setloading(true)
        try {
          const newHouse = {
            number: houseNumber,
            name: houseName,
            address: houseAddress,
          };
    
          // Send POST request to create a new house
          const response = await axios.post(`${apiUrl}/api/house/create-house`, newHouse);
    
          if (response.data.success) {
            console.log('House created successfully:', response.data.house);
            setloading(false)
            setIsOpen(false);
            fetchHouses()
            setHouseNumber('');
            setHouseName('');
            setHouseAddress('');
          }
        } catch (error) {
            setloading(false)
          console.error('Error creating house:', error);
        }
      };
  return (
    <Dialog open={isOpen} onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v)
        }
      }}>
    <DialogTrigger onClick={() => { setIsOpen(true) }} asChild >
    <Button 
    size='sm'>
        Create House
    </Button>
  </DialogTrigger>
   <DialogContent>
   <DialogTitle>
     Create New House
   </DialogTitle>
      <div>
        <Input
          type="text"
          placeholder="House Number"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <Input
        disabled={loading}
          type="text"
          placeholder="House Name"
          value={houseName}
          onChange={(e) => setHouseName(e.target.value)}
        />
      </div>
      <div>
        <Textarea
        disabled={loading}
          placeholder="Address"
          value={houseAddress}
          onChange={(e) => setHouseAddress(e.target.value)}
        />
      </div>
    { loading ?(  <Button onClick={handleSubmit}>
        <Loader2 className='animate-spin'/>
      </Button>):(
          <Button onClick={handleSubmit}>
          Create House
        </Button>
      )}
 </DialogContent>
 </Dialog>
  )
}

export default CreateHouse
