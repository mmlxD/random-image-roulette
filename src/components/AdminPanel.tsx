import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageGallery } from "./ImageGallery";

interface AdminPanelProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  onClose: () => void;
}

export const AdminPanel = ({ categories, onAddCategory, onRemoveCategory, onClose }: AdminPanelProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const ADMIN_PASSWORD = "FemmyAdmin2024!"; // In a real app, this would be stored securely

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      toast.success("Successfully logged in!");
    } else {
      toast.error("Invalid password!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-5xl border border-pink-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-pink-300 hover:text-pink-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-white mb-2">
                Enter Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-pink-500/20 text-white focus:outline-none focus:border-pink-500"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="bg-white/5 rounded-xl p-6 border border-pink-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Category Management</h3>
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-pink-500/20 text-white placeholder:text-pink-300/50 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Category
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-pink-500/20"
                  >
                    <span className="text-white">{category}</span>
                    {category !== "All" && (
                      <button
                        onClick={() => onRemoveCategory(category)}
                        className="text-pink-300 hover:text-pink-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-pink-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Image Management</h3>
              <ImageGallery onImageClick={() => {}} adminMode={true} />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};