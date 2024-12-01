'use client'
import Sidebar from '@/components/Sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { withAuth } from '@/components/withAuth'
import axios from 'axios'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FileText, ImageDown, Loader2, Music, Paperclip, Trash, Trash2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'


interface Member {
  senderNumber: string;
  senderName: string;
}

interface MessageData {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'audio' | 'document' | 'image' | 'video'; // Added 'image' and 'video' types
  text?: {
    body: string;
  };
  audio?: {
    id: string;
    caption?: string; // Optional caption for audio
  };
  document?: {
    id: string;
    filename: string;
    caption?: string; // Optional caption for document
  };
  image?: {
    id: string;
    caption?: string; // Optional caption for image
  };
  video?: {
    id: string;
    caption?: string; // Optional caption for video
  };
}

interface File {
  type: string; // MIME type of the file
  name: string; // Name of the file
  size: number; // Size of the file in bytes
}


const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const WHATSAPP_API_URL: any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
  const WHATSAPP_MEDIA_UPLOAD_URL:any = process.env.NEXT_PUBLIC_WHATSAPP_MEDIA_UPLOAD_URL
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
  const [messages, setMessages] = useState<any>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteLoadingStates, setDeleteLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMessageMember, setSelectedMessageMember] = useState<any>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
const[selectedFile,setSelectedFile] = useState<any>(null)
const [count, setCount] = useState(0);
const [loadingNextPage, setLoadingNextPage] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const loader = useRef<any>(null);

  const openImageModal = (imageUrl: any) => {
    setSelectedImage(imageUrl);
    setIsImageOpen(true);
  };

  const closeImageModal = () => {
    setIsImageOpen(false);
    setSelectedImage('');
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/message/messages?page=1`);
      if (response.data.success) {
        setMessages(response.data.messages);
        setCount(response.data.totalCount);
        setCurrentPage(1); // Reset to the first page
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [apiUrl]);

  // Fetch next page of messages
  const fetchNextMessages = useCallback(async () => {
    if (loadingNextPage || messages.length >= count) return;

    setLoadingNextPage(true);
    try {
      const nextPage = currentPage + 1;
      const response = await axios.get(`${apiUrl}/api/message/messages?page=${nextPage}`);
      if (response.data.success) {
        setMessages((prev:any) => [...prev, ...response.data.messages]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error fetching next page of messages:', error);
    } finally {
      setLoadingNextPage(false);
    }
  }, [apiUrl, currentPage, messages.length, count, loadingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextMessages();
      },
      { root: null, threshold: 0.5 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, fetchNextMessages]);


  const deleteMessages = async (number: string, name: string) => {
    setDeleteLoadingStates(prev => ({ ...prev, [number]: true }));
  
    try {
      const response = await axios.delete(`${apiUrl}/api/message/messages/delete`, {
        data: {
          senderName: name,
          senderNumber: number,
        },
      });
  
      if (response.data.success) {
        setMessages((prevMessages:any) =>
          prevMessages.filter(
            (msg:any) => !(msg.senderName === name && msg.senderNumber === number)
          )
        );
        fetchMessages(); // Wait for fetchMessages to complete
      }
    } catch (error) {
      console.log('Error deleting message:', error);
    } finally {
      // Reset the loading state for the specific sender after fetchMessages completes
      setDeleteLoadingStates(prev => ({ ...prev, [number]: false }));
    }
  };
  
  

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 60000)
    return () => clearInterval(interval)
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

  const allowedFileTypes = [
    'audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg', 'audio/opus',
    'application/vnd.ms-powerpoint', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf', 'text/plain', 'application/vnd.ms-excel',
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/3gpp'
  ];

  const handleSendMessage = async (member: Member) => {
    setLoading(true);
    try {
      let messageData: MessageData = {
        messaging_product: 'whatsapp',
        to: member.senderNumber,
        type: 'text',
        text: {
          body: newMessage,
        },
      };
  
      if (selectedFile) {
        if (!allowedFileTypes.includes(selectedFile.type)) {
          toast({
            title: 'Invalid file type',
            description: `The selected file type is not supported.`,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
      
        // Upload file to get the media_id
        const formData = new FormData();
        formData.append('messaging_product', 'whatsapp');
        formData.append('file', selectedFile as Blob);
      
        const uploadResponse = await axios.post<{ id: string }>(
          WHATSAPP_MEDIA_UPLOAD_URL,
          formData,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      
        const { id: mediaId } = uploadResponse.data;
      
        // Modify the message data based on the file type
        if (selectedFile.type.startsWith('audio')) {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.senderNumber,
            type: 'audio',
            audio: {
              id: mediaId,
              caption: newMessage || '', // Include caption if message is present
            },
          };
        } else if (selectedFile.type.startsWith('image')) {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.senderNumber,
            type: 'image',
            image: {
              id: mediaId,
              caption: newMessage || '', // Include caption if message is present
            },
          };
        } else if (selectedFile.type.startsWith('video')) {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.senderNumber,
            type: 'video',
            video: {
              id: mediaId,
              caption: newMessage || '', // Include caption if message is present
            },
          };
        } else {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.senderNumber,
            type: 'document',
            document: {
              id: mediaId,
              filename: selectedFile.name,
              caption: newMessage || '', // Include caption if message is present
            },
          };
        }
      }
      
  
      const response = await axios.post(WHATSAPP_API_URL, messageData, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        setShowDialog(false);
        setNewMessage('');
        setSelectedFile(null);
        deleteMessages(member.senderNumber, member.senderName);
        toast({
          title: 'Message sent successfully',
          variant: 'default',
        });
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.error?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
            const messages = groupedMessages[key];
            const firstMessage = messages[0];

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
                  <div>
                  <Button
            variant="destructive"
            size="icon"
            disabled={deleteLoadingStates[firstMessage.senderNumber] || false}
            onClick={() => {
              deleteMessages(firstMessage.senderNumber, firstMessage.senderName);
            }}
          >
            {deleteLoadingStates[firstMessage.senderNumber] ? (
              <Loader2 className="animate-spin h-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
                 </div>
                </div>
                <div className="text-sm leading-relaxed bg-white p-4 rounded-lg shadow-md border">
                  <div className="font-semibold text-gray-700 mb-3">Messages:</div>
                  <div className="space-y-4">
                    {messages
                      .slice(0)
                      .reverse()
                      .map((msg: any, index: number) => {
                        const { dayMonthYear, day, time } = formatDaterec(msg.createdAt);
                        return (
                          <div
                            key={msg._id}
                            className={`p-4 rounded-lg border ${index === 0 ? 'bg-gray-50 font-medium' : 'bg-gray-100'
                              }`}
                          >
                            <div className="text-xs text-gray-500 mb-2">
                              {dayMonthYear}, {day}, {time}
                            </div>
                            {msg.messageType === 'text' && (
                              <div className="text-gray-800">{msg.messageContent}</div>
                            )}
                            {msg.messageType === 'image' && (
                              <div className="flex flex-col items-start space-y-2">
                                <img
                                  width={300}
                                  height={300}
                                  src={`${apiUrl}/api/message/media/${msg._id}`}
                                  alt={msg?.messageContent || 'Image'}
                                  className="max-w-full h-auto rounded-lg shadow-md cursor-pointer"
                                  onClick={() =>
                                    openImageModal(`${apiUrl}/api/message/media/${msg._id}`)
                                  }
                                />
                                {msg.messageContent && (
                                  <div className="text-gray-800">{msg.messageContent}</div>
                                )}
                              </div>
                            )}
                            {msg.messageType === 'sticker' && (
                              <img
                                width={120}
                                height={120}
                                src={`${apiUrl}/api/message/media/${msg._id}`}
                                alt="Sticker"
                              />
                            )}
                            {msg.messageType === 'audio' && (
                              <div className="flex flex-col items-start space-y-2 w-full">
                                <audio controls className="w-full rounded-xl bg-gray-200">
                                  <source src={`${apiUrl}/api/message/media/${msg._id}`} type={msg.mediaType} />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            )}
                            {msg.messageType === 'video' && (
                              <div className="flex flex-col items-start space-y-2">
                                <video
                                  controls
                                  className="w-full max-w-xl rounded-lg shadow-md"
                                >
                                  <source src={`${apiUrl}/api/message/media/${msg._id}`} type={msg.mediaType} />
                                  Your browser does not support the video element.
                                </video>
                                {msg.messageContent && (
                                  <div className="text-gray-800">{msg.messageContent}</div>
                                )}
                              </div>
                            )}
                            {msg.messageType === 'document' && (
                              <div className="flex items-center space-x-3 bg-gray-200 p-3 rounded-lg">
                                <svg
                                  className="w-6 h-6 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                                  />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v6h6" />
                                </svg>
                                <a
                                  href={`${apiUrl}/api/message/media/${msg._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {msg.messageContent || 'Download Document'}
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {messages.length !== count && (
        <div ref={loader} className="text-center mt-4">
          {/* Loader for infinite scroll */}
        </div>
      )}
                  {/* Modal for larger image view */}
                  {isImageOpen && (
                   <Dialog open={isImageOpen} onOpenChange={closeImageModal}>
                   <DialogContent className='pt-9 pb-2 px-2'>
                                <img
                                  className="w-full h-auto rounded-md"
                                  width={900}
                                  height={900}
                                  src={selectedImage}
                                   alt="Zoomed Image"
                                />
                   </DialogContent>
                 </Dialog>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit mt-2"
                  onClick={() => {
                    setShowDialog(true);
                    setSelectedMessageMember(firstMessage);
                  }}
                >
                  Reply
                </Button>
              </div>
            );
          })}
        </div>
        <div ref={loader} className="text-center mt-4">
          {loadingNextPage && <Loader2 className="animate-spin" />}
        </div>
        {messages.length === 0 && <div className="text-center text-gray-500">No messages yet.</div>}
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
    
    {/* Attachment Section */}
    <div className="flex items-center gap-2">
      <label htmlFor="file-input" className="flex items-center gap-1 cursor-pointer text-slate-900 hover:text-slate-600">
        <Paperclip size={20} />
        <span>Attach</span>
      </label>
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={(e: any) => setSelectedFile(e.target.files[0])}
        disabled={loading}
      />

      {/* Preview selected file */}
      {selectedFile && (
        <div className="flex items-center gap-2 border p-2 rounded-lg bg-gray-100">
          {selectedFile.type.startsWith('image') && <ImageDown size={20} className="text-slate-800" />}
          {selectedFile.type.startsWith('audio') && <Music size={20} className="text-slate-900" />}
          {selectedFile.type.startsWith('application') && (
            <FileText size={20} className="text-slate-700" />
          )}
          <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)} className="text-red-600">
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
    
    <DialogFooter >
      <div className='space-x-2'>
        <Button size="sm" variant="outline" onClick={() => setShowDialog(false)}>
        Cancel
      </Button>
      {loading ? (
        <Button size="sm" disabled>
          <Loader2 className="animate-spin" />
        </Button>
      ) : (
        <Button
          disabled={loading || (!newMessage && !selectedFile)}
          onClick={() => handleSendMessage(selectedMessageMember)}
          size="sm"
        >
          Send
        </Button>
      )}</div>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>
    </div>
  )
}

export default withAuth(Page);
