import React from 'react'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from './ui/table'
import { format } from 'date-fns'

const ContractDeposit = ({contractDetails}:any) => {
  return (
    <div className="grid gap-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">Deposit History</h2>
    </div>
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Deduction</TableHead>
            <TableHead>Deduction Reason</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractDetails?.depositCollection?.slice().reverse().map((deposit: any) => (
            <TableRow key={deposit._id}>
              <TableCell>{deposit.transactionType}</TableCell>
              <TableCell>₹{deposit.amount}</TableCell>
              <TableCell>{deposit.paymentMethod}</TableCell>
              <TableCell>
                {deposit.deduction > 0 ? `₹${deposit.deduction}` : 'None'}
              </TableCell>
              <TableCell>
                {deposit.deductionReason ? deposit.deductionReason : 'N/A'}
              </TableCell>
              <TableCell>
                {deposit.paymentDate ? format(new Date(deposit.paymentDate), 'PPP') : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
          {contractDetails?.depositCollection?.length === 0 &&
            <TableRow>
              <TableCell colSpan={6}>No deposit history found.</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </div>
  </div>
  )
}

export default ContractDeposit
