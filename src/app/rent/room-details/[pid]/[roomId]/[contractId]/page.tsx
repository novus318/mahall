'use client';

import { Card, CardContent } from '@/components/ui/card';
import { withAuth } from '@/components/withAuth';
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, isBefore } from 'date-fns';
import UpdateDeposit from '@/components/UpdateDeposit';
import DownloadrentReciept from '@/components/DownloadrentReciept';
import ReturnDeposit from '@/components/ReturnDeposit';
import ContractDeposit from '@/components/ContractDeposit';
import AdvancePay from '@/components/rent/AdvancePay';
import EditContract from '@/components/rent/EditContract';
import EditRoomNumber from '@/components/rent/EditRoomNumber';

const SkeletonLoader = () => (
  <div className="animate-pulse p-2">
    <div className="mb-4 flex justify-between items-center">
      <div className="bg-gray-300 h-8 w-24 rounded"></div>
      <div className="bg-gray-300 h-8 w-24 rounded"></div>
    </div>
    <Card>
      <div className="h-12 bg-gray-200 rounded-t-md mb-2"></div>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-3 text-sm">
          <div className="bg-gray-200 h-6 col-span-1"></div>
          <div className="bg-gray-200 h-6 col-span-2"></div>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <div className="bg-gray-200 h-6 col-span-1"></div>
          <div className="bg-gray-200 h-6 col-span-2"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

interface PageProps {
  params: {
    pid: string;
    roomId: string;
    contractId?: string;
  };
}

const PageComponent = ({ params }: PageProps) => {
  const { pid, roomId,contractId } = params;
  const [room, setRoom] = useState<any>(null);
  const [buildingName, setBuildingName] = useState<any>(null);
  const [buildingID, setBuildingID] = useState<any>(null)
  const [contractDetails, setContractDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/rent/get-ByRoom/${pid}/${roomId}/${contractId}`);
      const room = response.data.roomDetails;
      const activeContract = room.contract;
      if (activeContract) {
        setContractDetails(activeContract);
      }
      setBuildingID(room.buildingID)
      setBuildingName(room.buildingName)
      setRoom(room);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchRoomDetails();
  }, [apiUrl, pid, roomId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!room) {
    return <div>No room details found.</div>;
  }

  return (
    <>
      <div className="mt-2 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <Link href={`/rent`} className="bg-gray-900 text-white rounded-sm py-2 px-3 text-sm">
            Back
          </Link>
          <div className="grid">
            <h4 className='font-bold text-muted-foreground'>
              Room number: {room?.roomNumber}
            </h4>
            <h4 className='font-bold text-muted-foreground'>
              Building: {buildingID} - {buildingName}
            </h4>
            <EditRoomNumber roomId={roomId} buildingId={pid} fetchRoomDetails={fetchRoomDetails} room={room?.roomNumber} building={buildingName}/>
          </div>
        </div>
      </div>
      {!room?.contract ? (
        <div>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center md:items-center space-y-2 md:space-y-0 p-4">
            <div>
              <h4 className="text-sm font-medium">No contract are active.</h4>
              <p className='text-xs text-muted-foreground'>you are requested to create one</p>
            </div>
            <Link href={`/rent/contract-create/${pid}/${roomId}`} className="text-sm font-medium bg-gray-900 text-white px-2 py-1 rounded-sm">
              Create Contract
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
          {contractDetails && (
            <div className="grid gap-8">
              <div className="grid gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Rental Contract Details - {contractDetails?.shop}</h1>
                  <div className="text-base font-bold space-x-2">
                    {contractDetails?.to && isBefore(new Date(contractDetails.to), new Date()) ? (
                      <>
                        {contractDetails?.depositStatus === 'Paid' ? (
                          <ReturnDeposit contractDetails={contractDetails} roomId={roomId} buildingId={pid} fetchRoomDetails={fetchRoomDetails} />
                        ) : (
                          <Link href={`/rent/contract-create/${pid}/${roomId}`} className="mr-2 text-sm font-medium bg-gray-900 text-white px-2 py-1 rounded-sm">
                            Create Contract
                          </Link>
                        )}
                        <span className="text-red-600">Your contract has been expired</span>
                      </>
                    ) : (
                      <div className='flex justify-between items-center'>
                        <span className={contractDetails?.status ==='inactive' ? 'text-yellow-600': 'text-green-700'}>Contract {contractDetails?.status}</span>
                        {contractDetails?.depositStatus === 'Paid' &&
                          <ReturnDeposit contractDetails={contractDetails} roomId={roomId} buildingId={pid} fetchRoomDetails={fetchRoomDetails} />
                        }
                      </div>
                    )}
                  </div>
                  {contractDetails?.status === 'active' && 
                  <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
                  <EditContract buildingID={pid} roomId={roomId} fetchRoomDetails={fetchRoomDetails} contractDetails={contractDetails}/>
                  <AdvancePay buildingID={pid} roomId={roomId} fetchRoomDetails={fetchRoomDetails} contractId={contractDetails._id}/>
                </div>
                }
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Advance payment</div>
                      <div>₹{(contractDetails?.advancePayment||0).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">From</div>
                      <div>{contractDetails?.from ? format(contractDetails?.from, 'PPP') : 'Null'}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">To</div>
                      <div>{contractDetails?.to ? format(contractDetails?.to, 'PPP') : 'Null'}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Rent</div>
                      <div>₹{(contractDetails?.rent || 0).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Deposit</div>
                      <div className='text-right'>
                        <span>₹{(contractDetails?.deposit || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Deposit status</div>
                      <div>
                        <UpdateDeposit contractDetails={contractDetails} roomId={roomId} buildingId={pid} fetchRoomDetails={fetchRoomDetails} />
                      </div>
                    </div>
                    {contractDetails?.depositStatus === 'Returned' && (
                      <div className="space-y-2">
                        {contractDetails?.depositCollection
                          ?.filter((deposit: any) => deposit.transactionType === 'Returned')
                          .map((returnedDeposit: any) => (
                            <div key={returnedDeposit._id} className="flex flex-col space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Returned Amount</div>
                                <div>₹{returnedDeposit.amount}</div>
                              </div>
                              {returnedDeposit.deduction > 0 && (
                                <>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Deduction</div>
                                    <div>₹{returnedDeposit.deduction}</div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Deduction Reason</div>
                                    <div>{returnedDeposit.deductionReason}</div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Tenant Name</div>
                      <div>{contractDetails?.tenant?.name}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Aadhaar Number</div>
                      <div>{contractDetails?.tenant?.aadhaar}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Place</div>
                      <div>{contractDetails?.tenant?.place}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Phone Number</div>
                      <div>{contractDetails?.tenant?.number}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Rent Collection</h2>
                </div>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractDetails?.rentCollection?.slice().reverse().map((rent: any) => {
                        return (
                          <TableRow key={rent._id}>
                            <TableCell>{rent?.period}</TableCell>
                            <TableCell>₹{rent.amount}</TableCell>
                            <TableCell>
                              {rent?.status === 'Pending' ? (
                                <Badge>{rent.status}</Badge>
                              ) : rent?.status === 'Rejected' ?
                                (
                                  <Badge color="error">{rent.status}</Badge>
                                ) : (
                                  <DownloadrentReciept collection={rent} contractDetails={contractDetails} room={room} />
                                )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {contractDetails?.rentCollection?.length === 0 &&
                        <TableRow>
                          <TableCell colSpan={3}>No rent collection found.</TableCell>
                        </TableRow>
                      }
                    </TableBody>
                  </Table>
                </div>
              </div>
              <ContractDeposit contractDetails={contractDetails} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const Page = withAuth(({ params }: any) => (
  <Suspense fallback={<SkeletonLoader />}>
    <PageComponent params={params} />
  </Suspense>
));

export default Page;
