'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Logo from '@/images/logo.svg';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const Login = () => {
  const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [pin, setPin] = useState('');
    const [Spin, setSpin] = useState(false)

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    try {
     setSpin(true)
      const response = await axios.post(`${apiUrl}/api/auth/login`, { pin });
          
      if (response.data.success) {
        localStorage.setItem('token',response.data.token);
        router.push('/dashboard');
        setSpin(false)
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  };
  
  const tokenVerify=async()=>{
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const response = await axios.post(`${apiUrl}/api/auth/verify`, { storedToken });
      if (response.data.success) {
        router.push('/dashboard');
      } else {
        localStorage.removeItem('token');
      }
    }
  }
  useEffect(() => {
  tokenVerify();
  }, []); 
  return (
  <>
  {Spin ?
  (<Spinner/>):( <>
    <div className="flex items-center justify-center h-screen text-white">
     <div className="bg-gray-100 p-8 rounded shadow-md max-w-4xl mx-3">
       <div className="flex justify-center mb-10 border p-6 rounded-md bg-white">
        <img src='/logo.svg' alt="Logo" className='h-24' />
       </div>
       <h2 className="text-3xl text-zinc-800 font-bold mb-6">Welcome to Mahal</h2>
       <form onSubmit={handleSubmit}>
         <div className="mb-4">
           <Input
             type="password"
             placeholder="Enter your pin"
             className="w-full text-black"
             value={pin}
             onChange={(e) => setPin(e.target.value)}
           />
         </div>
         <Button
           type="submit"
           className="w-full  focus:outline-none"
         >
           Login
         </Button>
       </form>
     </div>
   </div>
 </>)}
 </>
  )
}

export default Login