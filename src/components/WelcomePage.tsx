import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Zap, Stars, ArrowRight } from 'lucide-react';

// Generate floating particles only once per render
const generateParticles = () =>
  Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }));

const WelcomePage: React.FC<{ onComplete: (username: string) => void }> = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [particles] = useState(generateParticles);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Trigger sparkle effect after initial animations
    const timer = setTimeout(() => setShowSparkle(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault?.();
    if (username.trim().length > 1) {
      setSubmitted(true);
      setTimeout(() => onComplete(username.trim()), 1800);
    } else {
      inputRef.current?.focus();
      if (inputRef.current) {
        inputRef.current.classList.add('shake');
        setTimeout(() => {
          inputRef.current?.classList.remove('shake');
        }, 600);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: ["0%", "100%"],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              y: {
                duration: particle.duration,
                repeat: Infinity,
                ease: "linear",
                delay: particle.delay,
              },
              opacity: {
                duration: particle.duration / 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: particle.delay,
              }
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50, rotateZ: -2 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl px-10 py-12 max-w-md w-full flex flex-col items-center border border-white/20 overflow-hidden"
          >
            {/* Glowing accent */}
            <motion.div 
              className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-fuchsia-500/40 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            {/* Logo animation */}
            <motion.div
              initial={{ rotate: -20, scale: 0.7 }}
              animate={{ 
                rotate: 0, 
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 10, 
                delay: 0.3,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="mb-6 relative"
            >
              <div className="relative flex items-center justify-center">
                <Zap size={70} className="text-fuchsia-300 drop-shadow-lg" />
                
                {showSparkle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Stars size={90} className="text-yellow-300/40 absolute -top-3 -left-3" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Title with glow effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative text-center mb-2"
            >
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-300 to-fuchsia-400">
                Unscramblitz!
              </h1>
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-400 via-violet-300 to-fuchsia-400 opacity-30 -z-10"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-white/90 mb-8 text-center font-medium"
            >
              Ready to twist your brain and unleash the fun?
              <motion.span
                className="block mt-1 text-fuchsia-200"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Enter your username to get started!
              </motion.span>
            </motion.p>

            <div className="w-full flex flex-col items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="relative w-full"
              >
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={22} />
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your username"
                  className="pl-10 pr-4 py-3 rounded-xl w-full border-2 border-indigo-400/30 focus:border-fuchsia-400 outline-none text-lg transition-all duration-300 bg-white/20 backdrop-blur-sm text-white shadow-inner placeholder:text-white/60"
                  style={{
                    boxShadow: "0 0 15px rgba(167, 139, 250, 0.1) inset"
                  }}
                  maxLength={18}
                  autoFocus
                />
              </motion.div>

              <motion.button
                onClick={handleSubmit}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 25px rgba(217, 70, 239, 0.6)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-lg transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10">Let's Play!</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative z-10"
                >
                  <ArrowRight size={20} />
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
            className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl px-10 py-16 max-w-md w-full flex flex-col items-center relative border border-white/20 overflow-hidden"
          >
            {/* Pulsing background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-indigo-700/30 to-fuchsia-700/30"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.2, 0.8, 1],
                repeat: 1
              }}
              className="mb-6 relative"
            >
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity
                }}
              >
                <Stars size={80} className="text-fuchsia-300" />
              </motion.div>
              <Sparkles size={50} className="text-yellow-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
            
            {/* Success message with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-center relative"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 mb-2">
                Hi, {username}!
              </h2>
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-400 via-violet-300 to-fuchsia-400 opacity-30 -z-10"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl text-white mb-6 text-center font-medium"
            >
              Get ready to unscramble some words...
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
              className="relative"
            >
              <motion.div
                className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full"
                animate={{ 
                  width: ["4rem", "12rem", "4rem"],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Style injection for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;