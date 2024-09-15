'use client'
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';

const PageComponent = ({ params }: any) => {
    const { url, amount, name } = params;
    const [copied, setCopied] = useState(false);

    const upiID = 'KADINULISLAM@IOB';
    
    if (!url || !amount || !name) {
        return <h1>Page not found</h1>;
    }

    const pay = `upi://pay?ver=01&pa=KADINULISLAM@IOB&pn=VELLAP KADINUL IJC&tn=${url}&am=${amount}&mode=02&purpose=00&orgid=159020&sign=&mc=8661`;

    const copyUPIID = () => {
        navigator.clipboard.writeText(upiID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h1 className="font-bold text-lg my-4">Complete Your Payment</h1>

            {/* Instructions */}
            <div className="mb-2 text-sm">
                <p className="text-gray-700 mb-2">To complete the payment, you can either:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Scan the QR code below with any UPI app.</li>
                    <li>Manually enter the UPI ID and amount into your preferred UPI app.</li>
                </ul>
            </div>

            {/* QR Code Display */}
            <div className="mb-2 text-center grid justify-center">
                <QRCodeCanvas value={pay} size={200} />
                <p className="text-gray-600 mt-2">Scan this QR code to pay ₹{amount}</p>
            </div>

            {/* UPI ID Display and Copy Button */}
            <div className="flex items-center mb-6 text-sm">
                <span className="font-semibold text-gray-800 mr-2">UPI ID:</span>
                <span className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700">{upiID}</span>
                <Button 
                size='sm'
                    onClick={copyUPIID} 
                    className="ml-4"
                >
                    {copied ? 'Copied!' : 'Copy UPI ID'}
                </Button>
            </div>

            {/* Instructions for Payment */}
            <div className="mt-4 text-xs">
                <h2 className="font-semibold text-lg mb-2">Payment Instructions</h2>
                <ol className="list-inside text-red-500">
                    <li>1. Open your UPI-enabled app (like Google Pay, PhonePe, etc.).</li>
                    <li>2. If using the QR code, scan it using the app&apos;s scan feature.</li>
                    <li> or take a screenshot of QR code, and upload by gallery to app&apos;s scan feature.</li>
                    <li>3. If using the UPI ID, enter <strong>{upiID}</strong> and the amount ₹<strong>{amount}</strong>.</li>
                    <li>4. please enter 
                      <strong> {url}</strong> as the payment reference.</li>
                    <li>5. Confirm the payment and will notify you when it&apos;s confirmed administrator.</li>
                </ol>
            </div>
        </div>
    );
};

export default PageComponent;
