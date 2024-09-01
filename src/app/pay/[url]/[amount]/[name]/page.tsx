'use client'
import { Button } from '@/components/ui/button';
import React from 'react';

const PageComponent = ({ params }: any) => {
    const { url, amount,name } = params;

    if (!url || !amount||!name) {
        return <h1>Page not found</h1>;
    }

    const upiApps = [
        {
            name: 'Google Pay',
            upiId: 'nizamudheen.tech-1@oksbi',
            payurl: `tez://upi/pay?pa=nizamudheen.tech-1@oksbi&pn=${name}&am=${amount}&cu=INR&tn=${encodeURIComponent(url)}`
        },
        {
            name: 'PhonePe',
            upiId: '7560845014@ybl',
             payurl: `phonepe://pay?pa=7560845014@ybl&pn=${name}&am=${amount}&cu=INR&tn=${encodeURIComponent(url)}`
        },
        {
            name: 'Paytm',
            upiId: '7560845014@pthdfc',
            payurl:`paytm://pay?pa=7560845014@ybl&pn=${name}&am=${amount}&cu=INR&tn=${encodeURIComponent(url)}`
        },
    ];

    const handleUPIClick = (pay:any) => {
        window.location.href = pay;
    };

    return (
        <div className='p-4'>
            <h1 className='font-bold text-lg my-4'>Pay with these apps</h1>
           <div className=' grid grid-cols-1 space-y-2'>
           {upiApps.map((app) => (
                <Button key={app.name} onClick={() => handleUPIClick(app.payurl)}>
                    Pay with {app.name}
                </Button>
            ))}
           </div>
        </div>
    );
};

export default PageComponent;
