'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '../ui/use-toast';
import axios from 'axios';

interface PhoneNumber {
  id: number;
  name: string;
  number: string;
}

const AdminPhonenumbers = () => {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/get-numbers`);
      setNumbers(response.data || []);
    } catch (error) {
      toast({
        title: 'Error fetching numbers',
        description: 'Could not retrieve numbers from the server.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchNumbers(); // Fetch numbers on mount
  }, []);

  const handleAddOrUpdateNumber = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newName.trim() === '' || newNumber.trim() === '' || newNumber.length !== 10 || isNaN(Number(newNumber))) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid name and a 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const payload = {
      newNumber,
      newName,
      id: editingIndex !== null ? numbers[editingIndex].id : undefined,
    };
    const method = editingIndex !== null ? 'PUT' : 'POST';
    const endpoint = editingIndex !== null ? '/update-number' : '/add-number';

    try {
      const response = await axios({
        method,
        url: `${apiUrl}/api/admin${endpoint}`,
        data: payload,
      });

      if (response.status === 200) {
        fetchNumbers();
        setNewNumber('');
        setNewName('');
        setEditingIndex(null);
        toast({
          title: 'Success',
          description: editingIndex !== null ? 'Number updated successfully' : 'Number added successfully',
          variant: 'default',
        });
      }
    } catch (error:any) {
      toast({
        title: 'Failed to add/update number',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleEdit = (index: number) => {
    const { name, number } = numbers[index];
    setNewName(name);
    setNewNumber(number);
    setEditingIndex(index);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`${apiUrl}/api/admin/delete-number`, {
        data: { id },
      });

      if (response.status === 200) {
        fetchNumbers();
        toast({
          title: 'Number deleted successfully',
          variant: 'default',
        });
      }
    } catch (error:any) {
      toast({
        title: 'Failed to delete number',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <section className='mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Manage Admin Phone Numbers</CardTitle>
          <CardDescription>Add, edit, and delete admin numbers for OTP verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {numbers?.map((number, index) => (
              <div key={number.id} className="flex items-center space-x-4 space-y-2">
                <p>{number.name}: {number.number}</p>
                <Button size='sm' onClick={() => handleEdit(index)} variant="outline">Edit</Button>
                <Button size='sm' onClick={() => handleDelete(number.id)} variant="destructive">Delete</Button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddOrUpdateNumber} className="mt-4 flex space-x-2">
            <Input
              type="text"
              placeholder="Enter Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Enter Phone Number"
              value={newNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                if (value.length <= 10) {
                  setNewNumber(value); // Keep it as a string until submit
                }
              }}
              maxLength={10}
            />
            <Button size='sm' type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                editingIndex !== null ? 'Update' : 'Add'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminPhonenumbers;
