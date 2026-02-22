'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart, Star, Heart
} from 'lucide-react';
import { Product } from '@/common/types';

export default function ProductCard ({ product, onAddToCart, navigate } : { product: Product, onAddToCart: (product: Product) => void, navigate: (path: string) => void }) {
  const discount = product.salePrice ? Math.round((1 - product.price / product.salePrice) * 100) : 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group cursor-pointer">
      <Card className="overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300" onClick={() => navigate(`/product/${product.name}`)}>
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs">-{discount}%</Badge>}
            {(product.tags || []).includes('new') && <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-xs">New</Badge>}
            {(product.tags || []).includes('bestseller') && <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs">Best Seller</Badge>}
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" onClick={(e) => e.stopPropagation()}>
            <Heart className="w-4 h-4" />
          </motion.button>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{product.brand}</p>
          <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />)}
            <span className="text-xs text-muted-foreground ml-1">{product.reviews} / 5.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg flex items-center">₹{product.salePrice}</span>
            {product.salePrice && <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>}
          </div>
          <div className="mt-4">
            <Button variant={"default"} className="w-full cursor-pointer" size="lg" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}