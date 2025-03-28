import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Banknote, BookIcon,  BookOpen,  Building2, CheckCircle2, Home, LayoutDashboard, LogOut,  MenuIcon, MessageCircle, ReceiptIndianRupeeIcon, SendIcon, Settings, User2Icon, X } from 'lucide-react';
import { useRouter,usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [isOpen, setIsOpen] = useState(false);
  const [messageCount, setMessageCount] = useState<number>(0);
  const CurrentPage = (path: string): boolean => {
    const pathname = usePathname()
    return pathname === path;
  };

  const fetchMessageCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/message/messages/count`);
      const data = await response.json();
      setMessageCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch message count:', error);
    }
  };

  useEffect(() => {
    fetchMessageCount();
    const interval = setInterval(() => {
      fetchMessageCount();
    }, 60000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center bg-gray-950 text-gray-950 p-1 w-full">
        <Link href="/">
        <img src='/VKJ.png' height={100} width={100} alt='' className='w-11'/>
        </Link>
        <Button variant='secondary' className='rounded-sm p-2' onClick={() => setIsOpen(!isOpen)}
            size='sm'>
         {isOpen ?  <X /> :  <MenuIcon />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-950 text-white p-4 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 md:w-1/6`}
      >
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <div className="flex items-center justify-center px-4">
              <img src='/VKJ.png' height={100} width={100} alt='' className='w-11'/>
            </div>
          </Link>
          <Button
          size='icon'
            onClick={handleLogout}
            className="flex items-center rounded px-2 hover:bg-white hover:text-gray-950  transition duration-300 ease-in-out transform hover:scale-105"
          >
            <LogOut className="mr-1" />
          </Button>
        </div>
        <ul>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/dashboard">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/dashboard') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <LayoutDashboard className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Dashboard</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/account">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/account') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <Banknote className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Account</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/house">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/house') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <Home className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">House</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/collection">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/collection') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <BookOpen className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Tuition Fees</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/rent">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/rent') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <Building2 className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Rent</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/payment">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/payment') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <SendIcon className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Payment</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/reciept">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/reciept') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <ReceiptIndianRupeeIcon className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Reciept</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/staff">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/staff') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <User2Icon className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Staff</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/reports">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/reports') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <BookIcon className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Reports</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/messages">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/messages') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <MessageCircle className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Message</span>
        {messageCount > 0 && (
          <span className="ml-2 bg-slate-700 text-white rounded-sm text-xs px-2 py-0.5">
            {messageCount}
          </span>
        )}
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/settings">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/settings') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <Settings className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Settings</span>
      </div>
    </Link>
  </li>
  <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-100">
    <Link href="/payment-online">
      <div
        className={`flex items-center py-1 px-2 rounded-md hover:bg-white hover:text-gray-950 ${
          CurrentPage('/payment-online') ? 'bg-gray-900 text-gray-50' : 'bg-gray-950 text-gray-400'
        }`}
      >
        <CheckCircle2 className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-lg">Verify and payment</span>
      </div>
    </Link>
  </li>
</ul>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default Sidebar;
