'use client';
import Sidebar from '@/components/Sidebar';
import { withAuth } from '@/components/withAuth';
import React, { useEffect, useRef, useState } from 'react';
import BookNumbers from '@/components/settings/BookNumbers';
import ChangeAdminPass from '@/components/settings/ChangeAdminPass';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const Page = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const otpSentRef = useRef(false);

  const WHATSAPP_API_URL:any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
  const member = { senderNumber: '917560845014' }; 

  // Function to send OTP
  const sendOtp = async () => {
    if (otpSentRef.current) return; 
    otpSentRef.current = true;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); 
    setOtp(generatedOtp);
    
    try {
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: member.senderNumber,
          type: 'template',
          template: {
            name: 'setting_login', 
            language: {
              code: 'en_US',
            },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: generatedOtp
                  },
                ],
              }, {
                "type": "button",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                  {
                    "type": "text",
                    "text": generatedOtp
                  }
            ],
          },
          ],
        },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
      setOtpSent(true);
      toast({
        title: 'OTP sent',
        variant:'default',
      })
    }
    } catch (error:any) {
      toast({
        title: 'Failed to send OTP',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  // Function to verify OTP
  const verifyOtp = () => {
    if (enteredOtp === otp) {
      setOtpVerified(true);
      toast({
        title: 'OTP verified',
        variant:'default',
      })
    } else {
      toast({
        title: 'Invalid OTP',
        variant: 'destructive',
      })
    }
  };

  useEffect(() => {
    if (!otpSent) {
      sendOtp();
    }
  }, [otpSent]);
  

  if (!otpVerified) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4">Verify Your OTP</h1>
          {otpSent ? (
           <>
           <Input
             type="text"
             className="border p-2 w-full mb-4"
             placeholder="Enter OTP"
             value={enteredOtp}
             onChange={(e) => setEnteredOtp(e.target.value)}
             onKeyPress={(e) => {
               if (e.key === 'Enter') {
                 verifyOtp();
               }
             }}
           />
           <Button
             size="sm"
             onClick={verifyOtp}
           >
             Verify OTP
           </Button>
         </>         
          ) : (
            <p>Sending OTP...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h1 className="text-3xl text-muted-foreground font-extrabold">
            Settings
          </h1>
        </div>
        <div className="max-w-xl">
          <BookNumbers />
          <ChangeAdminPass />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
