'use client';
import React, { useEffect, useState } from 'react';
import PrayerTimes from '@/components/PrayerTimes';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Safari from '@/components/magicui/safari';
import Link from 'next/link';

function Home() {
  const images = ["/mosque.jpg", "/mosque2.jpeg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500); // Change image every 2 seconds

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [images.length]);

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5 } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };
  


  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };
 

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <img
              src="/VKJLOGO.png"
              alt="Vellap Khadimul Jamaath Mosque"
              width={100}
              height={100}
              className='h-24'
            />
        </div>
      </header>

      {/* Main Section */}
      <main className="">
      <section className="relative bg-white">
  <div className="relative overflow-hidden md:pb-20">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center"
    >
      <div className="text-center lg:text-left lg:w-1/2">
        <motion.h1
          className="text-4xl font-bold sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
        >
          Vellap Khadimul Islam Jamaath
        </motion.h1>
        <p className="mt-3 max-w-md mx-auto text-lg md:mt-5 md:text-xl md:max-w-3xl font-medium">
          لجنة جماعة خادم الإسلام
        </p>
        <p className="mt-3 max-w-md mx-auto text-lg md:mt-5 md:text-xl md:max-w-3xl font-medium">
          Purity Comes From Faith, Belief in the Unity of Allah & Prophet Muhammad <span className="text-4xl mx-2">ﷺ</span> as Allah’s messenger.
        </p>
      </div>

      <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end relative z-0">
      <div className="relative w-[600px] h-[400px]">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt="Slider Image"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
    </motion.div>

    <div className="absolute bottom-14 md:bottom-0 left-0 w-full z-20"> 
      <svg
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-gray-900"
      >
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

       <section className="relative py-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-lg md:text-3xl font-semibold text-gray-900 leading-tight">
          വെള്ളാപ്പ് മുഹിയുദ്ദീൻ ജുമാ മസ്ജിദിന്റെ ചരിത്രം.
          </h2>
          <p className="text-xs md:text-lg text-gray-700 mt-4 text-justify">
          ഏകദേശം 175 വർഷങ്ങൾക്ക് പഴക്കമുണ്ട് നമ്മുടെ ജുമാ മസ്ജിദിന് എന്നാണ് ചരിത്രം പഠിപ്പിക്കുന്നത്.
 മർഹും എ ബി  അബ്ദുൽ കരീം ഹാജി എന്നവരുടെ പിതാവായ ഔള്ള മുസ്‌ലിയാർ ആണ് നമ്മുടെ പള്ളിക്ക് തുടക്കം കുറിക്കുന്നത്.  ഓലമേഞ്ഞ ചെറിയ പള്ളിയിൽ വർഷങ്ങളോളം ഔള്ള മുസ്ലിയാർ എന്ന ആ മഹാനുഭാവൻ തന്നെയാണ് ഇമാമും മറ്റെല്ലാ കാര്യങ്ങളും നടത്തിപ്പോന്നത്.<br/>  കാര്യമായ മഹൽ സംവിധാനങ്ങൾ ഇല്ലാത്ത ആ വളരെ ചുരുക്കം വീടുകളാണ് നമ്മുടെ പ്രദേശത്ത് ഉണ്ടായിരുന്നത്...
 വർഷങ്ങൾക്കുശേഷം  വെള്ളാപ്പിലെ പ്രധാനപ്പെട്ട  കാരണവന്മാമാരായ ബർകത്ത് ഹാജി, കുഞ്ഞിക്കുണ്ട് തറവാട്ടിലെ വലിയ കാരണവരായ കാദർച്ച, കവില്യാട്ട് മമ്മുഞ്ഞി ഹാജിക്ക, കെ പി അബ്ദുൽ കരീം മുസ്ലിയാർ  എന്നിവരടങ്ങിയ നമ്മുടെ നാട്ടിലെ തറവാട്ട് കാരണവന്മാരാണ് പള്ളി വിപുലീകരണം എന്ന മഹത്തായ ലക്ഷ്യവുമായി മുന്നോട്ടുപോയത്.<br/>
 അന്ന് തൊട്ടേ  അന്നം തേടി വിദേശത്ത് പോയ പ്രവാസികളുടെ  മഹത്തായ സംഭാവനകൾ നമ്മുടെ പള്ളിക്കുണ്ടായിരുന്നു.<br/>
 അവരുടെയൊക്കെ ആത്മാർത്ഥമായ  ശ്രമങ്ങളുടെ ഭാഗമായാണ് പിന്നീട് ഓലയിൽ നിന്നും ഓടുമേഞ്ഞ ഒരു മനോഹരമായ പള്ളിയിലേക്ക് വഴിമാറി തുടങ്ങിയത്.....
 1965 -66 കാലഘട്ടങ്ങളിലാണ് ഒരു മഹല്ല് സംവിധാനത്തിലേക്ക് നമ്മുടെ നാട് മാറാൻ തുടങ്ങിയത്.<br/>

 1966 വരെ  ഖാദിമുൽ ഇസ്ലാം സംഘം എന്ന പേരിൽ ഉണ്ടായിരുന്ന വെള്ളാപ്പിലെ കൂട്ടായ്മ മഹല്ല് കമ്മിറ്റി രൂപീകരണത്തോടുകൂടി  ഖാദിമുൽ ഇസ്ലാം ജമാഅത്ത് കമ്മിറ്റി  എന്ന പുതിയ പേരിൽ  മഹല്ല് സംവിധാനവും ഒപ്പം ജുമാ  സംവിധാനവും നിലവിൽ വന്നു.. <br/>
 ഇതിൽ എടുത്തു പറയേണ്ട ജുമാ ആരംഭിക്കുന്നതിന് മുമ്പേതന്നെ നമ്മുടെ നാട്ടിൽ ഇൽമിന്റെ ആദ്യാക്ഷരങ്ങൾ കുറിക്കുന്ന മദ്രസ സംവിധാനവും നിലവിൽ വന്നിരുന്നു.<br/>
 ജമാഅത്ത് ജുമാ സംവിധാനങ്ങൾ നിലവിൽ വരുന്നതിന് മുമ്പ്  നമ്മുടെ മഹല്ല് സെക്രട്ടറിയായി  അബ്ദുൽ കരീം ഹാജി മുസ്ലിയാരുടെ മകൻ  എൻ.അബ്ദുൽ ഹമീദ് മാസ്റ്റർ ആയിരുന്നു സെക്രട്ടറി പദം അലങ്കരിച്ചത്.
 ജുമാ ജമാഅത്ത് സംവിധാനം നിലവിൽ വന്നതിനുശേഷം ഒരു കമ്മിറ്റി എന്ന രൂപത്തിലേക്ക് മാറുകയും അതിന്റെ പ്രഥമ പ്രസിഡണ്ടായി  എബി അബ്ദുൽ കരീം ഹാജി എന്നവർ പ്രസിഡണ്ട് പി കുഞ്ഞഹമ്മദ് മാസ്റ്റർ ജനറൽ സെക്രട്ടറി പദവും അലങ്കാരിച്ച് കൊണ്ട് പ്രഥമ കമ്മിറ്റി നിലവിൽ വന്നു....
 പിന്നീട് അങ്ങോട്ട്  മുൻഗാമികളുടെയും  കമ്മിറ്റി മെമ്പർമാരുടെയും ഒക്കെ ശ്രമഫലത്തിന്റെ മഹല്ലിലെ ഉദാരമനസ്കരിൽ നിന്നും  ലഭിച്ച ഭൂ സ്വത്തുക്കൾ  പള്ളിക്കുവേണ്ടി വഖഫ് ആയി ലഭിച്ചതും ചരിത്രങ്ങളിൽ രേഖപ്പെടുത്തിയിട്ടുണ്ട്.
 പരിമിതമായ വീടുകളിൽ നിന്നുള്ള കുടിപ്പിരിവിനോടൊപ്പം  പറയപ്പെട്ട ഭൂമികളിൽ നിന്നും കിട്ടുന്ന  തേങ്ങ തന്നെയായിരുന്നു പള്ളിയുടെ അക്കാലത്തെ പ്രധാന വരുമാനം.<br/>
 തുച്ഛമായ വരുമാനങ്ങൾ കൊണ്ട് വളരെ പ്രയാസപ്പെട്ട് മഹല്ല് നിവാസികളുടെ അകമഴിഞ്ഞ സഹകരണം കൊണ്ടാണ് അക്കാലത്ത് ജമാഅത്ത് കമ്മിറ്റി അതിന്റെ പ്രവർത്തനങ്ങളുമായി മുമ്പോട്ട് പോയിക്കൊണ്ടിരുന്നത്.
 പിന്നീട് അങ്ങോട്ട് 1970 കളിൽ  മറ്റെല്ലാ പ്രദേശങ്ങൾ പോലെയും നമ്മുടെ നാട്ടിലും പല രീതിയിലും  ഗൾഫ് നാടുകളിലേക്കുള്ള കുടിയേറ്റം തുടങ്ങിയപ്പോൾ അതിന്റെ ഒരു നേട്ടം നമ്മുടെ മഹല്ല് കമ്മിറ്റിക്കും  കിട്ടിത്തുടങ്ങി എന്നതാണ് വസ്തുത.
 പിന്നീട് അങ്ങോട്ട് 1983 85 കാലഘട്ടങ്ങളിലാണ് കാലത്തിന് അനുസൃതമായ രീതിയിലേക്ക് ഓടിൽ നിന്നും അക്കാലത്തെ മനോഹരമായ കോൺക്രീറ്റിലേക്ക്  നമ്മുടെ പള്ളി മാറിയത്.<br/><br/>

 പുതിയ പള്ളിയുടെ നിർമ്മാണം തുടങ്ങിയ സമയത്താണ് നമ്മുടെ പഴയ പള്ളിയുടെ മുൻഭാഗത്തായി സ്ഥിതി ചെയ്തിരുന്ന പള്ളിക്കുളം പള്ളി വിപുലീകരണത്തിന് വേണ്ടി പൊളിച്ചുമാറ്റി എന്നുള്ളതാണ്.
 1986 ഓടുകൂടി  മനോഹരമായ കോൺക്രീറ്റ് മസ്ജിദിന്റെ നിർമ്മാണം പൂർത്തിയാക്കി  പാണക്കാട് സയ്യിദ് ഹൈദരലി ശിഹാബ് തങ്ങളുടെ കരങ്ങൾ കൊണ്ട്  പള്ളിയുടെ ഉദ്ഘാടനം നിർവഹിക്കപ്പെട്ടു.<br/><br/>
 1990 -93 കാലങ്ങളിലാണ് അതുവരെ ഓട് മേഞ്ഞ പഴയ കെട്ടിടത്തിൽ പ്രവർത്തിച്ചിരുന്ന  നജ്മൽ ഹുദാ മദ്രസ പൊളിച്ചുമാറ്റി  പുനർ നിർമ്മാണം തുടങ്ങിയത്.
 ആദ്യഘട്ടം  താഴത്തെ നില പൂർത്തിയാക്കി പ്രവർത്തനം തുടങ്ങുകയും  പിന്നീട് നാട്ടിലെ  ഉദാരമദികളുടെയും പ്രവാസി ഘടകങ്ങളുടെയും സഹായത്തോടുകൂടി  മുകളിൽ നിലയും പണി പൂർത്തിയാക്കി.
 പല ഘട്ടങ്ങളിലായി  ഒന്നു മുതൽ അഞ്ചു വരെയും  പിന്നീട് ഏഴ് വരെയും  അതിനുശേഷം സെക്കൻഡറി തലങ്ങളിലേക്ക് ക്ലാസുകൾ വ്യാപിപ്പിച്ചു കൊണ്ടും മദ്രസ സംവിധാനം ഇന്നും നല്ല രീതിയിൽ മുന്നോട്ടു പോയിക്കൊണ്ടിരിക്കുന്നു.<br/>

 ഇതിൽ എടുത്തു പറയേണ്ട മറ്റൊരു കാര്യം  ജുമാ സംവിധാനം നിലവിൽ വരുന്നതിനു മുമ്പേതന്നെ നമ്മുടെ ചുറ്റുവട്ടത്തുള്ള മറ്റു മഹല്ലുകൾ അപേക്ഷിച്ച്  പള്ളി ദർസ് ആരംഭിച്ച ഒരു പ്രദേശമാണ് വെള്ളാപ്പ് എന്ന  നേട്ടം നമുക്ക് മാത്രം അവകാശപ്പെട്ടതാണ്.<br/>
 ഒരുപാട് മഹാന്മാരായ സൂഫിവര്യന്മാരായ ഉസ്താദുമാർ  തുടങ്ങിവെച്ച്  നാട്ടിലും പുറനാട്ടിലുമായി  എന്നും സേവനങ്ങൾ ചെയ്തുകൊണ്ടിരിക്കുന്ന പണ്ഡിതന്മാരെ സംഭാവന ചെയ്തുകൊടുത്ത  ദർസ് സംവിധാനം അല്ലാഹുവിന്റെ അപാരമായ അനുഗ്രഹത്തോടെ കൂടി ഇപ്പോഴും നടന്നു പോകുന്നു.
 അന്ന് കാലങ്ങളിലൊക്കെ വീടുകളിലായിരുന്നു ഓരോ നേരവും മുതഅല്ലിം കുട്ടികളുടെ ഭക്ഷണം എങ്കിൽ  ഇന്ന് അത് അല്ലാഹുവിന്റെ അനുഗ്രഹത്താൽ  ഒപ്പം മഹല്ല് നിവാസികളുടെയും  പുറം നാടുകളിൽ ഉള്ളവരുടെയും  അകമഴിഞ്ഞ സഹായ  സഹകരണത്തോടുകൂടി കാന്റീൻ സംവിധാനത്തിൽ എത്തിനിൽക്കുന്നു.<br/>
 പള്ളിയുടെ തുടക്കം കുറിച്ച മാസം എന്നുള്ള നിലയിലാണ് ശഅ്ബാൻ 27ആം തീയതി  നമ്മുടെ പള്ളിയിൽ അന്ന് തൊട്ടേ  മുഹിയിദീൻ ശൈഖിന്റെ പേരിലുള്ള വലിയ റാത്തീബ് നടത്തിപ്പോരുന്നത്.<br/>
 ആദ്യകാലങ്ങളിൽ മലേഷ്യ സിംഗപ്പൂർ  പോലുള്ള നാടുകളിൽ മാത്രം ഉണ്ടായിരുന്ന  പ്രവാസി ഘടകങ്ങൾ പിന്നീട് ഗൾഫ് മേഖലയിലേക്കും കടന്നുവന്നു.<br/>
 അതിന്റെ ഭാഗമായി തന്നെ പ്രവർത്തനങ്ങളിൽ സജീവ സാന്നിധ്യം അറിയിച്ചുകൊണ്ട്  മലേഷ്യ സിംഗപ്പൂരിന് പുറമേ  യുഎഇ, ഖത്തറിൽ, കുവൈത്ത്, മസ്കത്ത്, ബഹറിൻ, സൗദി അറേബ്യ തുടങ്ങിയ പ്രദേശങ്ങളിൽ ഒക്കെ കമ്മിറ്റിയുടെ ശാഖ കമ്മിറ്റികൾ നിലവിൽ വന്നു.<br/>
