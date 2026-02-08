'use client';

import { Separator } from '@/components/ui/separator';
import {
MapPin, Phone, Mail,
  Clock
} from 'lucide-react';
import { useNavigation } from '@/components/hooks/useNavigation';


export default function Footer() {

  const { navigate } = useNavigation();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black tracking-tighter mb-4">SHARWINGS</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Discover premium products curated for the modern lifestyle. Quality meets design at LUXE.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => navigate('/category/electronics')} className="hover:text-white transition-colors">Electronics</button></li>
              <li><button onClick={() => navigate('/category/fashion')} className="hover:text-white transition-colors">Fashion</button></li>
              <li><button onClick={() => navigate('/category/home-living')} className="hover:text-white transition-colors">Home & Living</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Shipping Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Returns & Exchanges</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lalbazar, Srinagar, Jammu & Kashmir Pincode: 190023</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 780953951, +91 9682124722</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> sharwings@outlook.com</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Mon - Fri: 9:00 AM - 6:00 PM IST, Sat: 10:00 AM - 2:00 PM IST</li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-slate-800" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2026 Sharwings. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}