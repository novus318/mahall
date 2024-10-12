import React, { useState } from 'react'
import { Button } from '../ui/button'
import { CheckCircle, FileText, ImageDown, Loader2, MessageCircle, Music, Paperclip, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import axios from 'axios'
import { toast } from '../ui/use-toast'

const BulkMessage = ({members}:any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const WHATSAPP_MEDIA_UPLOAD_URL:any = process.env.NEXT_PUBLIC_WHATSAPP_MEDIA_UPLOAD_URL
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false);
  const[selectedFile,setSelectedFile] = useState<any>(null)

  

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
  const handleSendMessage = async () => {
    if(members < 0){
      toast({
        title: 'No members selected.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    if(members > 240){
      toast({
        title: 'Maximum 240 members allowed.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    if (!selectedFile && !newMessage) {
      toast({
        title: 'Please enter a message',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
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
    }
    setLoading(true);
    try {
     if(selectedFile)
      { const formData = new FormData();
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
      if(uploadResponse.data.id){
        const response = await axios.post(`${apiUrl}/api/message/bulk/message`, { members, message: newMessage, mediaId,type:selectedFile?.type })
        if (response.data.success) {
             setShowDialog(false);
             setLoading(false);
             setSelectedFile(null);
             setNewMessage('');
             toast({
               title: 'Message Request successfully',
               description: '',
               variant:'default',
             });
           }
      }
    }else
{ const response = await axios.post(`${apiUrl}/api/message/bulk/message`, { members, message: newMessage })
 if (response.data.success) {
      setShowDialog(false);
      setLoading(false);
      setSelectedFile(null);
      setNewMessage('');
      toast({
        title: 'Message Request successfully',
        description: '',
        variant:'default',
      });
    }
  }
    } catch (error:any) {
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      })
      setLoading(false)
    }
  };
  return (
    <>
      <Button size='sm'
       onClick={() => {
        setShowDialog(true);
       }}>
    Send Bulk Message
    <MessageCircle size={16} className='ml-1' />
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
  )
}

export default BulkMessage
