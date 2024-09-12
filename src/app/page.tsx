'use client';
import React from 'react';
import PrayerTimes from '@/components/PrayerTimes';
import Image from 'next/image';
import { motion } from 'framer-motion';

function Home() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };
  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-950 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Masjid Al-Noor</h1>
        </div>
      </header>

      {/* Main Section */}
      <main className="">
      <section className="relative bg-white">
      <div className="relative overflow-hidden md:pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center"
        >
          {/* Text Content */}
          <div className="text-center lg:text-left lg:w-1/2">
            <motion.h1
              className="text-4xl font-bold sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
            >
              Vellap Khadimul Jamaath
            </motion.h1>
            <p className="mt-3 max-w-md mx-auto text-lg md:mt-5 md:text-xl md:max-w-3xl font-medium">
              Purity Comes From Faith, Belief in the Unity of Allah & Prophet Muhammad <span className='text-4xl mx-2'>ﷺ</span> as Allah’s messenger.
            </p>
          </div>
          {/* Mosque Image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/8/88/Kaduvayil_juma_masjid.jpg"
              alt="VKJ"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-gray-900"
          >
            {/* Waves with Shadows */}
            <path
              fill="#032e2c"
              fillOpacity="1"
              d="M0,64L60,74.7C120,85,240,107,360,128C480,149,600,171,720,165.3C840,160,960,128,1080,106.7C1200,85,1320,75,1380,69.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              style={{ filter: 'drop-shadow(0px -10px 15px rgba(0, 0, 0, 0.5))' }}
            />
            <path
              fill="#011615"
              fillOpacity="1"
              d="M0,192L60,186.7C120,181,240,171,360,160C480,149,600,139,720,128C840,117,960,107,1080,117.3C1200,128,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              style={{ filter: 'drop-shadow(0px -10px 20px rgba(0, 0, 0, 0.5))' }}
            />
          </svg>
        </div>
      </div>
    </section>


       <PrayerTimes/>


        {/* Contact Section */}
        <section id="contact" className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Contact Us</h2>
            <p className="text-gray-600 mt-2 md:mt-4">
              Feel free to reach out to us for any inquiries or support.
            </p>
            <p className="text-gray-600 mt-2">
              Phone: (123) 456-7890 | Email: contact@masjidalnoor.com
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 Vellap Khadimul Jamaath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
