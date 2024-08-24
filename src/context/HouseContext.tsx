
'use client'
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the house object
interface House {
  id: string;
  number: number;
  name: string;
  address: string;
}

// Define the shape of the context
interface HouseContextType {
  houses: House[];
  fetchHouses: () => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export const HouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchHouses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/get`);
      setHouses(response.data.houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  return (
    <HouseContext.Provider value={{ houses, fetchHouses}}>
      {children}
    </HouseContext.Provider>
  );
};

export const useHouseContext = () => {
  const context = React.useContext(HouseContext);
  if (!context) {
    throw new Error('useHouseContext must be used within a HouseProvider');
  }
  return context;
};
