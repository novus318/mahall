'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'

const BookNumbers = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);

  // States for storing the current receipt numbers
  const [collectionReceiptNo, setCollectionReceiptNo] = useState('');
  const [paymentReceiptNo, setPaymentReceiptNo] = useState('');
  const [receiptReceiptNo, setReceiptReceiptNo] = useState('');

  // States for individual edit modes
  const [editCollection, setEditCollection] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [editReceipt, setEditReceipt] = useState(false);

  // States for the edited receipt numbers
  const [editedCollectionNo, setEditedCollectionNo] = useState('');
  const [editedPaymentNo, setEditedPaymentNo] = useState('');
  const [editedReceiptNo, setEditedReceiptNo] = useState('');

  useEffect(() => {
    // Fetching the initial numbers when the component mounts
    fetchReceiptNumbers();
  }, []);

  const fetchReceiptNumbers = () => {
    // Fetch Collection Receipt Number
    axios
      .get(`${apiUrl}/api/setting/get-collection/number`)
      .then((response) => {
        if (response.data.success) {
          setCollectionReceiptNo(response.data.Number);
          setEditedCollectionNo(response.data.Number);
        }
      })
      .catch((error) => {
        console.log('Error fetching collection receipt number:', error);
      });

    // Fetch Payment Receipt Number
    axios
      .get(`${apiUrl}/api/pay/get-payment/number`)
      .then((response) => {
        if (response.data.success) {
          setPaymentReceiptNo(response.data.paymentNumber);
          setEditedPaymentNo(response.data.paymentNumber);
        }
      })
      .catch((error) => {
        console.log('Error fetching payment receipt number:', error);
      });

    // Fetch Receipt Number
    axios
      .get(`${apiUrl}/api/reciept/get-reciept/number`)
      .then((response) => {
        if (response.data.success) {
          setReceiptReceiptNo(response.data.Number);
          setEditedReceiptNo(response.data.Number);
        }
      })
      .catch((error) => {
        console.log('Error fetching receipt number:', error);
      });
  };

  // Handlers for updating each receipt number
  const handleSaveCollection = () => {
    setLoading(true);
    axios.put(`${apiUrl}/api/setting/update-collectionReceiptNumber`, {
      collectionReceiptNumber: editedCollectionNo,
    })
    .then(() => {
      setEditCollection(false);
      setCollectionReceiptNo(editedCollectionNo);
      fetchReceiptNumbers()
    })
    .catch((error) => {
      console.log('Error updating collection receipt number:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleSavePayment = () => {
    setLoading(true);
    axios.put(`${apiUrl}/api/setting/update-paymentReceiptNumber`, {
      paymentReceiptNumber: editedPaymentNo,
    })
    .then(() => {
      setEditPayment(false);
      setPaymentReceiptNo(editedPaymentNo);
      fetchReceiptNumbers()
    })
    .catch((error) => {
      console.log('Error updating payment receipt number:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleSaveReceipt = () => {
    setLoading(true);
    axios.put(`${apiUrl}/api/setting/update-receiptReceiptNumber`, {
      receiptReceiptNumber: editedReceiptNo,
    })
    .then(() => {
      setEditReceipt(false);
      setReceiptReceiptNo(editedReceiptNo);
      fetchReceiptNumbers()
    })
    .catch((error) => {
      console.log('Error updating receipt number:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <section id="books">
      <Card>
        <CardHeader>
          <CardTitle>Reset Book Numbers</CardTitle>
          <CardDescription>Update the numbers for the three books individually.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="items-center flex gap-2">
           <div> <Label>House Collection Receipt Number</Label>
            <Input
              value={editCollection ? editedCollectionNo : collectionReceiptNo}
              disabled={!editCollection}
              onChange={(e) => setEditedCollectionNo(e.target.value)}
              placeholder='House Collection Receipt Number'
            /></div>
           <div className='mt-4'>
           {editCollection ? (
              <Button size='sm' onClick={handleSaveCollection} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <Button size='sm' onClick={() => setEditCollection(true)}>Edit</Button>
            )}
           </div>
          </div>

          {/* Payment Receipt Number */}
          <div className="items-center flex gap-2">
            <div><Label>Payment Receipt Number</Label>
            <Input
              value={editPayment ? editedPaymentNo : paymentReceiptNo}
              disabled={!editPayment}
              onChange={(e) => setEditedPaymentNo(e.target.value)}
              placeholder='Payment Receipt Number'
            /></div>
          <div className='mt-4'> 
          {editPayment ? (
              <Button size='sm' onClick={handleSavePayment} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <Button size='sm' onClick={() => setEditPayment(true)}>Edit</Button>
            )}
          </div>
          </div>

          {/* Receipt Number */}
          <div className="items-center flex gap-2">
            <div>
            <Label>Receipt Number</Label>
            <Input
              value={editReceipt ? editedReceiptNo : receiptReceiptNo}
              disabled={!editReceipt}
              onChange={(e) => setEditedReceiptNo(e.target.value)}
              placeholder='Receipt Number'
            />
            </div>
            <div className='mt-4'>
            {editReceipt ? (
              <Button size='sm' onClick={handleSaveReceipt} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <Button size='sm' onClick={() => setEditReceipt(true)}>Edit</Button>
            )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BookNumbers;
