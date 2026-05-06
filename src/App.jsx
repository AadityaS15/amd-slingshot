import React, { useState } from 'react';
import { Camera, Calendar, Flame, Award, BookOpen } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import Scan from './pages/Scan';
import Today from './pages/Today';
import Plan from './pages/Plan';
import Streaks from './pages/Streaks';
import Rewards from './pages/Rewards';
import Onboarding from './pages/Onboarding';

function App() {
  const { userProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('scan');

  if (!userProfile?.onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white relative pb-20 overflow-x-hidden">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-appletext">
          {activeTab === 'scan' && 'Scan Meal'}
          {activeTab === 'today' && 'Today\'s Log'}
          {activeTab === 'plan' && 'My Plan'}
          {activeTab === 'streaks' && 'Streaks'}
          {activeTab === 'rewards' && 'Rewards'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 hide-scrollbar pb-24">
        {activeTab === 'scan' && <Scan />}
        {activeTab === 'today' && <Today />}
        {activeTab === 'plan' && <Plan />}
        {activeTab === 'streaks' && <Streaks />}
        {activeTab === 'rewards' && <Rewards />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 max-w-[430px] mx-auto z-50">
        <div className="flex justify-between items-center px-6 py-4">
          <NavItem icon={<Camera size={24} />} label="Scan" isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
          <NavItem icon={<Calendar size={24} />} label="Today" isActive={activeTab === 'today'} onClick={() => setActiveTab('today')} />
          <NavItem icon={<BookOpen size={24} />} label="Plan" isActive={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
          <NavItem icon={<Flame size={24} />} label="Streaks" isActive={activeTab === 'streaks'} onClick={() => setActiveTab('streaks')} />
          <NavItem icon={<Award size={24} />} label="Rewards" isActive={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
        </div>
      </nav>
    </div>
  );
}

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
