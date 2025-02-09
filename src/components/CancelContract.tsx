import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';

interface ContractDetails {
  _id: string;
  status: 'active' | 'inactive';
  deposit: number;
}



interface CancelContractProps {
  contractDetails: ContractDetails;
  roomId: string;
  buildingId: string;
  fetchRoomDetails: () => void;
}

const CancelContract: React.FC<CancelContractProps> = ({
  contractDetails,
  roomId,
  buildingId,
  fetchRoomDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleUpdateReturn = async () => {
    setLoading(true);
    try {
      const data = {
        status: 'Returned',
      };
      const response = await axios.post(
        `${apiUrl}/api/rent/cancel-contract/${buildingId}/${roomId}/${contractDetails._id}`,
        data
      );

      if (response.data.success) {
        toast({
          title: 'Contract Cancelled Successfully',
          variant: 'default',
        });
        setIsOpen(false);
        fetchRoomDetails();
      }
    } catch (error: any) {
      toast({
        title: 'Error Cancelling Contract',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild>
        <Button size="sm">
          {contractDetails?.status === 'active' && 'Cancel Contract'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure you want to cancel?</DialogTitle>
        <p className="font-semibold text-muted-foreground">Deposit: ₹{contractDetails?.deposit}</p>

        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {loading ? (
            <Button size="sm" disabled>
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button size="sm" disabled={loading} onClick={handleUpdateReturn}>
              Yes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelContract;