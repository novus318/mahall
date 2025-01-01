// utils/sendOtp.ts
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

interface Admin {
  number: string;
}

const WHATSAPP_API_URL: any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const sendVerification = async ({data}:any) => {
      try {
        const response = await axios.post(
          WHATSAPP_API_URL,
          {
            messaging_product: 'whatsapp',
            to: `${data.number}`,
            type: 'template',
            template: {
              name: 'setting_login',
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: [{ type: 'text', text: data?.otp }],
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: '0',
                  parameters: [{ type: 'text', text: data?.otp }],
                },
              ],
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
          console.log(`OTP sent to ${data.number}`);
          return true;
        }
      } catch (error: any) {
        toast({
          title: 'Failed to send OTP',
          description: error.response?.data?.message || error.message || 'Something went wrong',
          variant: 'destructive',
        });
        return false;
      }
    };

 