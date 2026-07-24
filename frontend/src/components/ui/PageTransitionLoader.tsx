import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const PageTransitionLoader: React.FC = () => {
  const { pathname } = useLocation();
  const { isDarkMode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none select-none backdrop-blur-md"
          style={{
            background: isDarkMode
              ? 'rgba(10, 10, 15, 0.88)'
              : 'rgba(245, 243, 255, 0.88)',
          }}
        >
          {/* Top Progress Line */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.45, ease: 'circOut' }}
            className="fixed top-0 left-0 right-0 h-1 z-[10000]"
            style={{
              background: isDarkMode
                ? 'linear-gradient(90deg, #F43F5E, #8B5CF6, #22D3EE)'
                : 'linear-gradient(90deg, #4C1D95, #7C3AED, #F43F5E)',
            }}
          />

          {/* Central Logo & Loading Spinner */}
          <div className="relative flex flex-col items-center gap-3.5">
            {/* Outer Glowing Pulsing Ring */}
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-3xl opacity-60 blur-lg animate-pulse"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #F43F5E, #8B5CF6)'
                    : 'linear-gradient(135deg, #4C1D95, #7C3AED)',
                }}
              />
              <motion.div
                animate={{
                  scale: [0.96, 1.04, 0.96],
                  rotate: [0, 4, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl overflow-hidden"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #F43F5E, #8B5CF6)'
                    : 'linear-gradient(135deg, #4C1D95, #7C3AED)',
                }}
              >
                <Zap className="w-7 h-7 fill-current relative z-10" />
              </motion.div>
            </div>

            {/* Brand Logo Text */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-xl font-display font-extrabold tracking-tight text-brand-primary dark:text-white mt-1"
            >
              <span>Wadi</span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Go
              </span>
            </motion.div>

            {/* Bouncing Loader Dots */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: '#7C3AED',
                  animationDelay: '0ms',
                }}
              />
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: '#F43F5E',
                  animationDelay: '150ms',
                }}
              />
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: '#22D3EE',
                  animationDelay: '300ms',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
