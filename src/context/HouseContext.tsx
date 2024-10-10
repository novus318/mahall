'use client'
import React, { createContext, ReactNode } from 'react';
import axios from 'axios';
import useSWR from 'swr';

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
  isLoading: boolean;
  isError: boolean;
  fetchHouses: () => void; // Add fetchHouses to the context type
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then(res => res.data.houses);

export const HouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: houses, error, isLoading, mutate } = useSWR(`${apiUrl}/api/house/get`, fetcher, {
    revalidateOnFocus: false, // disable automatic revalidation on window focus
    dedupingInterval: 60000,  // dedupe requests for 60 seconds
  });

  // Define the fetchHouses method that uses SWR's mutate function
  const fetchHouses = () => {
    mutate(); // This triggers a re-fetch of the data
  };

  return (
    <HouseContext.Provider value={{ houses: houses || [], isLoading: !houses && !error, isError: !!error, fetchHouses }}>
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
