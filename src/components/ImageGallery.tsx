import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

interface Image {
  id: string;
  url: string;
  category: string;
}

interface ImageGalleryProps {
  onImageClick: () => void;
  adminMode?: boolean;
  selectedCategory?: string;
  categories?: string[];
}

// Initialize Supabase client with your project's URL and anon key
const supabase = createClient(
  'https://rlhvxmxigqxhznbvqhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaHZ4bXhpZ3F4aHpuYnZxaGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1MzI5ODAsImV4cCI6MjAyMjEwODk4MH0.BEBeQfqQVKkDGHJ5YcXGGbQn54_D5GHNbOZBwkE4fvM'
);

export const ImageGallery = ({ 
  onImageClick, 
  adminMode = false, 
  selectedCategory = "All",
  categories = []
}: ImageGalleryProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [uploadCategory, setUploadCategory] = useState(selectedCategory);

  // Load images from Supabase on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('images')
          .select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          toast.error("Failed to load images");
          return;
        }

        if (data) {
          setImages(data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error("Failed to connect to the database");
      }
    };

    fetchImages();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadCategory) {
      try {
        // First, upload file to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error("Failed to upload image");
          return;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        // Save image record
        const { data: imageData, error: imageError } = await supabase
          .from('images')
          .insert([
            {
              url: publicUrl,
              category: uploadCategory
            }
          ])
          .select()
          .single();

        if (imageError) {
          console.error('Database error:', imageError);
          toast.error("Failed to save image data");
          return;
        }

        const newImage: Image = {
          id: imageData.id,
          url: publicUrl,
          category: uploadCategory,
        };

        setImages(prev => [...prev, newImage]);
        toast.success(`Image added to ${uploadCategory} category!`);
      } catch (error) {
        console.error('General error:', error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    onImageClick();
  };

  const handleDeleteImage = async (id: string) => {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete image");
      return;
    }

    setImages(prev => prev.filter(img => img.id !== id));
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
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
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