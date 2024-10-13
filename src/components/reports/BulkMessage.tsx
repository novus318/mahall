import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, FileText, ImageDown, Loader2, MessageCircle, Music, Paperclip, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { toast } from '../ui/use-toast';

interface Member {
  whatsappNumber: string;
  senderName: string;
}

const BulkMessage = ({ members }: { members: Member[] }) => {
  const WHATSAPP_API_URL: any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
  const WHATSAPP_MEDIA_UPLOAD_URL: any = process.env.NEXT_PUBLIC_WHATSAPP_MEDIA_UPLOAD_URL;
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
  const MAX_MESSAGES_PER_DAY = 230; // Updated limit
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [messageCount, setMessageCount] = useState<number>(0);
  useEffect(() => {
    // Load saved state from local storage
    const savedState = localStorage.getItem('bulkMessageState');
    if (savedState) {
      const {
        progress,
        messageCount,
        uploadedMediaId,
        selectedFile,
        newMessage,
      } = JSON.parse(savedState);
      setProgress(progress);
      setMessageCount(messageCount);
      setSelectedFile(selectedFile ? new File([new Blob()], selectedFile.name, { type: selectedFile.type }) : null);
      setNewMessage(newMessage);
    }
  }, []);

  useEffect(() => {
    // Persist state to local storage
    const state = {
      progress,
      messageCount,
      selectedFile,
      newMessage,
    };
    localStorage.setItem('bulkMessageState', JSON.stringify(state));
  }, [progress, messageCount, selectedFile, newMessage]);

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

  const uploadFile = async () => {
    if (!selectedFile) return null;

    if (!allowedFileTypes.includes(selectedFile.type)) {
      toast({
        title: 'Invalid file type',
        description: `The selected file type is not supported.`,
        variant: 'destructive',
      });
      return null;
    }

    try {
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

      const { id } = uploadResponse.data;
      return id;
    } catch (error: any) {
      console.error('File upload failed:', error);
      toast({
        title: 'Failed to upload file',
        description: error.response?.data?.error?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
      return null;
    }
  };

  const sendMessageToMember = async (member: Member,uploadedMediaId:any) => {
    try {
      let messageData: any = {
        messaging_product: 'whatsapp',
        to: member.whatsappNumber,
        type: 'text',
        text: {
          body: newMessage,
        },
      };
      
      // If there's a file, adjust message data accordingly
      if (uploadedMediaId) {
        if (selectedFile?.type.startsWith('audio')) {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.whatsappNumber,
            type: 'audio',
            audio: {
              id: uploadedMediaId,
              caption: newMessage || '',
            },
          };
        } else if (selectedFile?.type.startsWith('image')) {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.whatsappNumber,
            type: 'image',
            image: {
              id: uploadedMediaId,
              caption: newMessage || '',
            },
          };
        } else if (selectedFile?.type.startsWith('video')) {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.whatsappNumber,
            type: 'video',
            video: {
              id: uploadedMediaId,
              caption: newMessage || '',
            },
          };
        } else {
          messageData = {
            messaging_product: 'whatsapp',
            to: member.whatsappNumber,
            type: 'document',
            document: {
              id: uploadedMediaId,
              filename: selectedFile?.name,
              caption: newMessage || '',
            },
          };
        }
      }

      await axios.post(WHATSAPP_API_URL, messageData, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      setMessageCount((prev) => prev + 1); // Update count in state
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.error?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (messageCount + members.length > MAX_MESSAGES_PER_DAY) {
      toast({
        title: 'Daily message limit reached',
        description: `You can only send ${MAX_MESSAGES_PER_DAY} messages per day.`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setShowDialog(false);

    let uploadedMediaId = null;

    if (selectedFile) {
      uploadedMediaId = await uploadFile();
      if (!uploadedMediaId) {
        setLoading(false);
        return; // Exit early if file upload fails
      }
    }

    // Send messages to members from the current progress point
    for (let i = progress; i < members.length; i++) {
      await sendMessageToMember(members[i],uploadedMediaId);
      setProgress(i + 1); // Update progress in state

      // Update local storage after each message sent
      const state = {
        progress: i + 1,
        messageCount: messageCount + 1,
        uploadedMediaId,
        selectedFile,
        newMessage,
      };
      localStorage.setItem('bulkMessageState', JSON.stringify(state));

      // Random delay between messages
      const delay = Math.random() * (1500 - 1200) + 1200; 
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Reset state after completion
    setLoading(false);
    setProgress(0);
    setNewMessage('');
    setSelectedFile(null);
    localStorage.removeItem('bulkMessageState');

    toast({
      title: 'All messages sent successfully',
      variant: 'default',
    });
  };

  return (
    <>
      <Button size='sm' onClick={() => setShowDialog(true)} disabled={loading}>
        {loading ? (
          <span>Sending... {progress}/{members.length}</span>
        ) : (
          <>
            Send Bulk Message
            <MessageCircle size={16} className='ml-1' />
          </>
        )}
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>Reply message to </DialogTitle>
          <Textarea
            rows={3}
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />

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

          <DialogFooter>
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
                  onClick={handleSendMessage}
                  size="sm"
                >
                  Send
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkMessage;
