'use client';

import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { categories } from '@/common/data';
import { useNavigation } from '@/components/hooks/useNavigation';

export default function CategoryPage() {
  const { navigate } = useNavigation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Categories</span>
        </div>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop by Category</h1>
          <p className="text-muted-foreground">{categories.length} categories available</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => navigate(`/category/${category.slug}`)}
              className="cursor-pointer group"
            >
              <div className="relative h-64 md:h-72 rounded-lg overflow-hidden bg-muted">
                {/* Category Image */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${category.image || '/images/placeholder.jpg'}')`,
                  }}
                  whileHover={{ scale: 1.1 }}
                />
                
                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"
                  initial={{ opacity: 0.4 }}
                  whileHover={{ opacity: 0.5 }}
                />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-white/80">{category.description}</p>
                    )}
                    <motion.div
                      className="mt-4 inline-block text-sm font-semibold"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      Shop Now →
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}