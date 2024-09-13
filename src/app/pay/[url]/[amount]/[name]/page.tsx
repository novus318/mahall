'use client'
import React from 'react';
import {QRCodeCanvas } from 'qrcode.react';

const PageComponent = ({ params }: any) => {
    const { url, amount, name } = params;

    if (!url || !amount || !name) {
        return <h1>Page not found</h1>;
    }

    const pay = `upi://pay?ver=01&pa=KADINULISLAM@IOB&pn=VELLAP KADINUL IJC&tn=${url}&am=&mode=02&purpose=00&orgid=159020&sign=&mc=8661`;


    return (
        <div className='p-4'>
            <h1 className='font-bold text-lg my-4'>Pay with these apps</h1>
          <div>
            <QRCodeCanvas value={pay} size={250} />
          </div>
        </div>
    );
};

export default PageComponent;
