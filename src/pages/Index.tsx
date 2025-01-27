import { useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface Values {
  w: number;
  x: number;
  y: number;
  z: number;
}

const categories = [
  "All", "Fashion", "Beauty", "Lifestyle", "Travel",
  "Fitness", "Dance", "Art", "Music", "Photography",
  "Nature", "Food", "Pets", "Sports", "Gaming",
  "Books", "Movies", "DIY", "Crafts", "Technology"
];

const Index = () => {
  const [currentValues, setCurrentValues] = useState<Values>({
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900">
      {/* Top Bar with Numbers */}
      <div className="fixed top-0 left-0 w-full h-[50px] bg-black/30 backdrop-blur-sm border-b border-pink-500/20 flex items-center justify-between z-50 px-6">
        <h1 className="font-['Dancing_Script'] text-3xl text-white">FEMMY ROULETTE</h1>
        <div className="flex items-center space-x-8">
          {Object.entries(currentValues).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-pink-300">{key.toUpperCase()}:</span>
              <span className="text-sm font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="pt-[70px] pb-6 px-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-pink-400" />
          <h2 className="text-xl font-semibold text-white">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  selectedCategory === category
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto pb-12">
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