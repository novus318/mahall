'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import initialNumbers from '@/data/number.json'; // Adjust the import according to your structure
import { toast } from '../ui/use-toast';

interface PhoneNumber {
  id: number;
  name: string;
  number: string;
}

const AdminPhonenumbers = () => {
  const [numbers, setNumbers] = useState<PhoneNumber[]>(initialNumbers);
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fetchNumbers = async () => {
    try {
      const response = await fetch('/api/numbers');
      if (response.ok) {
        const data = await response.json();
        setNumbers(data); // Assuming the GET response returns an array of numbers
      } else {
        console.error('Failed to fetch numbers');
      }
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  useEffect(() => {
    fetchNumbers(); // Fetch numbers when the component mounts
  }, []);

  const handleAddOrUpdateNumber = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newName.trim() === '') {
        toast({
            title: 'Validation Error',
            description: 'Name cannot be empty.',
            variant: 'destructive',
        });
        return; // Exit if validation fails
    }

    if (newNumber.trim() === '' || newNumber.length !== 10 || isNaN(Number(newNumber))) {
        toast({
            title: 'Validation Error',
            description: 'Phone number must be a 10-digit number.',
            variant: 'destructive',
        });
        return; // Exit if validation fails
    }
    if ( newName.trim() !== '') {
      setIsLoading(true);
      
      const payload = {
        newNumber,
        newName,
        id: editingIndex !== null ? numbers[editingIndex].id : undefined, // Include id for updates
      };

      const method = editingIndex !== null ? 'PUT' : 'POST'; // Determine method based on editing state

      try {
        const response = await fetch('/api/numbers', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 200) {
          fetchNumbers(); // Refetch numbers after adding/updating
          setNewNumber('');
          setNewName('');
          setEditingIndex(null); 
        } else {
          const data = await response.json();
          toast({
            title: 'Failed to add/update number',
            description: data|| 'Something went wrong',
            variant: 'destructive',
          })
        }
      } catch (error:any) {
        console.log(error)
        toast({
            title: 'Failed to add/update number',
            description: 'Something went wrong',
            variant: 'destructive',
        })
      }

      setIsLoading(false);
    }
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
      const response = await fetch('/api/numbers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchNumbers(); // Refetch numbers after deletion
      } else {
        const data = await response.json();
        console.error('Failed to delete number', data);
      }
    } catch (error) {
      console.error('Error:', error);
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
            {numbers.map((number, index) => (
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
