import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Shield, Activity, Heart, Brain, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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

// Canvas component for interactive molecule/neuron particle network
function MolecularCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const particleCount = 45;
    const colors = ['rgba(168, 85, 247, 0.35)', 'rgba(236, 72, 153, 0.35)', 'rgba(59, 130, 246, 0.35)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 3.5 + 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections (molecular/neuron synapse lines)
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Subtly attract to mouse
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 220) {
          p1.x += (dxMouse / distMouse) * 0.15;
          p1.y += (dyMouse / distMouse) * 0.15;
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'login'>('intro');
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
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize and render Google Sign-In button when the login screen mounts
  useEffect(() => {
    if (currentScreen === 'login' && googleLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });

      if (GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
        setTimeout(() => {
          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            window.google.accounts.id.renderButton(buttonElement, {
              theme: 'outline',
              size: 'large',
              width: buttonElement.clientWidth || 380,
              text: 'signin_with',
              shape: 'rectangular',
            });
          }
        }, 100);
      }
    }
  }, [currentScreen, googleLoaded]);

  const handleGoogleCallback = (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      onLogin(payload.email, payload.name, payload.picture);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
      window.google.accounts.id.prompt();
    } else {
      alert('⚠️ Google Sign-In Not Configured\n\nTo use real Google Sign-In:\n\n1. Create OAuth credentials at:\nhttps://console.cloud.google.com/\n\n2. Copy .env.example to .env\n\n3. Add your Client ID to .env:\nVITE_GOOGLE_CLIENT_ID=your_id_here\n\n4. Restart the dev server\n\nSee QUICK_START.md for detailed instructions!\n\nFor now, use email/password login with any credentials.');
    }
  };

  const cleanNameFromEmail = (email: string): string => {
    const prefix = email.split('@')[0];
    let cleaned = prefix.replace(/\d+/g, '');
    
    if (cleaned.toLowerCase().startsWith('mm')) {
      cleaned = 'M. ' + cleaned.slice(2);
    }
    
    return cleaned
      .split(/[._-]/)
      .map(word => {
        const spaced = word.replace(/([a-z])([A-Z])/g, '$1 $2');
        return spaced
          .split(' ')
          .map(w => {
            if (w.toLowerCase() === 'rakeshkumar') {
              return 'Rakesh Kumar';
            }
            return w.charAt(0).toUpperCase() + w.slice(1);
          })
          .join(' ');
      })
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const name = cleanNameFromEmail(email);
      onLogin(email, name);
    }, 1200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Background canvas and blur orbs */}
      <MolecularCanvas />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-15"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-15"
          animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header / Brand */}
      <header className="relative z-10 w-full px-8 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentScreen('intro')}>
          <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
            <img src="/favicon.svg" alt="MonitorHub Logo" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-wide font-display">MonitorHub</h1>
            <p className="text-[10px] text-purple-300/70 font-sans tracking-widest uppercase">Prevention Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentScreen === 'intro' ? (
            /* INTRO SCREEN - High-End Minimalist Landing */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column: Hero & Narrative */}
              <div className="lg:col-span-7 text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium tracking-wide">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  Building Healthy, Safe & Clean Communities
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] font-display">
                  Substance Prevention & <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Wellness Monitor</span>
                </h1>

                <p className="text-lg lg:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  An advanced, secure monitoring framework designed for institutions to foster drug-free environments. Track compliance scores, coordinate real-time anonymous alerts, and trace wellness analytics seamlessly.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setCurrentScreen('login')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-purple-500/20 border-0 text-base"
                    >
                      Access Prevention Portal
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Key Interactive Cards (follow.art style) */}
              <div className="lg:col-span-5 space-y-4">
                {[
                  {
                    icon: Brain,
                    title: 'Interactive Wellness Grid',
                    desc: 'Track collective chemical compliance indices and mental wellness health signals in real-time.',
                    color: 'from-purple-500/20 to-indigo-500/20',
                    iconColor: 'text-purple-400',
                  },
                  {
                    icon: Shield,
                    title: 'Secure Anonymous Reporting',
                    desc: 'Encrypted channels for reporting suspicious activities, protected with end-to-end security layers.',
                    color: 'from-pink-500/20 to-purple-500/20',
                    iconColor: 'text-pink-400',
                  },
                  {
                    icon: Activity,
                    title: 'Substance Risk Scoring',
                    desc: 'Advanced threat profiling and risk-scoring metrics mapped by zone for proactive counseling.',
                    color: 'from-blue-500/20 to-purple-500/20',
                    iconColor: 'text-blue-400',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="group relative p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden cursor-default"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
                    whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  >
                    {/* Glowing background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
                    
                    <div className="flex items-start gap-5 relative z-10">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-white font-display">{item.title}</h3>
                        <p className="text-sm text-slate-400 font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* LOGIN SCREEN - Centered Glassmorphic Card */
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md relative"
            >
              {/* Back to Home Button */}
              <button
                onClick={() => setCurrentScreen('intro')}
                className="absolute -top-12 left-0 flex items-center gap-2 text-sm text-purple-300/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to overview
              </button>

              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-block p-3.5 bg-purple-500/15 rounded-2xl mb-4 border border-purple-500/10">
                      <Lock className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-display">Portal Login</h2>
                    <p className="text-sm text-slate-400 font-light">Sign in to access secure dashboard data</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Username or Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/70" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@monitorhub.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/10 rounded-xl h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Security Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/70" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/10 rounded-xl h-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300/70 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          className="border-white/10 data-[state=checked]:bg-purple-500"
                        />
                        <Label htmlFor="remember" className="text-xs text-slate-300 cursor-pointer">
                          Keep me signed in
                        </Label>
                      </div>
                      <a href="#" className="text-xs text-purple-300/80 hover:text-white transition-colors">
                        Forgot key?
                      </a>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/20 h-11 rounded-xl font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </div>
                        ) : (
                          'Sign In to Dashboard'
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  <div className="my-5 flex items-center gap-3">
                    <Separator className="flex-1 bg-white/10" />
                    <span className="text-xs text-slate-500">or secure client key</span>
                    <Separator className="flex-1 bg-white/10" />
                  </div>

                  {/* Google OAuth Button Container */}
                  {googleLoaded && window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' ? (
                    <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
                      <div id="google-signin-button" className="w-full flex justify-center"></div>
                      <span className="text-[10px] text-slate-500 mt-2">Secured by Google Identity Services</span>
                    </div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-slate-50 text-slate-900 border-0 shadow-md h-11 rounded-xl font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                      Require security access?{' '}
                      <a href="#" className="text-purple-400 hover:text-white font-medium">
                        Contact Administrator
                      </a>
                    </p>
                  </div>
                </div>

                {/* Bottom accent glow bar */}
                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-8 py-6 max-w-7xl mx-auto border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 MonitorHub. Secure Wellness and Drug Prevention Analytics Framework.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300">Security Protocol</a>
          <a href="#" className="hover:text-slate-300">System Logs</a>
          <a href="#" className="hover:text-slate-300">Help Desk</a>
        </div>
      </footer>
    </div>
  );
}