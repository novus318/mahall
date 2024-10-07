// utils/sendOtp.ts
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import mobileNumbers from '@/data/number.json';

interface Admin {
  number: string;
}


const WHATSAPP_API_URL:any = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;

export const sendOtp = async (
  otp: string
): Promise<boolean> => {
  const admins: Admin[] = mobileNumbers;

  const promises = admins.map(async (admin) => {
    try {
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: `91${admin.number}`,
          type: 'template',
          template: {
            name: 'setting_login',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otp }],
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otp }],
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
        console.log(`OTP sent to ${admin.number}`);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to send OTP',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  });

  try {
    await Promise.all(promises);
    toast({
      title: 'All OTPs sent',
      variant: 'default',
    });
    return true;
  } catch (error) {
    toast({
      title: 'Error sending OTPs',
      description: 'Some OTPs could not be sent.',
      variant: 'destructive',
    });
    return false;
  }
};
