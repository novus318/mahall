import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Banknote, Home, LayoutDashboard, LogOut, MenuIcon, ReceiptIndianRupee, User2Icon, X } from 'lucide-react';
import { useRouter,usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const CurrentPage = (path: string): boolean => {
    const pathname = usePathname()
    return pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center  text-white p-1 w-full">
        <Link href="/">
         <span >Mahal</span>
        </Link>
        <Button onClick={() => setIsOpen(!isOpen)}
            size='icon'>
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
            <span>Mahal</span>
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
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-white hover:text-gray-950  ${
                  CurrentPage('/') ? 'bg-gray-900 text-gray-50': 'bg-gray-950 text-gray-400'
                }`}
              >
                <LayoutDashboard className="mr-3" />
                <span className="text-lg">Dashboard</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/account">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-white hover:text-gray-950  ${
                  CurrentPage('/account') ?'bg-gray-900 text-gray-50' :'bg-gray-950 text-gray-400'
                }`}
              >
                <Banknote className="mr-3" />
                <span className="text-lg">Account</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/house">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-white hover:text-gray-950  ${
                  CurrentPage('/house') ?'bg-gray-900 text-gray-50' :'bg-gray-950 text-gray-400'
                }`}
              >
                <Home className="mr-3" />
                <span className="text-lg">House</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/collection">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-white hover:text-gray-950  ${
                  CurrentPage('/collection') ?'bg-gray-900 text-gray-50' :'bg-gray-950 text-gray-400'
                }`}
              >
                <ReceiptIndianRupee className="mr-3" />
                <span className="text-lg">Collection</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/staff">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-white hover:text-gray-950  ${
                  CurrentPage('/staff') ?'bg-gray-900 text-gray-50' :'bg-gray-950 text-gray-400'
                }`}
              >
                <User2Icon className="mr-3" />
                <span className="text-lg">Staff</span>
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
