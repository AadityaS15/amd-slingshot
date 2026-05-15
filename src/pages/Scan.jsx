import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppContext } from '../context/AppContext';
import { analyzeFoodImage } from '../utils/gemini';
import { playClickSound, playSuccessSound } from '../utils/audio';

export default function Scan() {
  const { logMeal } = useAppContext();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      playClickSound();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64) => {
    setLoading(true);
    try {
      const data = await analyzeFoodImage(base64);
      setResult(data);
    } catch {
      alert("Failed to analyze image. Please try again.");
      setImagePreview(null);
    }
    setLoading(false);
  };

  const handleSaveMeal = () => {
    playSuccessSound();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00C896', '#FFD700', '#FF6B6B']
    });
    
    logMeal({
      ...result,
      image: imagePreview
    });
    
    // Reset state after saving
    setTimeout(() => {
      setImagePreview(null);
      setResult(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full space-y-6 pt-4">
      <div className="bg-card p-6 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
          <Camera size={32} />
        </div>
        <h2 className="text-xl font-bold">Log Your Meal</h2>
        <p className="text-gray-500 text-sm">Take a photo or upload an image to analyze nutrients automatically.</p>
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageUpload}
        />
        
        <button 
          onClick={() => fileInputRef.current.click()}
          className="w-full py-4 bg-appletext text-white rounded-2xl font-semibold active:scale-95 transition-transform flex items-center justify-center space-x-2"
        >
          <ImageIcon size={20} />
          <span>Upload Photo</span>
        </button>
      </div>

      {imagePreview && !result && loading && (
        <div className="flex flex-col space-y-4 animate-pulse-skeleton mt-8">
          <div className="w-full h-64 bg-gray-200 rounded-3xl overflow-hidden relative">
             <img src={imagePreview} className="w-full h-full object-cover opacity-50 blur-sm" alt="scanning preview" />
             <div className="absolute inset-0 flex items-center justify-center text-white font-bold tracking-wide">
               Zest is reading your plate...
             </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet for Result */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 max-w-[430px] mx-auto pb-24 border-t border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold tracking-tight">{result.name}</h3>
              <button onClick={() => { playClickSound(); setResult(null); setImagePreview(null); }} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={result.healthScore > 70 ? 'text-accent' : result.healthScore >= 40 ? 'text-yellow-400' : 'text-red-500'}
                    strokeDasharray={`${result.healthScore}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold">{result.healthScore}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Health Score</p>
                <p className="text-3xl font-bold">{result.calories} <span className="text-sm text-gray-500 font-normal">kcal</span></p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-8">
              <MacroPill label="Protein" value={result.protein} color="bg-blue-100 text-blue-700" />
              <MacroPill label="Carbs" value={result.carbs} color="bg-yellow-100 text-yellow-700" />
              <MacroPill label="Fat" value={result.fat} color="bg-red-100 text-red-700" />
              <MacroPill label="Fiber" value={result.fiber} color="bg-green-100 text-green-700" />
            </div>

            <button onClick={handleSaveMeal} className="w-full py-4 bg-accent text-white rounded-2xl font-semibold shadow-lg shadow-accent/30 active:scale-95 transition-transform text-lg">
              Save Meal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MacroPill = ({ label, value, color }) => (
  <div className={`flex flex-col items-center justify-center p-2 rounded-2xl ${color}`}>
    <span className="text-xs font-semibold">{label}</span>
    <span className="text-lg font-bold">{value}g</span>
  </div>
);
