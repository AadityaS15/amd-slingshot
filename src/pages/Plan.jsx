import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ChevronDown, ChevronUp, Download, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateMealPlan } from '../utils/gemini';
import { playClickSound, playSuccessSound } from '../utils/audio';

export default function Plan() {
  const { userProfile, mealPlan, setMealPlan } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [openDay, setOpenDay] = useState(1);

  const handleGenerate = async () => {
    playClickSound();
    setLoading(true);
    try {
      const plan = await generateMealPlan(userProfile);
      setMealPlan(plan);
      playSuccessSound();
    } catch {
      alert("Failed to generate plan. Please try again.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    playClickSound();
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Zest Meal Plan for ${userProfile.name}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Goal: ${userProfile.goal} | Diet: ${userProfile.diet} | BMI: ${userProfile.bmi}`, 20, 30);
    
    let yPos = 45;
    
    mealPlan.days.forEach((day) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${day.day}`, 20, yPos);
      yPos += 8;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Breakfast: ${day.breakfast}`, 20, yPos);
      yPos += 7;
      doc.text(`Lunch: ${day.lunch}`, 20, yPos);
      yPos += 7;
      doc.text(`Dinner: ${day.dinner}`, 20, yPos);
      yPos += 7;
      doc.text(`Snacks: ${day.snacks}`, 20, yPos);
      yPos += 15;
    });

    doc.save('Zest_Meal_Plan.pdf');
  };

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent">
          <Sparkles size={40} />
        </div>
        <h2 className="text-2xl font-bold">Your AI Meal Plan</h2>
        <p className="text-gray-500 max-w-[280px]">Based on your profile, we'll craft a personalized 7-day meal plan to hit your goals.</p>
        
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full max-w-[300px] py-4 bg-appletext text-white rounded-2xl font-semibold active:scale-95 transition-transform flex items-center justify-center space-x-2 mt-4"
        >
          {loading ? (
            <span className="animate-pulse">Crafting plan...</span>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate My Plan</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pt-4 pb-12">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Your 7-Day Plan</h2>
        <button onClick={handleDownload} className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold active:scale-95 transition-transform">
          <Download size={16} />
          <span>Save PDF 📄</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {mealPlan.days.map((day) => (
          <div key={day.day} className="bg-card rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300">
            <button 
              onClick={() => { playClickSound(); setOpenDay(openDay === day.day ? null : day.day); }}
              className="w-full p-5 flex justify-between items-center bg-white"
            >
              <span className="font-bold text-lg">Day {day.day}</span>
              {openDay === day.day ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
            </button>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openDay === day.day ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-5 pt-0 space-y-4 bg-white pb-6">
                <MealItem type="Breakfast" content={day.breakfast} />
                <MealItem type="Lunch" content={day.lunch} />
                <MealItem type="Dinner" content={day.dinner} />
                <MealItem type="Snacks" content={day.snacks} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MealItem = ({ type, content }) => (
  <div>
    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{type}</h4>
    <p className="text-sm font-medium text-appletext">{content}</p>
  </div>
);
