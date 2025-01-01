'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sendVerification } from '@/utils/verifyNumber'
import { toast } from '@/components/ui/use-toast'

interface User {
  id: string
  houseNumber: string
  head: string
  number: string
  status: 'active' | 'inactive'
}

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [amount, setAmount] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [houses, setHouses] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeVerification, setActiveVerification] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [sendOtp, setSendOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

const fetchHouses = async () => {
  const response = await axios.get(`${apiUrl}/api/house/get`);
  if (response.data.success) {
    setHouses(response.data.houses);
  } else {
    console.error('Error fetching houses');
  }
}
  useEffect(() => {
    fetchHouses()
  }, [])

  const filteredHouses = houses.filter((house: any) =>
    house?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house?.familyHead?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHouses = useMemo(() => {
    return [...filteredHouses].sort((a: any, b: any) => {
      const numA = a.number.toString().toLowerCase();
      const numB = b.number.toString().toLowerCase();
      return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [filteredHouses]);


  const handleGeneratePaymentLink = async () => {
    try {
      setLoading1(true);
      const response = await axios.post(`${apiUrl}/api/razorpay/generate-payment/link`, {
        house: houseNumber,
        amount,
      })
      if(response.data.success){
        toast({
          title: 'Payment Link Generated and Sent on WhatsApp',
          variant: 'default',
        });
        setAmount('');
        setHouseNumber('');
        setLoading1(false);
      }
    } catch (error:any) {
      setLoading1(false);
      toast({
        title: 'Error generating payment link',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  }


  const handleSendOtp = async (familyHead: any) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate random OTP
    setActiveVerification(familyHead._id);

    const success = await sendVerification({
      data: { number: familyHead.whatsappNumber, otp },
    });
    if (success) {
        setSendOtp(otp)
    }else{
        setActiveVerification(null);
    }
  };

  const handleValidateOtp = async (familyHead: any) => {
    setLoading(true);
  
    try {
      // Validate the OTP
      if (enteredOtp === sendOtp) {
        toast({
          title: 'OTP verified',
          variant: 'default',
        });
  
        // Send API request to update the member's number
        const response = await axios.put(`${apiUrl}/api/member/update-member/number`, {
          familyHead,
        });
  
        if (response.data.success) {
          fetchHouses(); // Refresh the house list
          setActiveVerification(null); // Clear verification state
          setSendOtp(''); // Reset the sent OTP
          setEnteredOtp(''); // Reset the entered OTP
        }
      } else {
        // Handle mismatched OTP
        toast({
          title: 'OTP does not match',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      // Handle errors
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Validation failed.',
        variant: 'destructive',
      });
    } finally {
      // Ensure loading state is turned off
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Generate Payment Link</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full sm:w-1/3"
        />
           <Input
          type="text"
          placeholder="Enter house number"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Button onClick={handleGeneratePaymentLink} disabled={loading1} className="w-full sm:w-auto">
          { loading1 ? <Loader2 className='animate-spin'/>:"Generate Payment Link"}
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Users Section */}
  <Card>
    <CardHeader>
      <CardTitle>Users</CardTitle>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Input
          placeholder="Search houses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2"
        />
      </div>
    </CardHeader>
    <CardContent>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>House Number</TableHead>
            <TableHead>Head</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHouses.map((house: any) => (
            <TableRow key={house?._id}>
              <TableCell>{house?.number}</TableCell>
              <TableCell>{house?.familyHead?.name || 'NIL'}</TableCell>
              <TableCell>{house?.familyHead?.whatsappNumber || 'NIL'}</TableCell>
              <TableCell>
            {house.familyHead?.is_mobile_verified ? (
              <CheckCircle className="text-green-500" />
            ) : activeVerification === house.familyHead?._id ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-24"
                />
                <Button
                  onClick={() => handleValidateOtp(house.familyHead)}
                  className="text-sm px-2 py-1"
                  disabled={loading}
                >
                  {loading ? 'Validating...' : 'Validate OTP'}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => handleSendOtp(house.familyHead)}
                className="text-sm px-2 py-1"
                disabled={!!activeVerification} // Disable other buttons during active verification
              >
                Verify Number
              </Button>
            )}
          </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>

    </div>
  )
}

export default withAuth(Page)
