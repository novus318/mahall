'use client'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { withAuth } from '@/components/withAuth'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import BookNumbers from '@/components/settings/BookNumbers'

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [showResetDialog, setShowResetDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    collectionReceiptNumber: '',
    paymentReceiptNumber:'',
    receiptReceiptNumber:''
  });

  const getinitialNumbers =async()=>{
    axios.get(`${apiUrl}/api/setting/receiptNumbers`).then(response => {
      if (response.data.success) {
      setFormData({
        collectionReceiptNumber: response.data.receiptNumbers[0].collectionReceiptNumber.initialNumber,
        paymentReceiptNumber: response.data.receiptNumbers[0].paymentReceiptNumber.initialNumber,
        receiptReceiptNumber: response.data.receiptNumbers[0].receiptReceiptNumber.initialNumber,
      })}
    })
      .catch(error => {
        console.log("Error fetching accounts:", error)
      })
  }

  useEffect(() => {
    getinitialNumbers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };
  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/setting/update-receipt-numbers`, formData);
if(response.data.success)
    {  
      setShowResetDialog(false);
      setLoading(false);
    }
    } catch (error:any) {
      console.error('Error resetting book numbers:', error);
      setLoading(false);
      toast({
        title: "Error resetting book numbers",
        description: error?.response?.data?.message || error.message || 'something went wrong',
        variant: "destructive",
      });
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    <div className="w-full md:w-1/6 bg-gray-100">
      <Sidebar />
    </div>
    <div className="w-full md:w-5/6 p-4 bg-white">
      <div className="flex justify-between items-center mb-4 gap-2">
        <h1 className='text-3xl text-muted-foreground font-extrabold'>
         Settings
        </h1>
      </div>
     <div className='max-w-xl'>
      <BookNumbers/>
      
     </div>
      </div>
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogTitle>Edit Account</DialogTitle>
          <div>
            <Label>
                House collection Reciept Number
            </Label>
            <Input
              type="text"
              name="collectionReceiptNumber"
              className='mb-2'
              placeholder="House collection Reciept Number"
              disabled={loading}
              value={formData.collectionReceiptNumber}
              onChange={handleInputChange}
            />
              <Label>
                Payment Reciept Number
            </Label>
             <Input
              type="text"
              name="paymentReceiptNumber"
               className='mb-2'
              placeholder="Payment Reciept Number"
              disabled={loading}
              value={formData.paymentReceiptNumber}
              onChange={handleInputChange}
            />
              <Label>
                Reciept Number
            </Label>
             <Input
              type="text"
              name="receiptReceiptNumber"
               className='mb-2'
              placeholder="Reciept Number"
              disabled={loading}
              value={formData.receiptReceiptNumber}
              onChange={handleInputChange}
            />
           
          </div>
          <DialogFooter>
            <Button size='sm' variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button
              disabled={loading} 
              onClick={handleReset}
              size='sm'>Reset</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default withAuth(Page)
