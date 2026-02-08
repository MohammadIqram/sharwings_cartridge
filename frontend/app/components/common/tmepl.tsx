'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ShoppingCart, Search, Menu, Star, Heart, ChevronRight, Minus, Plus,
  Trash2, ArrowLeft, Package, Truck, Shield, MapPin, Phone, Mail,
  ArrowRight, CheckCircle, X, SlidersHorizontal, RotateCcw, CreditCard,
  Clock, Sparkles, Eye
} from 'lucide-react';

// ==================== CATEGORY PAGE ====================
function CategoryPage({ slug, products, categories, onNavigate, onAddToCart, searchQuery }) {
  const [sortBy, setSortBy] = useState('default');
  const category = categories.find(c => c.slug === slug);
  const isSearch = !!searchQuery;
  const isAll = slug === 'all';

  let filtered = isSearch ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : isAll ? products : products.filter(p => p.categorySlug === slug);
  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const title = isSearch ? `Search: "${searchQuery}"` : isAll ? 'All Products' : category?.name || 'Products';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => onNavigate('/')} className="hover:text-foreground">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]"><SlidersHorizontal className="w-4 h-4 mr-2" /><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or browse our categories.</p>
            <Button onClick={() => onNavigate('/')}>Back to Home</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== PRODUCT DETAIL PAGE ====================
