import { format } from 'date-fns';
import React from 'react';

const DatePicker = ({ date, setDate, disabled }: any) => {
  const handleSelectDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
      // Parse the selected date and set time to 11:50 PM IST
      const utcDate = new Date(selectedDate);
      const exactISTDate = new Date(
        utcDate.getTime() + (11 * 60 + 50) * 60 * 1000 - utcDate.getTimezoneOffset() * 60 * 1000
      );
      setDate(exactISTDate);
    }
  };

  return (
    <div className="w-full">
      <input
        type="date"
        value={date ? format(date, 'yyyy-MM-dd') : ''}
        onChange={handleSelectDate}
        disabled={disabled}
        className="mt-1 block w-full rounded border-gray-300 border shadow-sm  sm:text-sm py-1 px-2"
      />
    </div>
  );
};

export default DatePicker;
