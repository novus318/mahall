import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto text-gray-950 bg-gray-100 p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm mb-4">Effective Date: Sep 20,2024</p>

        <p className="mb-6">
          Welcome to <span className="font-semibold">VKJ</span>. This Privacy Policy explains how we collect, use,
          and share your personal information when you use our app.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li><span className="font-semibold">Personal Information:</span> Name, contact details, house information, and member details.</li>
          <li><span className="font-semibold">Messaging Data:</span> WhatsApp messages sent through the app to remind or notify you about collections and events.</li>
          <li><span className="font-semibold">Usage Data:</span> Information on how the app is used, such as login times and feature usage.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Provide, operate, and maintain our services.</li>
          <li>Notify you about collections, events, and other important messages via WhatsApp.</li>
          <li>Improve our app and services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">3. How We Share Your Information</h2>
        <p className="mb-6">
          We do not share your personal information with third parties except for the following situations:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>With WhatsApp Cloud API for messaging purposes.</li>
          <li>As required by law or to protect the rights and safety of our users.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-6">
          We take appropriate security measures to protect your information from unauthorized access, disclosure, or alteration.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p className="mb-6">
          You have the right to access, update, or delete your personal information. If you would like to exercise these rights, please contact us.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,<br/> please contact us at: +91 9567234112.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
