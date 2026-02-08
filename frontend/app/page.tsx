'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Package, Truck, Shield,
  ArrowRight, RotateCcw, Sparkles
} from 'lucide-react';
import { categories, featured } from './common/data';
import { Category, Product } from './common/types';
import { useNavigation } from './components/hooks/useNavigation';
import ProductCard from './components/common/product/ProductCard';
import Image from 'next/image';

export default function HomePage() {
  const gradients : Record<string, string> = { 'electronics': 'from-blue-600 to-indigo-700', 'fashion': 'from-pink-500 to-rose-600', 'home-living': 'from-amber-500 to-orange-600', 'sports-fitness': 'from-green-500 to-emerald-600' };

  const { navigate } = useNavigation();

  const onAddToCart = (product: Product) => {
      // Implement add to cart functionality
  }

  // mock loaing state for featured products
  const loading = false;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
        </div>
          {/* Background image */}
            <Image
              src="/images/logo_shadow.jpeg"
              alt="Sharwings background logo"
              fill
              priority
              className="object-cover"
            />

          {/* Optional dark overlay */}
          <div className="absolute inset-0 bg-black/30" />

        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 px-4 py-1.5"><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Summer Collection 2025</Badge>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Home</span></h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed">Smart & Premium electrical solutions that power your space—engineered for safety, efficiency, and long-term reliability.</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 px-8 h-12 text-base font-semibold" onClick={() => navigate('/category')}>Shop Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
              {/* <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 h-12 text-base" onClick={() => navigate('/category/fashion')}>Explore Fashion</Button> */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
            {[{ icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' }, { icon: Shield, title: 'Secure Payment', desc: '100% protected' }, { icon: RotateCcw, title: 'Easy Returns', desc: '30-day guarantee' }, { icon: Package, title: 'Fast Delivery', desc: '2-5 business days' }].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 py-5 px-4">
                <b.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div><p className="text-sm font-semibold">{b.title}</p><p className="text-xs text-muted-foreground">{b.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</motion.h2>
            <p className="text-muted-foreground">Find exactly what you are looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(categories || [] as Category[]).map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} className="cursor-pointer" onClick={() => navigate(`/category/${cat.slug}`)}>
                <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradients[cat.slug] || 'from-gray-500 to-gray-700'} aspect-[4/5] flex flex-col justify-end text-white shadow-lg hover:shadow-2xl transition-shadow`}>
                          {/* Image (Top 50%) */}
        <div className="relative h-1/2 w-full">
          {cat.image ? (
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${
                gradients[cat.slug] || "from-gray-500 to-gray-700"
              }`}
            />
          )}
        </div>
          {/* Content Footer (Bottom 50%) */}
          <div className="h-1/2 p-5 flex flex-col justify-between bg-gradient-to-t from-black/30 to-black/20 text-white">
            <div>
              <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
              <p className="text-sm text-white/70">
                Explore products
              </p>
            </div>

            <span className="text-sm font-medium flex items-center gap-1 text-white/90">
              Shop now <ChevronRight className="w-4 h-4" />
            </span>
          </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-2">Featured Products</motion.h2>
              <p className="text-muted-foreground">Handpicked favorites just for you</p>
            </div>
            <Button variant="outline" className="hidden md:flex" onClick={() => navigate('/category/all')}>View All <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} navigate={navigate} />)}
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/category/all')}>View All Products <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 md:p-16">
            <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]" /></div>
            <div className="relative z-10 max-w-lg">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">Limited Time Offer</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Up to 80% Off</h2>
              <p className="text-lg text-white/70 mb-8">Don't miss out on our biggest sale of the season. Premium products at unbeatable prices.</p>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 font-semibold" onClick={() => navigate('/category/all')}>Shop the Sale <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
