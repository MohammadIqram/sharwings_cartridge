'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  ShoppingCart, Search, Menu, Truck, Shield, Phone, Mail, X, RotateCcw,
} from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import { categories } from '@/common/data';
import { useUserStore } from '../../../stores/useUserStore';

export default function Navbar({ cartCount=0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {navigate} = useNavigation();
  const { user, logout } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="hidden md:block bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free shipping</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Secure payments</span>
            <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> 7-day returns</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />+91 780953951, +91 9682124722</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> sharwings@outlook.com</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-72 pt-12">
                <nav className="space-y-1">
                  <button onClick={() => { navigate('/'); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted text-left font-medium">Home</button>
                  <Separator className="my-2" />
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
                  {(categories || []).map(cat => (
                    <button key={cat.slug} onClick={() => { navigate(`/category/${cat.slug}`); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted text-left">{cat.name}</button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter cursor-pointer">SHARWINGS</button>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" className="text-sm font-medium cursor-pointer" onClick={() => navigate('/')}>Home</Button>
            {(categories || []).map(cat => (
              <Button key={cat.slug} variant="ghost" className="text-sm font-medium cursor-pointer" onClick={() => navigate(`/category/${cat.slug}`)}>{cat.name}</Button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}</Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</motion.span>}
            </Button>
            {/* <Button className="ml-2" onClick={() => navigate('/login')}>Login</Button> */}
            {
              !user ? (
                <button type="button" onClick={() => navigate('/login')} className="text-white bg-blue-600 box-border border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-xs font-medium leading-5 rounded-full text-sm px-6 py-2 focus:outline-none">Login</button>
              ) : (
                <div className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-medium cursor-pointer">
                    {user?.email?.split('@')[0][0].toUpperCase() || 'U'}
                  </div>
                  <div className={`cursor-pointer absolute right-0 mt-1 top-6 w-48 bg-white border rounded-md shadow-lg transition-opacity ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                    <div className="px-3 py-2 text-sm text-muted-foreground border-b">{user.email}</div>
                    <button onClick={() => { setMenuOpen(false); navigate('/dashboard'); }} className="cursor-pointer w-full text-left px-3 py-2 hover:bg-slate-50">Dashboard</button>
                    <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="cursor-pointer w-full text-left px-3 py-2 hover:bg-slate-50">Profile</button>
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="cursor-pointer w-full text-left px-3 py-2 text-red-600 hover:bg-slate-50">Logout</button>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pb-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}