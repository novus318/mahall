'use client'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const HomeDonate = () => {
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle the form submission,
        // such as sending the data to an API
        console.log("Donation submitted:", { name, amount })
        // Reset form fields after submission
        setName("")
        setAmount("")
      }
    
  return (
<div className="bg-white py-8">
<Card className="w-full max-w-6xl mx-auto py-4">
    <CardHeader>
      <CardTitle>Make a Donation</CardTitle>
      <CardDescription>Support us with your contribution.</CardDescription>
    </CardHeader>
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter donation amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Donate Now</Button>
      </CardFooter>
    </form>
  </Card>
</div>
  )
}

export default HomeDonate