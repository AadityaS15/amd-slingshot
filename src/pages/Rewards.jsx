import React, { useState, useEffect } from 'react';
import { Award, Gift, Target, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { playSuccessSound } from '../utils/audio';

export default function Rewards() {
  const { points, setPoints, meals } = useAppContext();
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [lastTier, setLastTier] = useState(0);

  // Challenge State (Mocked daily challenge)
  const challenge = { title: "Log a meal under 500 calories", bonus: 20 };
  const challengeCompleted = meals.some(m => new Date(m.timestamp).toDateString() === new Date().toDateString() && m.calories < 500);

  useEffect(() => {
    // Check for tier unlocks
    let currentTier = 0;
    if (points >= 600) currentTier = 3;
    else if (points >= 300) currentTier = 2;
    else if (points >= 100) currentTier = 1;

    if (currentTier > lastTier && lastTier !== 0) {
      setShowBadgeUnlock(true);
      playSuccessSound();
      setTimeout(() => setShowBadgeUnlock(false), 3000);
    }
    setLastTier(currentTier);
  }, [points, lastTier]);

  const progress = Math.min((points / 600) * 100, 100);

  return (
    <div className="flex flex-col space-y-8 pt-4 pb-12 items-center">
      
      {/* Points Display */}
      <div className="text-center space-y-2 mt-4">
        <h2 className="text-gray-500 font-medium uppercase tracking-widest text-sm">Total XP</h2>
        <div className="text-6xl font-black text-accent">{points}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs font-bold text-gray-400 px-1">
          <span className={points >= 100 ? 'text-orange-700' : ''}>Bronze 100</span>
          <span className={points >= 300 ? 'text-gray-600' : ''}>Silver 300</span>
          <span className={points >= 600 ? 'text-yellow-500' : ''}>Gold 600</span>
        </div>
        <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent to-green-400"
          />
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="w-full bg-card rounded-3xl p-6 border border-gray-100 flex items-start space-x-4">
        <div className={`p-3 rounded-2xl ${challengeCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          <Target size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">Daily Challenge</h3>
          <p className="text-gray-500 text-sm mt-1">{challenge.title}</p>
          <div className="mt-3 flex items-center space-x-2">
            <span className="px-2 py-1 bg-white text-xs font-bold rounded-md shadow-sm text-gray-600">+{challenge.bonus} XP</span>
            {challengeCompleted && <span className="flex items-center text-xs font-bold text-green-600"><CheckCircle2 size={14} className="mr-1"/> Completed</span>}
          </div>
        </div>
      </div>

      {/* Tiers & Rewards */}
      <div className="w-full space-y-4">
        <h3 className="font-bold text-xl mb-2">Rewards</h3>
        
        <TierCard title="Bronze Member" points={100} current={points} icon={<Award className="text-orange-700" />} />
        <TierCard title="Silver Member" points={300} current={points} icon={<Award className="text-gray-600" />} />
        <TierCard title="Gold Member" points={600} current={points} icon={<Award className="text-yellow-500" />} />

        {/* Mock Coupon for Gold */}
        {points >= 600 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/30 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12">
              <Gift size={100} />
            </div>
            <h3 className="font-bold text-2xl relative z-10">Coupon Unlocked!</h3>
            <p className="font-medium mt-1 relative z-10">20% off at partner restaurants.</p>
            <div className="mt-6 bg-white/20 backdrop-blur-sm p-4 rounded-2xl text-center border border-white/30 relative z-10">
              <p className="text-sm font-medium uppercase tracking-wider text-white/80 mb-1">Use Code</p>
              <p className="text-3xl font-black tracking-widest">ZEST20</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Full Screen Badge Animation */}
      <AnimatePresence>
        {showBadgeUnlock && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-[40px] p-10 text-center shadow-2xl flex flex-col items-center w-full max-w-sm"
            >
              <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                 <Award size={64} className="text-yellow-500" />
              </div>
              <h2 className="text-3xl font-black mb-2">Level Up!</h2>
              <p className="text-gray-500 font-medium text-lg">You've reached a new tier.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const TierCard = ({ title, points, current, icon }) => {
  const unlocked = current >= points;
  return (
    <div className={`p-5 rounded-3xl flex items-center space-x-4 border ${unlocked ? 'bg-white border-gray-200' : 'bg-gray-50 border-transparent opacity-60 grayscale'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${unlocked ? 'bg-gray-100' : 'bg-gray-200'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-gray-500 font-medium">{points} XP Required</p>
      </div>
      {unlocked && <CheckCircle2 className="text-green-500" />}
    </div>
  );
};
