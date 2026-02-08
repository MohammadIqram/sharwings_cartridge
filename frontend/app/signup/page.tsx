'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { useNavigation } from '@/components/hooks/useNavigation';
import { Spinner } from '@/components/ui/spinner';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const { navigate } = useNavigation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordMatch(
        name === 'confirmPassword'
          ? value === formData.password
          : value === formData.confirmPassword
      );
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordMatch) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-8 md:py-12 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Sign Up</span>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 border border-muted rounded-lg shadow-lg p-8 bg-background"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join Sharwings and start shopping today</p>
            </motion.div>

            {/* Signup Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={!passwordMatch && formData.confirmPassword ? 'border-red-500' : ''}
                />
                {!passwordMatch && formData.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    Passwords do not match
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="pt-2"
              >
                <Button variant="default" size="lg" className="w-full" disabled={isLoading} type="submit">
                  {isLoading && <Spinner data-icon="inline-start" />}
                  create your account
                </Button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">or</span>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-semibold text-foreground hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </motion.div>

            {/* Terms */}
            <motion.div
              variants={itemVariants}
              className="text-center text-xs text-muted-foreground"
            >
              <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
