import React, { useState } from 'react';
import { addMinutes, format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

const DatePicker = ({ date, setDate,disabled }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Set the time to 11:50 PM IST (Indian Standard Time)
      const exactISTDate = addMinutes(selectedDate, (11 * 60 + 50) - selectedDate.getTimezoneOffset());

      setDate(exactISTDate);
    }
    setIsOpen(false); // Close the popover after selecting a date
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
        disabled={disabled}
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
          toYear={2050}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
