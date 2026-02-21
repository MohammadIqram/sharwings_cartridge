'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart, Star, ChevronRight, Minus, Plus, Truck, Shield, RotateCcw
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { Product } from '@/common/types';
import { useNavigation } from '@/components/hooks/useNavigation';
import ProductCard from '@/components/common/product/ProductCard';
import { toast } from 'sonner';

export default function Pdp () {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState([]);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const pname = params?.name || '';

  const { navigate } = useNavigation();

  useEffect(() => {
    const getPdp = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${pname}`);
        const data = await response.json();
        if (data.success) {
          setProduct({
            ...data.product,
            slug: data.product.category || pname,
            brand: data.product.brand || data.product.name?.split(' ')[0],
            rating: data.product.rating || 4.2,
            reviews: data.product.reviews || 12,
          });
          setLoading(false);
          return;
        }
      } catch (error: any) {
        console.log('error when fetching products: ', error);
      } finally {
        setLoading(false);
      }
    }

    getPdp();
  }, [pname]);

  if (loading) return <div className="container mx-auto px-4 py-20"><div className="grid md:grid-cols-2 gap-10"><div className="aspect-square bg-muted animate-pulse rounded-2xl" /><div className="space-y-4"><div className="h-8 bg-muted animate-pulse rounded w-3/4" /><div className="h-4 bg-muted animate-pulse rounded w-1/2" /><div className="h-4 bg-muted animate-pulse rounded w-full" /></div></div></div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Product not found</h2><Button className="mt-4" onClick={() => navigate('/')}>Go Home</Button></div>;

  // If `price` is original and `salePrice` is discounted price
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  const onAddToCart = (p: Product) => {
    // quick demo feedback; integrate with store/cart later
    console.log('add to cart', (p as any)?.id || p);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  const addToCart = async () => {
    // add product to cart logic here
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id, quantity: qty }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to add product to cart');
        return;
      }

      toast.success("product added to cart successfully.");
    } catch (err: any) {
      console.error('Error adding product to cart:', err.message);
      toast.error("failed to add product to cart, ", err.message);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('/')} className="hover:text-foreground">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate(`/category/${product.slug}`)} className="hover:text-foreground">{product.category}</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 160 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <motion.img src={product.image} alt={product.name} className="w-full h-full object-fit" initial={{ scale: 1 }} whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }} />
            {discount > 0 && (
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white text-sm px-3 py-1">-{discount}% OFF</Badge>
              </motion.div>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{product.brand}</Badge>
              <Badge variant="outline" className="text-xs">{product.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />)}</div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold">${product.salePrice ?? product.price}</span>
              {product.salePrice && <span className="text-xl text-muted-foreground line-through">${product.price}</span>}
              {discount > 0 && <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Save ${product.price - (product.salePrice ?? product.price)}</Badge>}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            {/* {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f, i) => <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" />{f}</div>)}
                </div>
              </div>
            )} */}
            <Separator className="my-6" />
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></Button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(q => q + 1)}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.div animate={added ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 0.6 }} className="flex-1">
                <Button size="lg" className="w-full h-12 text-base" onClick={addToCart}><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</Button>
              </motion.div>
              <Button size="lg" variant="outline" className="h-12" onClick={() => { for(let i = 0; i < qty; i++) onAddToCart(product); navigate('/cart'); }}>Buy Now</Button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[{ icon: Truck, text: 'Free Delivery' }, { icon: RotateCcw, text: '30-Day Returns' }, { icon: Shield, text: 'Warranty' }].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 text-center">
                  <b.icon className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {related.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p: any) => <ProductCard key={p.id} product={p} onAddToCart={addToCart} navigate={navigate} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
