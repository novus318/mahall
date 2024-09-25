'use client'
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format, isSameMonth } from 'date-fns';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'


const RecentPaymentsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Recent payments</h2>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-7 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);


  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/pay/get/payments`);
      if (response.data.success) {
        setPayments(response.data.payments);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };

  // Check if payment date is in the current month
  const isPaymentInCurrentMonth = (dateString: any) => {
    const paymentDate = new Date(dateString);
    return isSameMonth(paymentDate, new Date());
  };

  const handleReject = async (paymentId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to reject this payment?');

    if (!isConfirmed) return; 
    try {
      setLoading(true)
      const response = await axios.put(`${apiUrl}/api/pay/reject-payment/${paymentId}`);
    if(response.data.success){
      fetchPayments();
      setLoading(false)
    }
    } catch (error:any) {
      setLoading(false)
      toast({
        title: 'Error',
        description: error?.response?.data?.error || error.response?.data?.message || error.message  || 'An error occurred while trying to update the payment. Please try again later.',
        variant:'destructive'
      })
    }
  };

  if (loading) return <RecentPaymentsSkeleton />;
  return (
    <div className='w-full py-5 px-2'>
      <Link href='/payment' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
        Back
      </Link>
      <div className='max-w-6xl m-auto my-3'>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent payments</h2>
        </div>
        <div className='rounded-t-md bg-gray-100 p-1'>
          <Table className="bg-white">
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Receipt No.</TableHead>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">To</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const { dayMonthYear, time } = formatDate(payment?.date);
                const inCurrentMonth = isPaymentInCurrentMonth(payment?.date);
                return (
                  <TableRow key={payment?._id} className={payment?.status === 'Rejected' ? 'bg-red-200 hover:bg-red-100' :''}>
                    <TableCell>
                      <div className='text-sm'>{dayMonthYear}</div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.receiptNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.categoryId.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{payment?.memberId? payment?.memberId?.name : payment?.otherRecipient?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>₹{(payment?.total).toFixed(2)}</div>
                    </TableCell>
                   {payment?.status === 'Rejected' ? (
                    <TableCell className='flex gap-2'>
                      <div>
                        <span>Payment rejected</span>
                       </div>
                       <div className='underline text-slate-600'
                         onClick={()=>{
                          setIsOpen(true)
                          setSelectedPayment(payment)
                        }}>
                         view
                       </div>
                    </TableCell>
                   ):(
                    <TableCell>
                    {inCurrentMonth ?(
                      <div className="flex gap-2 items-center">
                        <Link href={`/payment/edit/${payment?._id}`} className='text-white bg-gray-950 py-2 px-3 rounded-md hover:underline'>
                          Edit
                        </Link>
                        <Button
                        disabled={loading}
                        size='sm'
                          variant='destructive'
                          onClick={() => handleReject(payment?._id)}
                        >
                          Reject
                        </Button>
                        <div className='underline text-slate-600'
                        onClick={()=>{
                          setIsOpen(true)
                          setSelectedPayment(payment)
                        }}>
                         view
                       </div>
                      </div>
                    ):(
                      <TableCell>
                      <div className='underline text-slate-600'
                           onClick={()=>{
                             setIsOpen(true)
                             setSelectedPayment(payment)
                           }}>
                            view
                          </div>
                      </TableCell>
                    )}
                  </TableCell>
                   )}
                  </TableRow>
                );
              })}
              {payments.length === 0 && (
                <TableCell colSpan={5} className="text-center text-gray-600 text-sm">
                  <h4 className="text-lg font-bold">No Payments...</h4>
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog
        open={isOpen} onOpenChange={(v) => {
          if (!v) {
            setIsOpen(v)
          }
        }}>
        <DialogContent>
          <DialogTitle>
            Details
          </DialogTitle>
          <div>
            <h3>Payment Details</h3>
            <div>
            <div>
            <label>Date: </label>
              <span>{selectedPayment?.date ? formatDate(selectedPayment?.date).dayMonthYear : 'nil'}</span>
              </div>
             <div>
             <label>Receipt Number: </label>
             <span>{selectedPayment?.receiptNumber}</span>
             </div>
             <div>
             <label>Category:</label>
             <span>{selectedPayment?.categoryId.name}</span>
             </div>
            <div>
            <label>To: </label>
              <span>{selectedPayment?.memberId? selectedPayment?.memberId?.name : selectedPayment?.otherRecipient?.name}</span>
             </div>
              <label>Amount: </label>
              <span>₹{(selectedPayment?.total|| 0).toFixed(2)}</span>
             <div> <label>Status: </label>
             <span>{selectedPayment?.status}</span>
             </div>
             <div>
              <label className='font-bold underline'>items: </label><br/>
              <span>{selectedPayment?.items?.map((item:any)=> (<>{item.description} - ₹{(item?.amount|| 0).toFixed(2)}<br/></>))}</span>

             </div>
      </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withAuth(Page);
