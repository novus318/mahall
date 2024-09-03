'use client'
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const PageComponent = ({ params }: any) => {
    const { url, amount, name } = params;

    if (!url || !amount || !name) {
        return <h1>Page not found</h1>;
    }

    const upiApps = [
        {
            name: 'Google Pay',
            upiId: '7560845014@jupiteraxis',
            payurl: `tez://upi/pay?pn=Muhammed%20Nizamudheen%20M&pa=nizamudheen.tech@okicici&cu=INR&am=${amount}&tn=${url}&mc=0000`
        },
        {
            name: 'PhonePe',
            upiId: 'nizamudheen.tech@okicici',
            payurl: `phonepe://pay?pn=Muhammed%20Nizamudheen%20M&pa=nizamudheen.tech@okicici&cu=INR&am=${amount}&tn=${url}&mc=0000`
        },
        {
            name: 'Paytm',
            upiId: 'nizamudheen.tech@okicici',
            payurl: `paytm://pay?pn=Muhammed%20Nizamudheen%20M&pa=nizamudheen.tech@okicici&cu=INR&am=${amount}&tn=${url}&mc=0000`
        },
        {
            name: 'Other UPI',
            upiId: 'nizamudheen.tech@okicici',
            payurl: `upi://pay?pn=Muhammed%20Nizamudheen%20M&pa=nizamudheen.tech@okicici&cu=INR&am=${amount}&tn=${url}&mc=0000`
        }
    ];

    const handleUPIClick = (pay: any) => {
        window.location.href = pay;
    };

    return (
        <div className='p-4'>
            <h1 className='font-bold text-lg my-4'>Pay with these apps</h1>
            <div className=' grid grid-cols-1 md:grid-cols-4 gap-4'>
                {upiApps.map((app) => (
                    <div
                    className='border flex items-center p-2 rounded-md mb-2 min-h-20 bg-slate-100 font-bold text-muted-foreground'
                    key={app.name} onClick={() => handleUPIClick(app.payurl)}>
                        <Image src={
                            app.name === 'Google Pay' ? '/google-pay.png' :
                                app.name === 'PhonePe' ? '/phonepe-icon.png' :
                                    app.name === 'Paytm' ? '/paytm-icon.png' :
                                        '/upi-icon.png'
                        } alt={app.name}
                        height={100} width={200} className='w-16 mr-2' />
                        Pay with {app.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageComponent;
