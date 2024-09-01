'use client'
import Sidebar from '@/components/Sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { withAuth } from '@/components/withAuth'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    <div className="w-full md:w-1/6 bg-gray-100">
      <Sidebar />
    </div>
    <div className="w-full md:w-5/6 p-4 bg-white">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground">+1 (555) 555-5555</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">3:45 PM</div>
        </div>
        <div className="text-sm leading-relaxed">
          Hey, just wanted to check in and see how you are doing. Let me know if you are free to chat later.
        </div>
        <Button variant="outline" size="sm" className="w-fit">
          Reply
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Jane Appleseed</div>
              <div className="text-xs text-muted-foreground">+1 (987) 654-3210</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">2:30 PM</div>
        </div>
        <div className="text-sm leading-relaxed">
          Hi there, just wanted to follow up on that project we discussed earlier. Let me know if you have any updates.
        </div>
        <Button variant="outline" size="sm" className="w-fit">
          Reply
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Sarah Miller</div>
              <div className="text-xs text-muted-foreground">+1 (123) 456-7890</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">1:15 PM</div>
        </div>
        <div className="text-sm leading-relaxed">
          Hey, just wanted to let you know that I am running a bit late for our meeting. I will be there as soon as I can.
        </div>
        <Button variant="outline" size="sm" className="w-fit">
          Reply
        </Button>
      </div>
    </div>
      </div>
    </div>
  )
}

export default withAuth(Page)
