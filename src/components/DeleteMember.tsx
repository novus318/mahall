import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';

const DeleteMember = ({ memberId, houseId }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleDelete = async () => {
    if (!memberId || !houseId) {
        toast({
            title:'Member ID or House ID is missing.',
            variant: "destructive",
        })
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(`${apiUrl}/api/member/delete/${memberId}`);
      
      if (response.data.success) {
        navigate.push(`/house/house-details/${houseId}`);
      }
    } catch (error: any) {
   toast({
    title: "Error deleting member",
    description: error?.response?.data?.message || error.message || 'Something went wrong',
    variant: "destructive",
   })
    } finally {
      setLoading(false);
    }
  };

  return (
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </Button>
  );
};

export default DeleteMember;