1/88 നമ്പരായി സൊസൈറ്റി ആക്ട് പ്രകാരം  കേരള വഖഫ് ബോർഡിൽ രജിസ്റ്റർ ചെയ്ത വഖഫ് ബോർഡ് നിർദ്ദേശപ്രകാരമുള്ള എല്ലാ കാര്യങ്ങളും വളരെ കൃത്യമായി പാലിച്ചുകൊണ്ട് അതിന്റെ അംശാദായങ്ങൾ ഒക്കെ അടച്ചുകൊണ്ട് വളരെ നല്ല രീതിയിലാണ് ജമാഅത്ത് കമ്മിറ്റി ഇന്നും മുന്നോട്ടു പോയിക്കൊണ്ടിരിക്കുന്നത്.
          </p>
        </div>
      </section>
       <section className="relative py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between">
          
          {/* List Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:w-1/2 text-left mb-8 lg:mb-0 lg:pr-12"
          >
            <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
            Introducing Our New Jamath Management System
            </h2>
            <p className="text-base text-gray-700 mt-4">
              Our newly launched Jamaath management system streamlines Jamaath operations with an elegant interface, 
              designed to help you manage your accounts, members, and staff with ease.
            </p>

            <ul className="list-none space-y-2 text-sm text-gray-600 mt-3">
              <li>• Manage Jamaath accounts for both bank and cash.</li>
              <li>• Add house, and create member profiles with detailed information.</li>
              <li>• Generate monthly collections, and notify members via WhatsApp.</li>
              <li>• Manage staff, create payslips, and track payroll.</li>
              <li>• Create building and room contracts, with rent notifications to tenants.</li>
              <li>• Generate receipts for payments and donations.</li>
              <li>• Download including financial accounts,member details,collections and tenant records.</li>
              <li>• Respond to inquiries and WhatsApp messages directly through the platform.</li>
            </ul>
      
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-3"
            >
              <Link
                href="/dashboard"
                className="inline-block text-base font-medium text-white bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out"
              >
                Explore the Dashboard
              </Link>
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            className="lg:w-1/2 flex justify-center relative"
          >
      <Safari url="vellapmahal.com" className="size-full" src="/dashboard.svg" />
          </motion.div>
        </div>
      </div>
    </section>
        {/* Contact Section */}
        <section id="contact" className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Contact Us</h2>
            <p className="text-gray-600 md:mt-1">
              Feel free to reach out to us for any inquiries or support.
            </p>
            <p className='text-gray-600 mt-2 text-sm'>
            KHADIMUL ISLAM JAMA-ATH COMMITTEE <br />
            Reg. No: 1/88 K.W.B. Reg.No.A2/135/RA<br/>
            VELLAP, P.O. TRIKARIPUR-671310, KASARGOD DIST
            </p>
            <p className="text-gray-600 mt-2 font-semibold">
              Phone: +91 9567234112
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-6">
        <div className="max-w-7xl mx-auto text-center justify-between">
          <p>
            <Link href="/privacy&policy" target='_blank' className="text-sm">
              Privacy Policy
            </Link>
          </p>
          <p>&copy; 2024 Vellap Khadimul Jamaath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
