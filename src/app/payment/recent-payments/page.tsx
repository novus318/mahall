'use client'
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { withAuth } from '@/components/withAuth'
import axios from 'axios';
import { format, } from 'date-fns';
import Link from 'next/link';
import React, { useEffect,  useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import RejectPayment from '@/components/RejectPayment';
import { ChevronLeft, ChevronRight } from 'lucide-react';


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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);


  const fetchPayments = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/pay/recent-payments?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setPayments(response.data.payments);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.totalCount);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return {
      dayMonthYear: format(date, 'dd MMM yyyy'),
      time: format(date, 'hh:mm a'),
    };
  };




  const isInCurrentMonthAndWithin30Days = (paymentDate:any) => {
    const today = new Date();
    const payment = new Date(paymentDate);
  
    // Calculate the start of the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Calculate the end of the current month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    // Calculate the date that is 30 days after the payment date
    const thirtyDaysAfterPayment = new Date(payment);
    thirtyDaysAfterPayment.setDate(thirtyDaysAfterPayment.getDate() + 30);
  
    // Check if the payment date is in the current month
    const isPaymentInCurrentMonth = payment >= startOfMonth && payment <= endOfMonth;
  
    // Check if today is within 30 days of the payment date
    const isWithin30Days = today <= thirtyDaysAfterPayment;
  
    return isPaymentInCurrentMonth && isWithin30Days;
  };
  
  
  if (loading) return <RecentPaymentsSkeleton />;
  return (
    <div className='w-full py-5 px-2'>
      <Link href='/payment' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
        Back
      </Link>
      <div className='max-w-6xl m-auto my-3'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className="text-2xl font-semibold">Recent payments</h2>
          <p className='text-sm text-gray-600'>Total: {totalCount} payments</p>
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
                const inCurrentMonth = isInCurrentMonthAndWithin30Days(payment?.date)
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
                      <div className="flex gap-2 items-center">
                        <Link href={`/payment/edit/${payment?._id}`} className='text-white bg-gray-950 py-2 px-3 rounded-md hover:underline'>
                          Edit
                        </Link>
                       <RejectPayment paymentId={payment?._id} fetchPayments={fetchPayments}/>
                        <div className='underline text-slate-600'
                        onClick={()=>{
                          setIsOpen(true)
                          setSelectedPayment(payment)
                        }}>
                         view
                       </div>
                      </div>
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

        {/* Pagination Controls */}
        <div className='flex justify-between items-center mt-4 px-2'>
          <div className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </div>
          <div className='flex gap-2'>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
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
              <span>{selectedPayment?.paymentTo}</span>
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
