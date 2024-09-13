'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { format, parse } from 'date-fns';


const formatPrayerTime = (date: string) => {
    if(date){
        return format(date, 'hh:mm a');
    }
    return '';
  };
// Example of ReviewCard component, if you are using it to show prayers
const ReviewCard = ({
  name,
  time,
}: {
  name: string;
  time: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-col items-center">
        <figcaption className="text-sm font-medium dark:text-white">
          {name}
        </figcaption>
        <blockquote className="mt-2 text-sm">{time}</blockquote>
      </div>
    </figure>
  );
};

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().getDay(); 

  useEffect(() => {
    const getPrayerTimes = async (date: string) => {
      try {
        const response = await axios.get('https://api.aladhan.com/v1/timings', {
          params: {
            date: date,
            latitude: 12.1395,  
            longitude: 75.1701, 
            method: 4, // Umm Al-Qura University, Makkah (for example)
            school: 0, // Shafi (default)
            timezonestring: 'Asia/Kolkata', // Timezone of Kerala
            iso8601: true // Optional, to get the time in ISO 8601 format
          }
        });
        setPrayerTimes(response.data.data.timings); // Save prayer times to state
        setLoading(false); // Mark loading as done
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false); // Still mark as done even on error
      }
    };
    getPrayerTimes(new Date().toLocaleDateString('en-GB'));
  }, []);

  const formatCurrentDate = () => {
    return format(new Date(), 'EEEE, MMMM d, yyyy'); 
  };
  
  const formatCurrentTime = () => {
    return format(new Date(), 'hh:mm a'); 
  };

  if (loading) {
    return (
      <div className="py-12 w-full flex-col items-center justify-center">
        <div className="mx-10 mb-6">
          <h1 className="text-3xl font-bold">Loading Prayer Times...</h1>
          <div className="h-6 bg-gray-200 rounded mt-4 w-32"></div>
          <div className="h-6 bg-gray-200 rounded mt-2 w-24"></div>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-4 overflow-hidden">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="w-64 h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  

  if (!prayerTimes) {
    return null;
  }

  const prayers = [
    { name: "Fajr", time: formatPrayerTime(prayerTimes.Fajr) },
    { name: "Dhuhr", time: formatPrayerTime(prayerTimes.Dhuhr) },
    { name: "Asr", time: formatPrayerTime(prayerTimes.Asr) },
    { name: "Maghrib", time: formatPrayerTime(prayerTimes.Maghrib) },
    { name: "Isha", time: formatPrayerTime(prayerTimes.Isha) },
  ];

  // Add Jumu'ah prayer only if today is Friday
  if (today === 5) {
    prayers.push({ name: "Jumu'ah", time: formatPrayerTime(prayerTimes.Dhuhr) });
  }

  return (
   <div className='py-12 w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl'>
    <div className="mx-10 mb-6">
    <h1 className="text-3xl font-bold">Prayer Times</h1>
    <p className="text-sm font-bold text-muted-foreground">{formatCurrentDate()}</p>
    <p className="text-sm font-bold text-muted-foreground">{formatCurrentTime()}</p>
  </div>
    <div className="relative flex">
    <Marquee pauseOnHover className="[--duration:20s]">
      {prayers.map((prayer) => (
        <ReviewCard key={prayer.name} name={prayer.name} time={prayer.time} />
      ))}
    </Marquee>
    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
  </div>
  </div>
  );
};

export default PrayerTimes;
