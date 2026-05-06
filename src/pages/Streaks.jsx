import React from 'react';
import { Flame, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Streaks() {
  const { streak, meals } = useAppContext();

  // Generate last 7 days calendar
  const today = new Date();
  const calendarDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    
    // Check if meal logged on this day
    const hasLog = meals.some(m => new Date(m.timestamp).toDateString() === dateStr);
    
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dateNum: d.getDate(),
      hasLog,
      isToday: i === 6
    };
  });

  return (
    <div className="flex flex-col space-y-8 pt-4 pb-12 items-center">
      
      <div className="relative w-48 h-48 flex items-center justify-center">
         {/* Decorative background glow */}
         <div className="absolute inset-0 bg-orange-400 opacity-20 blur-3xl rounded-full" />
         
         <div className="relative z-10 flex flex-col items-center">
           <Flame size={80} className={`${streak.current > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
           <span className="text-5xl font-black mt-2">{streak.current}</span>
           <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Day Streak</span>
         </div>
      </div>

      <div className="w-full bg-card rounded-3xl p-6 border border-gray-100">
        <h3 className="font-bold mb-4 text-center">Your Week</h3>
        <div className="flex justify-between">
          {calendarDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <span className={`text-xs font-semibold ${day.isToday ? 'text-accent' : 'text-gray-400'}`}>
                {day.dayName}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                day.hasLog 
                  ? 'bg-orange-100 text-orange-500' 
                  : day.isToday 
                    ? 'border-2 border-dashed border-gray-300 text-gray-400' 
                    : 'bg-white text-gray-400'
              }`}>
                {day.hasLog ? <Flame size={16} className="fill-orange-500" /> : day.dateNum}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`w-full p-6 rounded-3xl flex items-center space-x-4 border ${streak.freezeAvailable ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${streak.freezeAvailable ? 'bg-blue-200 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
          <Shield size={24} className={streak.freezeAvailable ? 'fill-blue-600' : ''} />
        </div>
        <div>
          <h4 className="font-bold">Streak Freeze</h4>
          <p className="text-sm text-gray-500 font-medium">
            {streak.freezeAvailable ? "Active. Miss a day, keep your streak." : "Unlock at 200 points."}
          </p>
        </div>
      </div>

    </div>
  );
}
