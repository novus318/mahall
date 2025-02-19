'use client';

import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DownloadrentReciept from '@/components/DownloadrentReciept';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const SkeletonLoader = () => (
    <div className="animate-pulse p-4 space-y-4">
        <div className="flex justify-between items-center">
            <div className="bg-gray-200 h-8 w-1/4 rounded-lg"></div>
            <div className="bg-gray-200 h-8 w-1/6 rounded-lg"></div>
        </div>
        <Card className="rounded-lg shadow-sm">
            <div className="h-12 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-200 h-6 rounded-lg"></div>
                    <div className="bg-gray-200 h-6 col-span-2 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-200 h-6 rounded-lg"></div>
                    <div className="bg-gray-200 h-6 col-span-2 rounded-lg"></div>
                </div>
            </CardContent>
        </Card>
    </div>
);

interface PageProps {
    params: {
        buildingId: string;
        roomId: string;
        contractId?: string;
    };
}

const PageComponent = ({ params }: PageProps) => {
    const router = useRouter();
    const { buildingId, roomId, contractId } = params;
    const [room, setRoom] = useState<any>(null);
    const [contractDetails, setContractDetails] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchRoomDetails = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/rent/get-ByRoom/${buildingId}/${roomId}/${contractId}`);
            const room = response.data.roomDetails;
            const activeContract = room.contract;
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
        return <div className="p-4 text-center text-gray-500">No room details found.</div>;
    }

    const handlePayNowClick = async (r: any, c: any) => {
        router.push(`/rent-pay/${buildingId}/${roomId}/${contractId}/${r._id}`);
    };

    return (
        <div className="p-1 max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                Rent details of {contractDetails?.tenant?.name} - {contractDetails?.shop}
            </h2>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table className="w-full text-xs md:text-sm">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-medium text-gray-600">Month</TableHead>
                            <TableHead className="font-medium text-gray-600">Rent</TableHead>
                            <TableHead className="font-medium text-gray-600">Paid Amount</TableHead>
                            <TableHead className="font-medium text-gray-600">Status</TableHead>
                            <TableHead className="font-medium text-gray-600">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100">
                        {contractDetails?.rentCollection?.slice().reverse().map((rent: any) => (
                            <React.Fragment key={rent._id}>
                                <TableRow className="hover:bg-gray-50 transition-colors">
                                    <TableCell className=" text-gray-700">{rent?.period}</TableCell>
                                    <TableCell className=" text-gray-700">₹{rent?.amount}</TableCell>
                                    <TableCell className=" text-gray-700">
                                        {rent?.status === 'Partial' ? (
                                            <div className="space-y-1">
                                                <Progress
                                                    value={(rent?.paidAmount! / rent.amount) * 100}
                                                    className="h-2"
                                                />
                                                <div className="text-xs text-gray-500">
                                                    Paid: ₹{rent?.paidAmount?.toFixed(2)}
                                                </div>
                                            </div>
                                        ) : (
                                            `₹${rent?.paidAmount?.toFixed(2)}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                rent?.status === 'Pending' ? 'secondary' :
                                                rent?.status === 'Rejected' ? 'destructive' :
                                                rent?.status === 'Partial' ? 'secondary' :
                                                'default'
                                            }
                                            className="text-xs font-medium"
                                        >
                                            {rent.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {rent.status === 'Paid' && (
                                            <DownloadrentReciept collection={rent} contractDetails={contractDetails} room={room} />
                                        )}
                                          {rent.status === 'Pending'  && (
                                            <Button
                                                onClick={() => handlePayNowClick(rent, contractDetails)}
                                                >
                                                    Pay Now
                                                </Button>
                                        )}
                                        {rent.status === 'Partial'  && (
                                            <Button
                                                onClick={() => handlePayNowClick(rent, contractDetails)}
                                                >
                                                    Pay Now
                                                </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                                {rent.partialPayments?.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-3 bg-gray-50">
                                            <div className="pl-4 space-y-2">
                                                {rent.partialPayments.map((payment: any, index: number) => (
                                                    <div key={index} className="flex justify-between  text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Paid: ₹{payment.amount.toFixed(2)}</span>
                                                            <span className="mx-2">•</span>
                                                            <span className="text-xs font-bold">
                                                                {format(new Date(payment?.PaymentDate ? payment?.PaymentDate : new Date()), 'MMM dd, yyyy')}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {payment?.description && <span className="text-xs">{payment.description}</span>}
                                                            {payment?.receiptNumber && (
                                                                <span className="ml-2 text-gray-500 text-xs font-bold">Receipt: {payment.receiptNumber}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                        {contractDetails?.rentCollection?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                                    No rent collection found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const Page = ({ params }: any) => (
    <Suspense fallback={<SkeletonLoader />}>
        <PageComponent params={params} />
    </Suspense>
);

export default Page;