import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSplash } from '../lib/sounds';

const SPLASH_KEY = 'jornada1212_splash_seen';

const floatingItems = [
  { emoji: '✨', x: 10, y: 15, delay: 0.2, size: 'text-2xl' },
  { emoji: '🌟', x: 80, y: 10, delay: 0.4, size: 'text-3xl' },
  { emoji: '🙏', x: 15, y: 70, delay: 0.6, size: 'text-2xl' },
  { emoji: '🔥', x: 85, y: 65, delay: 0.3, size: 'text-2xl' },
  { emoji: '💜', x: 50, y: 5, delay: 0.5, size: 'text-xl' },
  { emoji: '⭐', x: 5, y: 45, delay: 0.7, size: 'text-xl' },
  { emoji: '🕊️', x: 90, y: 40, delay: 0.1, size: 'text-2xl' },
  { emoji: '🌈', x: 45, y: 90, delay: 0.8, size: 'text-2xl' },
];

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → congrats → exit

  useEffect(() => {
    // Fire confetti after a small delay
    const t1 = setTimeout(() => {
      playSplash();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ['#7C3AED', '#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#FFFFFF'] });
    }, 600);

    const t2 = setTimeout(() => {
      confetti({ angle: 60, particleCount: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#7C3AED', '#F59E0B'] });
      confetti({ angle: 120, particleCount: 60, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#EC4899', '#10B981'] });
    }, 1000);

    const t3 = setTimeout(() => setPhase('congrats'), 400);
    const t4 = setTimeout(() => setPhase('exit'), 3800);
    const t5 = setTimeout(() => {
      localStorage.setItem(SPLASH_KEY, '1');
      onDone();
    }, 4500);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 30%, #1E40AF 70%, #0F172A 100%)' }}
        >
          {/* Animated background rings */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{ width: `${i * 200}px`, height: `${i * 200}px` }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}

          {/* Floating emoji decorations */}
          {floatingItems.map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.size} pointer-events-none select-none`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: item.delay, duration: 0.4 },
                scale: { delay: item.delay, duration: 0.4, type: 'spring' },
                y: { delay: item.delay + 0.5, duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              {item.emoji}
            </motion.div>
          ))}

          {/* Main content */}
          <div className="relative z-10 text-center px-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
              className="mb-6 relative inline-block"
            >
              <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/40 mx-auto">
                <Sparkles className="h-14 w-14 text-white drop-shadow-lg" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-[2.5rem] border-2 border-dashed border-amber-400/50"
              />
              {/* Glow pulse */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-[2rem] bg-amber-400/30"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl font-extrabold text-white mb-1 drop-shadow-lg"
            >
              Jornada Congresso 2026
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-amber-300 font-bold text-base mb-6 tracking-wide"
            >
              Preparando o coração para o congresso
            </motion.p>

            {/* Congrats message */}
            <AnimatePresence>
              {phase === 'congrats' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 mb-4"
                >
                  <p className="text-2xl font-extrabold text-white mb-1">Bem-vindo(a)! 🙌</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Que alegria ter você aqui!<br />
                    Deus tem algo especial para o seu coração.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-2"
            >
              <p className="text-white/60 text-xs italic">"Alegrai-vos na esperança..."</p>
              <p className="text-amber-400/80 text-xs font-bold mt-0.5 tracking-widest">ROMANOS 12:12</p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="flex justify-center gap-2 mt-8"
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/60"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}