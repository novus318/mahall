'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format, addMonths, startOfMonth, parse, isBefore } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from './ui/use-toast'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const ManualTutioncollections = ({ houseId, collectionAmount }: { houseId: string; collectionAmount: number }) => {
  const [fromYear, setFromYear] = useState<string>("")
  const [fromMonth, setFromMonth] = useState<string>("")
  const [toYear, setToYear] = useState<string>("")
  const [toMonth, setToMonth] = useState<string>("")
  const [selections, setSelections] = useState<string[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);



  // Generate years from the current year to 2050
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 2050 - currentYear + 1 }, (_, i) => currentYear + i)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    if (fromYear && fromMonth && toYear && toMonth) {
      const start = parse(`${fromYear}-${fromMonth}`, "yyyy-MM", new Date())
      const end = parse(`${toYear}-${toMonth}`, "yyyy-MM", new Date())

      if (isBefore(start, end) || start.getTime() === end.getTime()) {
        const newSelections = []
        let currentDate = start
        while (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) {
          newSelections.push(format(currentDate, "yyyy-MM"))
          currentDate = addMonths(currentDate, 1)
        }
        setSelections(newSelections)
        setTotalAmount(newSelections.length * collectionAmount)
      } else {
        setSelections([])
        setTotalAmount(0)
      }
    }
  }, [fromYear, fromMonth, toYear, toMonth, collectionAmount])

  const handleManualCollections = async () => {
    setLoading(true)
    try{
        const response = await axios.post(`${apiUrl}/api/house/generateManualCollections/${houseId}`, {
          months: selections,
        })
        if (response.data.success) {
          setLoading(false)
          handleDialogClose()
          toast({
            title: 'Success',
            description: 'Manual collections processed successfully.',
            variant:'default'
          })
          window.location.reload()
        } else {
          setLoading(false)
          toast({
            title: 'Error',
            description: response.data.error || 'An error occurred while trying to process the manual collections. Please try again later.',
            variant:'destructive'
          })
        }
    }catch(error:any){
        setLoading(false)
      toast({
        title: 'Error',
        description: error?.response?.data?.error || error.response?.data?.message || error.message  || 'An error occurred while trying to process the manual collections. Please try again later.',
        variant:'destructive'
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFromYear("")
    setFromMonth("")
    setToYear("")
    setToMonth("")
    setSelections([])
    setTotalAmount(0)
  };

  return (
    <>
         <Button variant="default"
         onClick={()=>{
           setIsDialogOpen(true);
         }}>Manual Collections</Button>
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Month Range</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="from-year" className="text-sm font-medium">From Year</label>
              <Select onValueChange={setFromYear} value={fromYear}>
                <SelectTrigger id="from-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className='max-h-60'>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="from-month" className="text-sm font-medium">From Month</label>
              <Select onValueChange={setFromMonth} value={fromMonth}>
                <SelectTrigger id="from-month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className='max-h-44'>
                  {months.map((month, index) => (
                    <SelectItem
                      key={month}
                      value={(index + 1).toString().padStart(2, '0')}
                      disabled={
                        parseInt(fromYear) === currentYear && index < new Date().getMonth()
                      }
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="to-year" className="text-sm font-medium">To Year</label>
              <Select onValueChange={setToYear} value={toYear}>
                <SelectTrigger id="to-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className='max-h-60'>
                  {years.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      disabled={parseInt(fromYear) > year}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="to-month" className="text-sm font-medium">To Month</label>
              <Select onValueChange={setToMonth} value={toMonth}>
                <SelectTrigger id="to-month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className='max-h-44'>
                  {months.map((month, index) => (
                    <SelectItem
                      key={month}
                      value={(index + 1).toString().padStart(2, '0')}
                      disabled={
                        parseInt(fromYear) === parseInt(toYear) &&
                        parseInt(fromMonth) > (index + 1)
                      }
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
     <div className='mt-32'>
     <p className="text-sm mt-4">Total Amount: ₹{totalAmount}</p>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="button" disabled={selections.length === 0 || loading} onClick={handleManualCollections}>
          {loading ? <Loader2 className='animate-spin'/> : 'Generate'}
          </Button>
        </DialogFooter>
     </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default ManualTutioncollections
