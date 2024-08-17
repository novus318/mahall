'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from './ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const PendingTransactions = ({ id }: any) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices(id);
    }, [id]);

    const fetchInvoices = async (houseId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/invoices/${houseId}`);
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderSkeleton = () => (
        <TableRow>
            <TableCell>
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </TableCell>
            <TableCell className="text-right">
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className='max-w-6xl p-5 rounded-md border mx-2 my-6 md:my-10'>
            <Table>
           { invoices.length > 0 &&
                <TableCaption>
                    <Button>
                        Remind All
                    </Button>
                </TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {loading ? (
                    <TableBody>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <React.Fragment key={index}>
                                {renderSkeleton()}
                            </React.Fragment>
                        ))}
                    </TableBody>
                ) : invoices.length > 0 ? (
                    <>
                        <TableBody>
                            {invoices.map((invoice: any) => (
                                <TableRow key={invoice.invoice}>
                                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                    <TableCell>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`${invoice.paymentStatus}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paid">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{invoice.paymentMethod}</TableCell>
                                    <TableCell>{invoice.month}</TableCell>
                                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size='sm'>
                                            Remind
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5}>Total</TableCell>
                                <TableCell className="text-right">Rs.2,500.00</TableCell>
                            </TableRow>
                        </TableFooter>
                    </>
                ) : (
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6}>No pending collections are found.</TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </div>
    )
}

export default PendingTransactions
