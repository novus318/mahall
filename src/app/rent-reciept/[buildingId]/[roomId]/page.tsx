'use client';

import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import DownloadrentReciept from '@/components/DownloadrentReciept';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
        buildingId: string;
        roomId: string;
    };
}

const PageComponent = ({ params }: PageProps) => {
    const router = useRouter()
    const { buildingId, roomId } = params;
    const [room, setRoom] = useState<any>(null);
    const [contractDetails, setContractDetails] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    const fetchRoomDetails = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/rent/get-ByRoom/${buildingId}/${roomId}`);
            const room = response.data.roomDetails;
            const activeContract = room.contractHistory.find((contract: any) => contract.status === 'active');
            if (activeContract) {
                setContractDetails(activeContract);
            }
            setRoom(room);
        } catch (error) {
            console.error('Error fetching room details:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchRoomDetails();
    }, [apiUrl, buildingId, roomId]);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (!room) {
        return <div>No room details found.</div>;
    }
    const handlePayNowClick =async(r:any,c:any)=>{
       router.push(`/pay/${room.roomNumber}/${r.amount}/${c.tenant.name}`)
     }
    return (
        <>
            <div className='max-w-6xl m-auto bg-gray-100 pt-2 px-1 pb-1 rounded-t-md mt-5'>
                <div className="overflow-auto bg-white rounded-t-md">
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
                                                <Button size='sm'
                                                onClick={()=>{
                                                    handlePayNowClick(rent,contractDetails)
                                                }}>
                                                    Pay now
                                                </Button>
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
        </>
    );
};

const Page = ({ params }: any) => (
    <Suspense fallback={<SkeletonLoader />}>
        <PageComponent params={params} />
    </Suspense>
);

export default Page;
