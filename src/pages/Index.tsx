import { useState } from "react";
import { RouletteWheel } from "@/components/RouletteWheel";
import { History } from "@/components/History";
import { motion } from "framer-motion";

interface HistoryEntry {
  id: number;
  timestamp: Date;
  values: {
    w: number;
    x: number;
    y: number;
    z: number;
  };
}

const Index = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleSpinComplete = (values: { w: number; x: number; y: number; z: number }) => {
    const newEntry: HistoryEntry = {
      id: Date.now(),
      timestamp: new Date(),
      values,
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 10)); // Keep last 10 entries
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Random Number Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Generate random numbers with a beautiful spinning animation
          </motion.p>
        </div>

        <RouletteWheel onSpinComplete={handleSpinComplete} />
        <History entries={history} />
      </motion.div>
    </div>
  );
};

export default Index;