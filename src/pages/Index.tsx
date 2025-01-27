import { useState } from "react";
import { RouletteWheel } from "@/components/RouletteWheel";
import { History } from "@/components/History";
import { ImageGallery } from "@/components/ImageGallery";
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
  const [currentValues, setCurrentValues] = useState({
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  });

  const handleImageClick = () => {
    const values = {
      w: Math.floor(Math.random() * 100) + 1,
      x: Math.floor(Math.random() * 100) + 1,
      y: Math.floor(Math.random() * 100) + 1,
      z: Math.floor(Math.random() * 100) + 1,
    };
    setCurrentValues(values);
    const newEntry: HistoryEntry = {
      id: Date.now(),
      timestamp: new Date(),
      values,
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Numbers Display */}
      <div className="fixed top-0 left-0 w-full h-[30px] bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-center space-x-8 z-40">
        {Object.entries(currentValues).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">{key.toUpperCase()}:</span>
            <span className="text-sm font-bold">{value}</span>
          </div>
        ))}
      </div>

      <div className="container mx-auto pt-[50px] pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <ImageGallery onImageClick={handleImageClick} />
          <History entries={history} />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;