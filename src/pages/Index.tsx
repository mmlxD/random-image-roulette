import { useState, useEffect } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Heart } from "lucide-react";
import { AdminPanel } from "@/components/AdminPanel";
import { toast } from "sonner";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([
    "All", "Fashion", "Beauty", "Lifestyle", "Travel",
    "Fitness", "Dance", "Art", "Music", "Photography",
    "Nature", "Food", "Pets", "Sports", "Gaming",
    "Books", "Movies", "DIY", "Crafts", "Technology"
  ]);
  const [heartClicks, setHeartClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleHeartClick = () => {
    setHeartClicks(prev => {
      if (prev === 14) {
        setShowAdmin(true);
        toast.success("Admin panel unlocked! 🎉");
        return 0;
      }
      return prev + 1;
    });
  };

  const handleImageClick = () => {
    const generateNumber = () => Math.floor(Math.random() * 100) + 1;
    
    // Animate numbers changing rapidly
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      setCurrentValues({
        w: generateNumber(),
        x: generateNumber(),
        y: generateNumber(),
        z: generateNumber(),
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalValues = {
          w: generateNumber(),
          x: generateNumber(),
          y: generateNumber(),
          z: generateNumber(),
        };
        setCurrentValues(finalValues);
      }
    }, 50);
  };

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      toast.success(`Added category: ${newCategory}`);
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (categoryToRemove !== "All") {
      setCategories(prev => prev.filter(cat => cat !== categoryToRemove));
      if (selectedCategory === categoryToRemove) {
        setSelectedCategory("All");
      }
      toast.success(`Removed category: ${categoryToRemove}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900">
      {/* Top Bar with Numbers */}
      <div className="fixed top-0 left-0 w-full h-[50px] bg-black/30 backdrop-blur-sm border-b border-pink-500/20 flex items-center justify-between z-50 px-6">
        <div className="flex items-center gap-2">
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-white tracking-wider">
            femmy roulette
          </h1>
          <button 
            onClick={handleHeartClick}
            className="text-pink-400 hover:text-pink-300 transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-8">
          {Object.entries(currentValues).map(([key, value]) => (
            <motion.div 
              key={key} 
              className="flex items-center space-x-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-lg md:text-xl font-medium text-pink-300">{key.toUpperCase()}:</span>
              <span className="text-xl md:text-2xl font-bold text-white">{value}</span>
            </motion.div>
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

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel 
            categories={categories}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            onClose={() => setShowAdmin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;