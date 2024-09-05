'use client'
import Sidebar from '@/components/Sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const WHATSAPP_API_URL:any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMessageMember, setSelectedMessageMember] = useState<any>(null);
  
  
  const fetchMessages = () => {
    axios.get(`${apiUrl}/api/message/messages`).then(response => {
      if (response.data.success) {
        setMessages(response.data.messages)
      }
    })
      .catch(error => {
        console.log('Error fetching messages:', error)
      })
  }

  const deleteMessages = (number:any,name:any) => {
    axios.delete(`${apiUrl}/api/message/messages/delete`,{
      data: {
        senderName:name,
        senderNumber:number
      },
    }).then(response => {
      if (response.data.success) {
        fetchMessages()
      }
    })
      .catch(error => {
        console.log('Error fetching messages:', error)
      })
  }
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 100000)
    return () => clearInterval(interval) // Clean up the interval on component unmount
  }, [])

  const formatDaterec = (dateString: any) => {
    return {
      dayMonthYear: format(new Date(dateString), 'dd MMM yyyy'),
      day: format(new Date(dateString), 'EEEE'),
      time: format(new Date(dateString), 'hh:mm a'),
    }
  }

  const groupedMessages = messages.reduce((acc: any, message: any) => {
    const key = `${message.senderName}-${message.senderNumber}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(message)
    return acc
  }, {})

  const handleSendMessage = async (member: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: member.senderNumber,
          type: 'text',
          text: {
            body: newMessage,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setShowDialog(false);
        setNewMessage('');
        deleteMessages(member.senderNumber,member.senderName)
        toast({
          title: 'Message sent successfully',
          variant: 'default',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(false); // Ensure the loading state is turned off after the request
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/6 bg-gray-100">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 bg-white">
        <div className="flex flex-col gap-4">
          {Object.keys(groupedMessages).map((key: string) => {
            const messages = groupedMessages[key]
            const firstMessage = messages[0]

            return (
              <div key={key} className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border">
                     <AvatarFallback>
                        {(firstMessage?.senderName || 'No name').substring(0, 1)}
                        {(firstMessage?.senderName || 'No name').substring(1, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{firstMessage?.senderName || 'No name'}</div>
                      <div className="text-xs text-muted-foreground">+{firstMessage?.senderNumber}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm leading-relaxed bg-white p-4 rounded-lg shadow-sm border">
  <div className="font-semibold text-gray-700 mb-2">Messages:</div>
  <div className="space-y-3">
    {messages
      .slice(0)
      .reverse()
      .map((msg: any, index: number) => {
        const { dayMonthYear, day, time } = formatDaterec(msg.createdAt)
        return (
          <div
            key={msg._id}
            className={`p-2 rounded-lg ${
              index === 0 ? "bg-gray-50 font-medium" : "bg-gray-100"
            }`}
          >
            <div className="text-xs text-gray-500">{dayMonthYear}, {day}, {time}</div>
            <div>{msg?.messageContent}</div>
          </div>
        )
      })}
  </div>
</div>


                <Button variant="outline" size="sm" className="w-fit mt-2"
                onClick={() => {
                  setShowDialog(true)
                  setSelectedMessageMember(firstMessage)
                  }}>
                  Reply
                </Button>
              </div>
            )
          })}
        </div>
        {messages.length === 0 && (
          <div className="text-center text-gray-500">No messages yet.</div>
        )} 
         <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>Reply message to {selectedMessageMember?.senderNumber}</DialogTitle>
          <div className="text-base text-gray-500 font-semibold">
            {selectedMessageMember?.senderName || 'No name'}
          </div>
          <Textarea
            rows={3}
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
            />
          <DialogFooter>
            <Button size='sm' variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            {loading ? (
              <Button size='sm' disabled>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button
              disabled={loading} 
              onClick={() => {handleSendMessage(selectedMessageMember)}}
              size='sm'>Sent</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

export default withAuth(Page)
