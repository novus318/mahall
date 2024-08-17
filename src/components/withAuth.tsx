'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import axios from 'axios';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [ok, setOk] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          setOk(false);
          return;
        }

        try {
          const response = await axios.post(`${apiUrl}/api/auth/verify`,{ token
            
           });

          if (response.data.success) {
            setOk(true);
          } else {
            setOk(false);
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setOk(false);
        }
      };

      checkAuth();
    }, [router]);

    if (ok === null) {
      return <Spinner />;
    }

    if (typeof window === 'undefined' || ok === false) {
      router.push('/login');
      return null;
    }

    return <Component {...props} />;
  };
}
