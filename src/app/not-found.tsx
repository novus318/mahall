'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


const Notfound = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 1000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Page Not Found</h1>
      <p>Redirecting...</p>
    </div>
  );
};

export default Notfound;
