import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { playClickSound, playSuccessSound } from '../utils/audio';

const goals = ['Lose Weight', 'Maintain', 'Build Muscle'];
const diets = ['Non-Veg', 'Veg', 'Vegan'];

const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 24.9) return 'Normal';
  if (bmi >= 25 && bmi < 29.9) return 'Overweight';
  return 'Obese';
};

export default function Onboarding() {
  const { setUserProfile } = useAppContext();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    diet: ''
  });

  const nextStep = () => {
    playClickSound();
    setStep(s => s + 1);
  };

  const finish = () => {
    playSuccessSound();
    const bmi = calculateBMI(formData.weight, formData.height);
    setUserProfile({
      ...formData,
      bmi,
      bmiCategory: getBMICategory(bmi),
      onboardingCompleted: true
    });
  };

  const stepsContent = [
    // Welcome
    <div key="step-0" className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-4xl mb-4">🍋</div>
      <h1 className="text-4xl font-bold tracking-tight">Zest</h1>
      <p className="text-lg text-gray-500">What you eat shapes who you are. Let's make it count.</p>
      <button onClick={nextStep} className="mt-8 w-full py-4 bg-accent text-white rounded-2xl font-semibold text-lg shadow-lg active:scale-95 transition-transform">
        Start
      </button>
    </div>,
    // Basics
    <div key="step-1" className="flex flex-col h-full space-y-6 pt-12">
      <h2 className="text-3xl font-bold">Let's get to know you</h2>
      <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-card rounded-2xl outline-none focus:ring-2 focus:ring-accent" />
      <input type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-4 bg-card rounded-2xl outline-none focus:ring-2 focus:ring-accent" />
      <button disabled={!formData.name || !formData.age} onClick={nextStep} className="w-full py-4 bg-appletext text-white rounded-2xl font-semibold disabled:opacity-50 mt-auto mb-8 active:scale-95 transition-transform">
        Continue
      </button>
    </div>,
    // Body metrics
    <div key="step-2" className="flex flex-col h-full space-y-6 pt-12">
      <h2 className="text-3xl font-bold">Your Metrics</h2>
      <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-4 bg-card rounded-2xl outline-none focus:ring-2 focus:ring-accent" />
      <input type="number" placeholder="Height (cm)" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full p-4 bg-card rounded-2xl outline-none focus:ring-2 focus:ring-accent" />
      <button disabled={!formData.weight || !formData.height} onClick={nextStep} className="w-full py-4 bg-appletext text-white rounded-2xl font-semibold disabled:opacity-50 mt-auto mb-8 active:scale-95 transition-transform">
        Continue
      </button>
    </div>,
    // Goals & Diet
    <div key="step-3" className="flex flex-col h-full space-y-6 pt-12">
      <h2 className="text-3xl font-bold">Goals & Diet</h2>
      <div className="space-y-3">
        <p className="font-medium text-gray-500">Your Goal</p>
        <div className="flex flex-wrap gap-2">
          {goals.map(g => (
            <button key={g} onClick={() => { playClickSound(); setFormData({...formData, goal: g})}} className={`px-4 py-2 rounded-full border ${formData.goal === g ? 'bg-accent text-white border-accent' : 'bg-transparent border-gray-200'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3 mt-4">
        <p className="font-medium text-gray-500">Dietary Preference</p>
        <div className="flex flex-wrap gap-2">
          {diets.map(d => (
            <button key={d} onClick={() => { playClickSound(); setFormData({...formData, diet: d})}} className={`px-4 py-2 rounded-full border ${formData.diet === d ? 'bg-accent text-white border-accent' : 'bg-transparent border-gray-200'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <button disabled={!formData.goal || !formData.diet} onClick={nextStep} className="w-full py-4 bg-appletext text-white rounded-2xl font-semibold disabled:opacity-50 mt-auto mb-8 active:scale-95 transition-transform">
        See Results
      </button>
    </div>,
    // BMI Result
    <div key="step-4" className="flex flex-col h-full justify-center space-y-8 pt-12">
      <h2 className="text-3xl font-bold text-center">Your Profile</h2>
      <div className="bg-card p-8 rounded-3xl text-center space-y-4 shadow-sm border border-gray-100">
        <div className="text-6xl font-bold text-accent">{calculateBMI(formData.weight, formData.height)}</div>
        <p className="text-gray-500 uppercase tracking-widest text-sm">BMI Score</p>
        <div className="inline-block px-4 py-1 bg-white rounded-full text-appletext font-semibold shadow-sm text-sm">
          {getBMICategory(calculateBMI(formData.weight, formData.height))}
        </div>
      </div>
      <button onClick={finish} className="w-full py-4 bg-accent text-white rounded-2xl font-semibold shadow-lg shadow-accent/30 mt-auto mb-8 active:scale-95 transition-transform">
        Let's Go!
      </button>
    </div>
  ];

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-white px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {stepsContent[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
