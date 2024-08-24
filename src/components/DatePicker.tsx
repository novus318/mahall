import React, { useState } from 'react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

const DatePicker = ({ date, setDate }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsOpen(false); // Close the popover after selecting a date
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size='sm'
          className={cn(
            "justify-start text-left font-normal text-xs w-full",
            !date && "text-muted-foreground"
          )}
          onClick={() => setIsOpen(!isOpen)} // Toggle popover visibility
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
          fromYear={1920}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