function ProductDetailPage({ productId, products, onNavigate, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product);
        setRelated(data.related || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) return <div className="container mx-auto px-4 py-20"><div className="grid md:grid-cols-2 gap-10"><div className="aspect-square bg-muted animate-pulse rounded-2xl" /><div className="space-y-4"><div className="h-8 bg-muted animate-pulse rounded w-3/4" /><div className="h-4 bg-muted animate-pulse rounded w-1/2" /><div className="h-4 bg-muted animate-pulse rounded w-full" /></div></div></div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Product not found</h2><Button className="mt-4" onClick={() => onNavigate('/')}>Go Home</Button></div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => onNavigate('/')} className="hover:text-foreground">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => onNavigate(`/category/${product.categorySlug}`)} className="hover:text-foreground">{product.categoryName}</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {discount > 0 && <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">-{discount}% OFF</Badge>}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{product.brand}</Badge>
              <Badge variant="outline" className="text-xs">{product.categoryName}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />)}</div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold">${product.price}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>}
              {discount > 0 && <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Save ${product.originalPrice - product.price}</Badge>}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f, i) => <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" />{f}</div>)}
                </div>
              </div>
            )}
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
              <Button size="lg" className="flex-1 h-12 text-base" onClick={() => { for(let i = 0; i < qty; i++) onAddToCart(product); }}><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</Button>
              <Button size="lg" variant="outline" className="h-12" onClick={() => { for(let i = 0; i < qty; i++) onAddToCart(product); onNavigate('/cart'); }}>Buy Now</Button>
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
              {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== CART PAGE ====================
function CartPage({ cart, updateQuantity, removeFromCart, cartTotal, onNavigate }) {
  if (cart.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground/20 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Button size="lg" onClick={() => onNavigate('/')}>Continue Shopping <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const shipping = cartTotal >= 50 ? 0 : 9.99;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => onNavigate('/')} className="hover:text-foreground">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Shopping Cart</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted shrink-0 cursor-pointer" onClick={() => onNavigate(`/product/${item.id}`)}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold cursor-pointer hover:underline" onClick={() => onNavigate(`/product/${item.id}`)}>{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.brand}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 shrink-0" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-lg">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3" /></Button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></Button>
                            </div>
                            <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                  {shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders over $50</p>}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${(cartTotal + shipping).toFixed(2)}</span></div>
                </div>
                <Button className="w-full mt-6 h-12 text-base" onClick={() => onNavigate('/checkout')}>Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" /></Button>
                <Button variant="ghost" className="w-full mt-2" onClick={() => onNavigate('/')}><ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== CHECKOUT PAGE ====================
function CheckoutPage({ cart, cartTotal, clearCart, onNavigate, onOrderPlaced }) {
  const [address, setAddress] = useState({ fullName: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pinCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const total = cartTotal + shipping;

  const validate = () => {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = 'Required';
    if (!address.phone.trim()) errs.phone = 'Required';
    if (!address.email.trim()) errs.email = 'Required';
    if (!address.line1.trim()) errs.line1 = 'Required';
    if (!address.city.trim()) errs.city = 'Required';
    if (!address.state.trim()) errs.state = 'Required';
    if (!address.pinCode.trim()) errs.pinCode = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) { toast.error('Please fill all required fields'); return; }
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })), address, paymentMethod, subtotal: cartTotal, shipping, total }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        onOrderPlaced(data.order);
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setPlacing(false);
    }
  };

  const InputField = ({ label, field, type, required, placeholder, fullWidth }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <Label className="text-sm font-medium">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</Label>
      <Input type={type || 'text'} placeholder={placeholder} value={address[field]} onChange={(e) => setAddress(prev => ({ ...prev, [field]: e.target.value }))} className={`mt-1.5 ${errors[field] ? 'border-red-500' : ''}`} />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  if (cart.length === 0) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center container mx-auto px-4"><h2 className="text-2xl font-bold mb-4">Your cart is empty</h2><Button onClick={() => onNavigate('/')}>Continue Shopping</Button></motion.div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => onNavigate('/')} className="hover:text-foreground">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => onNavigate('/cart')} className="hover:text-foreground">Cart</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5" /> Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Full Name" field="fullName" required placeholder="John Doe" />
                  <InputField label="Phone Number" field="phone" required type="tel" placeholder="+1 234 567 8900" />
                  <InputField label="Email" field="email" required type="email" placeholder="john@example.com" fullWidth />
                  <InputField label="Address Line 1" field="line1" required placeholder="Street address" fullWidth />
                  <InputField label="Address Line 2" field="line2" placeholder="Apartment, suite, etc. (optional)" fullWidth />
                  <InputField label="City" field="city" required placeholder="New York" />
                  <InputField label="State" field="state" required placeholder="NY" />
                  <InputField label="PIN Code" field="pinCode" required placeholder="10001" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Cash on Delivery (COD)</p>
                          <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                        </div>
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg pt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
                <Button className="w-full mt-6 h-12 text-base" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Placing Order...' : 'Place Order'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">By placing your order, you agree to our Terms & Conditions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== ORDER CONFIRMATION ====================
function OrderConfirmation({ order, onNavigate }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
          <Card>
            <CardContent className="p-6 text-left space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-medium">{order?.id?.slice(0, 8)}...</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payment</span><span className="font-medium">Cash on Delivery</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-bold">${order?.total?.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge></div>
              <Separator />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estimated Delivery</span><span className="font-medium">3-5 Business Days</span></div>
            </CardContent>
          </Card>
          <Button size="lg" className="mt-8" onClick={() => onNavigate('/')}>Continue Shopping <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [page, setPage] = useState({ name: 'home', params: {} });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('luxe_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  // Hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1) || '/';
      const parts = hash.split('/').filter(Boolean);
      if (parts.length === 0) setPage({ name: 'home', params: {} });
      else if (parts[0] === 'category' && parts[1]) setPage({ name: 'category', params: { slug: decodeURIComponent(parts[1]) } });
      else if (parts[0] === 'product' && parts[1]) setPage({ name: 'product', params: { id: parts[1] } });
      else if (parts[0] === 'cart') setPage({ name: 'cart', params: {} });
      else if (parts[0] === 'checkout') setPage({ name: 'checkout', params: {} });
      else if (parts[0] === 'order-confirmation') setPage({ name: 'order-confirmation', params: {} });
      else if (parts[0] === 'search' && parts[1]) setPage({ name: 'search', params: { query: decodeURIComponent(parts[1]) } });
      else setPage({ name: 'home', params: {} });
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      } catch (e) { console.error('Fetch error:', e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const handleNavigate = useCallback((hash) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, brand: product.brand, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === productId) {
        const newQty = i.quantity + delta;
        return newQty <= 0 ? null : { ...i, quantity: newQty };
      }
      return i;
    }).filter(Boolean));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
    toast.success('Item removed from cart');
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const handleOrderPlaced = useCallback((order) => {
    setOrderConfirmation(order);
    handleNavigate('/order-confirmation');
  }, [handleNavigate]);

  const renderPage = () => {
    switch (page.name) {
      case 'home':
        return <HomePage products={products} categories={categories} onNavigate={handleNavigate} onAddToCart={addToCart} loading={loading} />;
      case 'category':
        return <CategoryPage slug={page.params.slug} products={products} categories={categories} onNavigate={handleNavigate} onAddToCart={addToCart} />;
      case 'search':
        return <CategoryPage slug="all" products={products} categories={categories} onNavigate={handleNavigate} onAddToCart={addToCart} searchQuery={page.params.query} />;
      case 'product':
        return <ProductDetailPage productId={page.params.id} products={products} onNavigate={handleNavigate} onAddToCart={addToCart} />;
      case 'cart':
        return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} cartTotal={cartTotal} onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage cart={cart} cartTotal={cartTotal} clearCart={clearCart} onNavigate={handleNavigate} onOrderPlaced={handleOrderPlaced} />;
      case 'order-confirmation':
        return <OrderConfirmation order={orderConfirmation} onNavigate={handleNavigate} />;
      default:
        return <HomePage products={products} categories={categories} onNavigate={handleNavigate} onAddToCart={addToCart} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} onNavigate={handleNavigate} categories={categories} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={page.name + JSON.stringify(page.params)}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
