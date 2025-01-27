import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface RouletteWheelProps {
  onSpinComplete: (values: { w: number; x: number; y: number; z: number }) => void;
}

export const RouletteWheel = ({ onSpinComplete }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [numbers, setNumbers] = useState({ w: 0, x: 0, y: 0, z: 0 });

  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    toast("Spinning the wheel...");

    // Animate numbers changing rapidly
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      setNumbers({
        w: generateRandomNumber(),
        x: generateRandomNumber(),
        y: generateRandomNumber(),
        z: generateRandomNumber(),
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalNumbers = {
          w: generateRandomNumber(),
          x: generateRandomNumber(),
          y: generateRandomNumber(),
          z: generateRandomNumber(),
        };
        setNumbers(finalNumbers);
        setIsSpinning(false);
        onSpinComplete(finalNumbers);
        toast("Spin complete!");
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-100"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-6 mb-8">
          {Object.entries(numbers).map(([key, value]) => (
            <motion.div
              key={key}
              className="flex flex-col items-center p-4 bg-gray-50/80 rounded-xl"
              animate={{ scale: isSpinning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
            >
              <span className="text-sm font-medium text-gray-500 uppercase mb-2">
                {key.toUpperCase()}
              </span>
              <span className="text-4xl font-bold text-gray-900">{value}</span>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          onClick={spin}
          disabled={isSpinning}
          className="w-full py-4 px-6 bg-emerald-500 text-white rounded-xl font-medium 
                   transition-all duration-200 hover:bg-emerald-600 disabled:opacity-50
                   disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          whileTap={{ scale: 0.98 }}
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
        </motion.button>
      </motion.div>
    </div>
  );
};