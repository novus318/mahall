import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { places as initialPlaces } from '@/data/data'; 
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';

const AddPlaces = () => {
  const [places, setPlaces] = useState(initialPlaces); 
  const [newPlace, setNewPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle adding a new place
  const handleAddPlace = async (e:any) => {
    e.preventDefault();

    if (newPlace.trim() !== '') {
      setIsLoading(true);

      try {
        const response = await fetch('/api/places', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPlace }),
        });

        const data = await response.json();

        if (response.ok) {
          setPlaces(data.places); // Update local state with the new places array
          setNewPlace(''); // Clear input field
        } else {
          console.error('Failed to add place', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }

      setIsLoading(false);
    }
  };

  return (
    <section className='mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Add Places</CardTitle>
          <CardDescription>Add places for members.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {places.map((place, i) => (
              <div key={i} className="flex items-center space-x-4">
                <p>{place}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddPlace} className="mt-4 flex space-x-2">
            <Input
              type="text"
              placeholder="Enter new place"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
            />
            <Button size='sm' type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Add'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddPlaces;
