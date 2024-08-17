'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Button } from '@/components/ui/button';

const DataTable = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [houses, setHouses] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/get-all`);
      if (response.data.success) {
        setHouses(response.data.houses);
      }
    } catch (error) {
      console.error('Failed to fetch houses', error);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = houses.map((house) => house.familyHead._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleGenerateCollection = () => {
    console.log('Generate collection for IDs:', selectedIds);
  };

  const filteredHouses = houses.filter((house) => {
    return (
      house.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.LastCollection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.collectionAmount.toString().includes(searchQuery) ||
      house.familyHead.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className='w-full p-2 rounded-md border my-2 md:my-4 mx-auto'>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {selectedIds.length > 0 && (
        <Button
          size='sm'
          onClick={handleGenerateCollection}
          className="mb-4"
        >
          Generate Collection
        </Button>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedIds.length === filteredHouses.length}
                onCheckedChange={(isChecked) => handleSelectAll(!!isChecked)}
              />
            </TableHead>
            <TableHead>House</TableHead>
            <TableHead>Last Collection</TableHead>
            <TableHead>Collection Amount</TableHead>
            <TableHead>Family Head</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHouses.map((house, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(house.familyHead._id)}
                  onCheckedChange={(isChecked) => handleSelect(house.familyHead._id, !!isChecked)}
                />
              </TableCell>
              <TableCell>{house.number}</TableCell>
              <TableCell>{house.LastCollection || 'no collection'}</TableCell>
              <TableCell>{house.collectionAmount}</TableCell>
              <TableCell>{house.familyHead.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {selectedIds?.length > 0 && (
  <TableFooter>
   <p>{selectedIds?.length} are selected</p>
  </TableFooter>
)}
      </Table>
    </div>
  );
};

export default DataTable;


