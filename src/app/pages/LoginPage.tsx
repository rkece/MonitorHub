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

// Canvas component for interactive 3D synapse sphere with electric/thunder energy
function ThreeDSynapseSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, targetX: 0, targetY: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 450);
    let height = (canvas.height = 450);

    const updateSize = () => {
      if (containerRef.current && canvas) {
        width = canvas.width = containerRef.current.clientWidth;
        height = canvas.height = containerRef.current.clientHeight;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    interface Node3D {
      x: number;
      y: number;
      z: number;
      projX: number;
      projY: number;
      projSize: number;
      baseSize: number;
      color: string;
      name?: string;
      pulse: number;
      rotatedZ: number;
    }

    const nodes: Node3D[] = [];
    const nodeCount = 55;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const names = [
      'D2 Receptor', '5-HT1A', 'Synapse Core', 'GABA-A', 'Dopamine Link',
      'Wellness Node', 'Active Protection', 'Serotonin Ref', 'Receptor A1',
      'Neural Shield', 'Cognitive Lock', 'Synaptic Guard'
    ];

    for (let i = 0; i < nodeCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const radius = 135;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      nodes.push({
        x,
        y,
        z,
        projX: 0,
        projY: 0,
        projSize: 0,
        baseSize: Math.random() * 3.5 + 2.5,
        color: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#3b82f6' : '#ec4899', // purple, blue, pink
        name: i < names.length ? names[i] : undefined,
        pulse: Math.random() * Math.PI,
        rotatedZ: 0
      });
    }

    interface Particle3D {
      angle: number;
      speed: number;
      radius: number;
      yOffset: number;
      size: number;
      color: string;
    }
    const orbitParticles: Particle3D[] = [];
    for (let i = 0; i < 12; i++) {
      orbitParticles.push({
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.012 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
        radius: 160 + Math.random() * 40,
        yOffset: (Math.random() - 0.5) * 100,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#67e8f9' : '#c084fc'
      });
    }

    let angX = 0;
    let angY = 0;
    let targetVelX = 0.003;
    let targetVelY = 0.005;
    let velX = 0.003;
    let velY = 0.005;
    const focalLength = 300;

    const drawLightning = (
      ctx: CanvasRenderingContext2D,
      x1: number, y1: number,
      x2: number, y2: number,
      displace: number
    ) => {
      let currX = x1;
      let currY = y1;
      const segments = 6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const targetX = x1 + (x2 - x1) * t;
        const targetY = y1 + (y2 - y1) * t;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / (len || 1);
        const ny = dx / (len || 1);

        const factor = Math.sin(t * Math.PI);
        const offset = (Math.random() - 0.5) * displace * factor;

        currX = targetX + nx * offset;
        currY = targetY + ny * offset;
        ctx.lineTo(currX, currY);
      }
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current.targetX = (e.clientX - cx) / (rect.width / 2);
      mouseRef.current.targetY = (e.clientY - cy) / (rect.height / 2);
      
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      mouseRef.current.isHovered = Math.sqrt(dx * dx + dy * dy) < 220;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isHovered = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      const isHovered = mouseRef.current.isHovered;
      if (isHovered) {
        targetVelX = mouseRef.current.targetY * 0.025;
        targetVelY = mouseRef.current.targetX * 0.025;
      } else {
        targetVelX = 0.003;
        targetVelY = 0.005;
      }

      velX += (targetVelX - velX) * 0.08;
      velY += (targetVelY - velY) * 0.08;

      angX += velX;
      angY += velY;

      const cosX = Math.cos(angX);
      const sinX = Math.sin(angX);
      const cosY = Math.cos(angY);
      const sinY = Math.sin(angY);

      nodes.forEach(node => {
        node.pulse += 0.03;

        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        const scale = focalLength / (focalLength + z2);
        node.projX = cx + x1 * scale;
        node.projY = cy + y2 * scale;
        node.projSize = Math.max(0.5, node.baseSize * scale * (1 + 0.15 * Math.sin(node.pulse)));
        node.rotatedZ = z2;
      });

      const maxDistance = 140;
      for (let i = 0; i < nodeCount; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dz = n1.z - n2.z;
          const dist3d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3d < maxDistance) {
            const avgZ = (n1.rotatedZ + n2.rotatedZ) / 2;
            const opacity = (1 - dist3d / maxDistance) * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(n1.projX, n1.projY);
            ctx.lineTo(n2.projX, n2.projY);

            const grad = ctx.createLinearGradient(n1.projX, n1.projY, n2.projX, n2.projY);
            grad.addColorStop(0, n1.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            grad.addColorStop(1, n2.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5 + 0.5 * (focalLength / (focalLength + avgZ));
            ctx.stroke();
          }
        }
      }

      if (isHovered && Math.random() < 0.45) {
        const originIdx = Math.floor(Math.random() * nodeCount);
        const targetIdx = Math.floor(Math.random() * nodeCount);
        
        if (originIdx !== targetIdx) {
          const n1 = nodes[originIdx];
          const n2 = nodes[targetIdx];
          
          ctx.strokeStyle = Math.random() > 0.4 ? '#3b82f6' : '#a855f7';
          ctx.lineWidth = Math.random() * 1.5 + 0.8;
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 10;
          drawLightning(ctx, n1.projX, n1.projY, n2.projX, n2.projY, 12);
          
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.4;
          ctx.shadowBlur = 3;
          drawLightning(ctx, n1.projX, n1.projY, n2.projX, n2.projY, 8);
          
          ctx.shadowBlur = 0;
        }
      }

      orbitParticles.forEach(p => {
        p.angle += p.speed;
        
        const x = p.radius * Math.cos(p.angle);
        const z = p.radius * Math.sin(p.angle);
        const y = p.yOffset;

        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = focalLength / (focalLength + z2);
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;
        const size = p.size * scale;

        ctx.beginPath();
        ctx.arc(projX, projY, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      const sortedIndices = Array.from({ length: nodeCount }, (_, i) => i);
      sortedIndices.sort((a, b) => nodes[b].rotatedZ - nodes[a].rotatedZ);

      sortedIndices.forEach(idx => {
        const node = nodes[idx];

        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.projSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '22';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.projSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.projSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (isHovered && node.name && Math.random() < 0.25) {
          ctx.font = '8px monospace';
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillText(node.name, node.projX + 8, node.projY + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[450px] flex items-center justify-center relative select-none">
      <div className="absolute w-[320px] h-[320px] rounded-full border border-purple-500/10 animate-[spin_40s_linear_infinite] pointer-events-none" />
      <div className="absolute w-[240px] h-[240px] rounded-full border border-blue-500/5 animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />
      <canvas ref={canvasRef} className="relative z-10 cursor-pointer drop-shadow-[0_0_25px_rgba(168,85,247,0.25)]" />
    </div>
  );
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'login'>('intro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const tokenClientRef = useRef<any>(null);

  // Set CSS variables for spotlight grid overlay in real time (high performance)
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (pageRef.current) {
        pageRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        pageRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

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

  // Initialize official Google Identity Services Token Client Flow
  useEffect(() => {
    if (googleLoaded && window.google && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
      try {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setIsLoading(true);
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const payload = await res.json();
                onLogin(payload.email, payload.name, payload.picture);
              } catch (error) {
                console.error('Error fetching Google user info:', error);
              } finally {
                setIsLoading(false);
              }
            }
          },
        });
      } catch (err) {
        console.error('Error initializing Google token client:', err);
      }
    }
  }, [googleLoaded]);

  const handleGoogleSignIn = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    } else {
      // Mock/simulated Google Login for preview and development
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin('demo.google@monitorhub.com', 'M. Rakesh Kumar', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rakesh');
      }, 1000);
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
    <div 
      ref={pageRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200"
    >
      {/* Grid background overlay with mouse spot glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.15), transparent 85%),
            radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 28px 28px'
        }}
      />
      
      {/* Background blur orbs */}
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
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
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
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentScreen === 'intro' ? (
            /* INTRO SCREEN - High-End Minimalist Landing */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col gap-12"
            >
              {/* Hero & 3D Centerpiece */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Hero & Narrative */}
                <div className="lg:col-span-6 text-left space-y-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium tracking-wide">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    Building Healthy, Safe & Clean Communities
                  </div>

                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1] font-display">
                    Substance Prevention & <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Wellness Monitor</span>
                  </h1>

                  <p className="text-lg lg:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                    An advanced, secure monitoring framework designed for institutions to foster drug-free environments. Track compliance scores, coordinate real-time anonymous alerts, and trace wellness analytics seamlessly.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setCurrentScreen('login')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-purple-500/25 border-0 text-base"
                      >
                        Access Prevention Portal
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Right Column: 3D Centerpiece with Telemetry Overlay */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center relative bg-white/[0.01] border border-white/5 rounded-3xl p-6 backdrop-blur-sm group hover:border-purple-500/25 hover:shadow-[0_0_35px_rgba(168,85,247,0.1)] transition-all duration-500">
                  {/* Glowing telemetry elements */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/30 text-[10px] text-purple-300 font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    NEURAL METRICS: MONITORING
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-500/30 text-[10px] text-blue-300 font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    SHIELD COMPLIANCE: 99.8%
                  </div>

                  <ThreeDSynapseSphere />
                </div>
              </div>

              {/* Showcase Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
                {[
                  {
                    icon: Brain,
                    title: 'Interactive Wellness Grid',
                    desc: 'Track collective chemical compliance indices and mental wellness health signals in real-time.',
                    iconColor: 'text-purple-400',
                  },
                  {
                    icon: Shield,
                    title: 'Secure Anonymous Reporting',
                    desc: 'Encrypted channels for reporting suspicious activities, protected with end-to-end security layers.',
                    iconColor: 'text-pink-400',
                  },
                  {
                    icon: Activity,
                    title: 'Substance Risk Scoring',
                    desc: 'Advanced threat profiling and risk-scoring metrics mapped by zone for proactive counseling.',
                    iconColor: 'text-blue-400',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="group relative p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden cursor-default"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
                    whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  >
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

              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300">
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

                  {/* Google OAuth Button Container (Token Client Flow, Always Visible) */}
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
                    <Button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-purple-500/30 shadow-lg shadow-purple-500/5 h-11 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3"
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