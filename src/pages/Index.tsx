import { useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { motion } from "framer-motion";

interface Values {
  w: number;
  x: number;
  y: number;
  z: number;
}

const Index = () => {
  const [currentValues, setCurrentValues] = useState<Values>({
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">
      {/* Numbers Display */}
      <div className="fixed top-0 left-0 w-full h-[50px] bg-pink-100/80 backdrop-blur-sm border-b border-pink-200 flex items-center justify-center space-x-8 z-50 shadow-sm">
        {Object.entries(currentValues).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-sm font-medium text-pink-700">{key.toUpperCase()}:</span>
            <span className="text-sm font-bold text-pink-900">{value}</span>
          </div>
        ))}
      </div>

      <div className="container mx-auto pt-[70px] pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <ImageGallery onImageClick={handleImageClick} />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;