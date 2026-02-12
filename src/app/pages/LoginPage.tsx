import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Shield, Activity, Server, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';

interface LoginPageProps {
  onLogin: (email: string, name: string, avatar?: string) => void;
}

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

declare global {
  interface Window {
    google: any;
  }
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      initializeGoogleSignIn();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
    }
  };

  const handleGoogleCallback = (response: any) => {
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));

      onLogin(
        payload.email,
        payload.name,
        payload.picture
      );
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
      // Use the One Tap prompt for real Google login
      window.google.accounts.id.prompt();
    } else {
      alert('⚠️ Google Sign-In Not Configured\n\nTo use real Google Sign-In:\n\n1. Create OAuth credentials at:\nhttps://console.cloud.google.com/\n\n2. Copy .env.example to .env\n\n3. Add your Client ID to .env:\nVITE_GOOGLE_CLIENT_ID=your_id_here\n\n4. Restart the dev server\n\nSee QUICK_START.md for detailed instructions!\n\nFor now, use email/password login with any credentials.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      // Extract name from email (before @) and capitalize it
      const namePart = email.split('@')[0];
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._-]/g, ' ');
      onLogin(email, name);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-lg">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <img src="/favicon.svg" alt="MonitorHub Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="font-bold text-3xl">MonitorHub<span className="text-purple-400">.</span></h1>
                <p className="text-purple-200 text-sm">Enterprise Monitoring Platform</p>
              </div>
            </motion.div>

            <motion.h2
              className="text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Real-time Infrastructure Monitoring
            </motion.h2>

            <motion.p
              className="text-xl text-purple-100 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Monitor your entire infrastructure with powerful analytics, real-time alerts, and comprehensive insights.
            </motion.p>

            {/* Feature cards */}
            <div className="space-y-4">
              {[
                { icon: Activity, title: 'Real-time Monitoring', desc: 'Track system health 24/7' },
                { icon: Server, title: 'Multi-zone Support', desc: 'Monitor across all data centers' },
                { icon: Shield, title: 'Advanced Security', desc: 'Enterprise-grade protection' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <feature.icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-purple-200">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glassmorphism card */}
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
              whileHover={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-block p-3 bg-purple-500/20 rounded-xl mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Lock className="w-8 h-8 text-purple-300" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-purple-200">Sign in to your monitoring dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@monitub.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 bg-white/10 border-white/20 text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-white/20 data-[state=checked]:bg-purple-500"
                      />
                      <Label htmlFor="remember" className="text-sm text-purple-200 cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Signing in...
                        </motion.div>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <Separator className="flex-1 bg-white/20" />
                  <span className="text-sm text-purple-200">or</span>
                  <Separator className="flex-1 bg-white/20" />
                </div>

                {/* Google Sign-in - Real OAuth */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || !googleLoaded}
                    className="w-full bg-white hover:bg-gray-100 text-slate-900 border-0 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </motion.div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-purple-200">
                    Don't have an account?{' '}
                    <a href="#" className="text-purple-300 hover:text-purple-200 font-semibold">
                      Request Access
                    </a>
                  </p>
                </div>
              </div>

              {/* Bottom gradient bar */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
            </motion.div>

            <motion.p
              className="mt-6 text-center text-sm text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Secured by enterprise-grade encryption
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}