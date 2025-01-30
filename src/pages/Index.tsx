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
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('gallery-categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      "All", "Fashion", "Beauty", "Lifestyle", "Travel",
      "Fitness", "Dance", "Art", "Music", "Photography",
      "Nature", "Food", "Pets", "Sports", "Gaming",
      "Books", "Movies", "DIY", "Crafts", "Technology"
    ];
  });
  const [heartClicks, setHeartClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('gallery-categories', JSON.stringify(categories));
  }, [categories]);

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

  const handleImageClick = (values: Values) => {
    setCurrentValues(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.2, 
              scale: 1,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 5
            }}
          >
            {/* Randomly select an ornament */}
            {["🌸", "🐻", "🦋", "🌟", "🍀", "🌈", "🎀", "💝", "🌺", "✨"][i % 10]}
          </motion.div>
        ))}
      </div>

      <div className="fixed top-0 left-0 w-full h-[50px] bg-black/30 backdrop-blur-sm border-b border-pink-500/20 flex items-center justify-between z-50 px-6">
        <div className="flex items-center gap-2">
          <h1 
            className="font-sans text-2xl md:text-3xl font-bold tracking-wider"
            style={{
              background: "linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            femmy roulette
          </h1>
          <button 
            onClick={handleHeartClick}
            className="transition-transform hover:scale-110"
          >
            <Heart 
              className="w-5 h-5" 
              style={{
                fill: "url(#trans-gradient)",
                stroke: "none"
              }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="trans-gradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#56cbe5" />
                  <stop offset="33%" stopColor="#b452cd" />
                  <stop offset="66%" stopColor="#f0913a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </button>
        </div>

        {/* Slogan */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-dancing text-white/80"
          >
            Make love not war
          </motion.h2>
        </div>

        <div className="flex items-center space-x-8">
          {Object.entries(currentValues).map(([key, value]) => (
            <motion.div 
              key={key} 
              className="flex items-center space-x-2"
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.2, 1],
                transition: { duration: 0.3 }
              }}
            >
              <span className="text-2xl md:text-3xl font-medium text-pink-300">{key.toUpperCase()}:</span>
              <motion.span 
                className="text-3xl md:text-4xl font-bold text-white"
                key={value}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }
                }}
              >
                {value}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>

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
          <ImageGallery 
            onImageClick={handleImageClick} 
            adminMode={showAdmin} 
            selectedCategory={selectedCategory}
            categories={categories}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {showAdmin && (
          <AdminPanel 
            categories={categories}
            onAddCategory={(newCategory) => {
              if (!categories.includes(newCategory)) {
                setCategories(prev => [...prev, newCategory]);
                toast.success(`Added category: ${newCategory}`);
              }
            }}
            onRemoveCategory={(categoryToRemove) => {
              if (categoryToRemove !== "All") {
                setCategories(prev => prev.filter(cat => cat !== categoryToRemove));
                if (selectedCategory === categoryToRemove) {
                  setSelectedCategory("All");
                }
                toast.success(`Removed category: ${categoryToRemove}`);
              }
            }}
            onClose={() => setShowAdmin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;