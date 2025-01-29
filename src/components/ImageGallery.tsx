import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Image {
  id: string;
  url: string;
  category: string;
}

interface ImageGalleryProps {
  onImageClick: () => void;
  adminMode?: boolean;
  selectedCategory?: string;
}

export const ImageGallery = ({ onImageClick, adminMode = false, selectedCategory = "All" }: ImageGalleryProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [uploadCategory, setUploadCategory] = useState(selectedCategory);

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem('gallery-images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gallery-images', JSON.stringify(images));
  }, [images]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImage: Image = {
        id: Date.now().toString(),
        url: imageUrl,
        category: uploadCategory,
      };
      setImages((prev) => [...prev, newImage]);
      toast.success(`Image added to ${uploadCategory} category!`);
    }
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    onImageClick();
  };

  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    toast.success("Image deleted successfully!");
  };

  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="w-full">
      {adminMode && (
        <div className="mb-6">
          <label className="block text-white mb-2">Select Category for Upload</label>
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-pink-500/20 text-white focus:outline-none focus:border-pink-500 mb-4"
          >
            {selectedCategory !== "All" ? (
              <option value={selectedCategory}>{selectedCategory}</option>
            ) : (
              <option value="">Select a category</option>
            )}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            className="relative group aspect-[1/2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src={image.url}
              alt="Gallery"
              className="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity shadow-md border-2 border-pink-200"
              onClick={() => handleImageClick(image)}
            />
            {adminMode && (
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </motion.div>
        ))}
        {adminMode && uploadCategory && (
          <label className="aspect-[1/2] border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors bg-pink-50/50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Plus className="w-8 h-8 text-pink-400" />
          </label>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-40"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[calc(100vh-70px)] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt="Selected"
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};