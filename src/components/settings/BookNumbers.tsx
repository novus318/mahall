'use client'
import React, { useEffect, useState } from 'react'
import { Card,CardContent,CardDescription,CardTitle,CardHeader } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'

const BookNumbers = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  return (
    <section id="books">
    <Card>
      <CardHeader>
        <CardTitle>Reset Book Numbers</CardTitle>
        <CardDescription>Update the numbers for the three books.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="items-center">
            <Label>House collection Reciept Number</Label>
            <Input
              placeholder='House collection Reciept Number'
            />
          </div>
          <div className="items-center">
            <Label>Payment Reciept Number</Label>
            <Input
              placeholder='Payment Reciept Number'
            />
          </div>
          <div className="items-center">
            <Label>Reciept Number</Label>
            <Input
              placeholder='Reciept Number'
            />
          </div>
      </CardContent>
    </Card>
  </section>
  )
}

export default BookNumbers
