'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

import {
  ShoppingCart, ChevronRight, Minus, Plus,
  Trash2, ArrowLeft,
  ArrowRight, Package, Truck, Pencil, X,
  MapPin, DollarSign
} from 'lucide-react';
import { useNavigation } from '@/components/hooks/useNavigation';

const cart = [
  {
    id: "geyser-001",
    name: "Instant Water Geyser 3L",
    brand: "AquaHeat",
    price: 89.99,
    quantity: 1,
    image: "/images/geazer.jpeg",
  },
  {
    id: "bulb-002",
    name: "LED AC Bulb 12W",
    brand: "BrightLux",
    price: 6.5,
    quantity: 4,
    image: "/images/bulbs.jpeg",
  },
  {
    id: "switch-003",
    name: "Modular Switch Board (6+1)",
    brand: "VoltSafe",
    price: 24.99,
    quantity: 2,
    image: "/images/switches.jpeg",
  },
];


export default function CartPage () {
  const { navigate } = useNavigation();
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleAddressSubmit = () => {
    if (addressForm.fullName && addressForm.phone && addressForm.street && addressForm.city && addressForm.state && addressForm.zipCode) {
      setAddress(addressForm);
      setShowAddressModal(false);
      setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  if (cart.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-20 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <ShoppingCart className="w-20 h-20 mx-auto text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Button size="lg" onClick={() => navigate('/')}>Continue Shopping <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = cartTotal > 50 ? 0 : 10;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-8 md:py-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Shopping Cart</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Package className="w-4 h-4" />
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address, COD, Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white rounded-lg shadow-md ring-1 ring-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Delivery Address
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddressModal(true)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {address ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg"
                    >
                      <p className="font-semibold">{address.fullName}</p>
                      <p className="text-muted-foreground">{address.street}</p>
                      <p className="text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
                      <p className="text-muted-foreground">Phone: {address.phone}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border-2 border-red-200"
                    >
                      <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-sm text-red-700 font-medium">Please add address to checkout</span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Cash On Delivery Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className={`bg-white rounded-lg shadow-md transition-shadow cursor-pointer ${paymentMethod === 'cod' ? 'shadow-lg ring-1 ring-blue-200' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-100' : 'border-muted-foreground'}`}>
                      {paymentMethod === 'cod' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2.5 h-2.5 bg-blue-600 rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Cash On Delivery
                      </h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground"
                      >
                        Pay when you receive your order. Safe, secure, and convenient payment method available at your doorstep.
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 ring-1 ring-blue-200">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                              className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-muted shrink-0 cursor-pointer shadow-md"
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              <img src={item.image} alt={item.name} className="w-full h-full object-fit" />
                            </motion.div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-bold text-base cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/product/${item.id}`)}>
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.1, color: '#ef4444' }}
                                  whileTap={{ scale: 0.95 }}
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-muted-foreground hover:text-red-500 shrink-0 transition-colors"
                                  onClick={() => {}}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                {/* Quantity Controls */}
                                <motion.div 
                                  className="flex items-center border border-muted-foreground/30 rounded-full"
                                  whileHover={{ borderColor: '#3b82f6' }}
                                >
                                  <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 hover:bg-muted rounded-full transition-colors flex justify-center items-center"
                                    onClick={() => {}}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </motion.button>
                                  <motion.span
                                    key={item.quantity}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-8 text-center text-sm font-bold"
                                  >
                                    {item.quantity}
                                  </motion.span>
                                  <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 hover:bg-muted rounded-full transition-colors"
                                    onClick={() => {}}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </motion.button>
                                </motion.div>

                                {/* Price */}
                                <motion.div
                                  key={item.quantity}
                                  initial={{ scale: 1.1, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="font-bold text-lg text-blue-600"
                                >
                                  ${(item.price * item.quantity).toFixed(2)}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <Card className="sticky top-24 bg-white rounded-lg shadow-lg ring-1 ring-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6">Order Summary</h3>

                  <motion.div 
                    className="space-y-4 text-sm"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Subtotal */}
                    <motion.div variants={itemVariants} className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <motion.span
                        key={cartTotal}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="font-semibold"
                      >
                        ${cartTotal.toFixed(2)}
                      </motion.span>
                    </motion.div>

                    {/* Shipping */}
                    <motion.div variants={itemVariants} className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Shipping
                      </span>
                      <motion.span
                        key={shipping}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={shipping === 0 ? "text-green-600 font-bold" : "font-semibold"}
                      >
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </motion.span>
                    </motion.div>

                    {shipping > 0 && (
                      <motion.p 
                        variants={itemVariants}
                        className="text-xs text-muted-foreground italic bg-blue-50 p-2 rounded"
                      >
                        💡 Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                      </motion.p>
                    )}

                    <Separator className="my-2" />

                    {/* Total */}
                    <motion.div variants={itemVariants} className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <motion.span
                        key={cartTotal + shipping}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-blue-600 text-xl"
                      >
                        ${(cartTotal + shipping).toFixed(2)}
                      </motion.span>
                    </motion.div>
                  </motion.div>

                  {/* Checkout Button */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-6 space-y-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white" 
                        onClick={() => navigate('/checkout')}
                      >
                        Proceed to Checkout 
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-2" 
                        onClick={() => navigate('/')}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Security Badge */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-4 text-xs text-muted-foreground text-center"
                  >
                    🔒 Secure checkout
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Address Modal */}
        <AnimatePresence>
          {showAddressModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddressModal(false)}
                className="absolute inset-0 bg-black/50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b-2 border-muted p-6 flex items-center justify-between">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Add Address
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddressModal(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={addressForm.fullName}
                      onChange={handleAddressChange}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="text-sm font-medium mb-1 block">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm font-medium mb-1 block">Street Address</label>
                    <Input
                      type="text"
                      name="street"
                      placeholder="123 Main Street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="text-sm font-medium mb-1 block">City</label>
                      <Input
                        type="text"
                        name="city"
                        placeholder="New York"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="text-sm font-medium mb-1 block">State</label>
                      <Input
                        type="text"
                        name="state"
                        placeholder="NY"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="text-sm font-medium mb-1 block">ZIP Code</label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="10001"
                      value={addressForm.zipCode}
                      onChange={handleAddressChange}
                    />
                  </motion.div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t-2 border-muted p-6 flex gap-3">
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-2"
                      onClick={() => setShowAddressModal(false)}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddressSubmit}
                    >
                      Save Address
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}