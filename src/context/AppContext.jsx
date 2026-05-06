import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('zest_userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('zest_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('zest_streak');
    return saved ? JSON.parse(saved) : { current: 0, lastLogDate: null, freezeAvailable: false };
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('zest_points');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('zest_mealPlan');
    return saved ? JSON.parse(saved) : null;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (userProfile) localStorage.setItem('zest_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('zest_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('zest_streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('zest_points', points.toString());
  }, [points]);

  useEffect(() => {
    if (mealPlan) localStorage.setItem('zest_mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const logMeal = (mealData) => {
    setMeals(prev => [{ ...mealData, id: Date.now(), timestamp: new Date().toISOString() }, ...prev]);
    
    // Update Points
    let earnedPoints = 10;
    if (mealData.healthScore > 70) earnedPoints = 50;
    else if (mealData.healthScore >= 40) earnedPoints = 25;
    
    setPoints(prev => {
      const newPoints = prev + earnedPoints;
      // Check for streak freeze unlock
      if (prev < 200 && newPoints >= 200) {
        setStreak(s => ({ ...s, freezeAvailable: true }));
      }
      return newPoints;
    });

    // Update Streak
    const today = new Date().toDateString();
    setStreak(prev => {
      if (prev.lastLogDate === today) return prev; // Already logged today
      
      const lastLog = new Date(prev.lastLogDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (prev.lastLogDate && lastLog.toDateString() !== yesterday.toDateString() && !prev.freezeAvailable) {
        // Streak broken
        return { ...prev, current: 1, lastLogDate: today };
      } else if (prev.lastLogDate && lastLog.toDateString() !== yesterday.toDateString() && prev.freezeAvailable) {
         // Use freeze
         return { ...prev, current: prev.current + 1, lastLogDate: today, freezeAvailable: false };
      }
      
      // Increment streak
      return { ...prev, current: prev.current + 1, lastLogDate: today };
    });
  };

  return (
    <AppContext.Provider value={{
      userProfile, setUserProfile,
      meals, logMeal,
      streak, setStreak,
      points, setPoints,
      mealPlan, setMealPlan
    }}>
      {children}
    </AppContext.Provider>
  );
};
