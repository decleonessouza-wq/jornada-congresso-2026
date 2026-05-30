import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, ArrowRight, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playClick } from '../lib/sounds';

const FloatingStar = ({ x, y, delay, size = 3 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 2.5 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <Star className={`h-${size} w-${size} text-amber-300 fill-amber-300`} />
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50" />
      <div className="absolute top-[-80px] right-[-60px] w-72 h-72 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 bg-amber-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-[-80px] w-48 h-48 bg-blue-300/20 rounded-full blur-3xl" />

      {/* Floating stars */}
      <FloatingStar x={8} y={15} delay={0} />
      <FloatingStar x={88} y={20} delay={0.6} size={4} />
      <FloatingStar x={15} y={75} delay={1.2} size={2} />
      <FloatingStar x={82} y={70} delay={0.3} size={3} />
      <FloatingStar x={50} y={8} delay={0.9} size={2} />
      <FloatingStar x={70} y={85} delay={1.5} size={3} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="mb-6 relative"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-300/50">
            <Sparkles className="h-12 w-12 text-white drop-shadow-lg" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-[2rem] border-2 border-dashed border-amber-300/60"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-1 rounded-[1.75rem] bg-amber-300/10"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 bg-clip-text text-transparent mb-1 leading-tight"
        >
          Jornada 12:12
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground font-semibold mb-7 tracking-wide"
        >
          Preparando o coração para o congresso
        </motion.p>

        {/* Verse card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl shadow-purple-100/60 border border-purple-100/60 mb-7 max-w-xs w-full"
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-foreground italic leading-relaxed text-sm font-medium">
            "Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração."
          </p>
          <div className="mt-3 inline-block bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full px-3 py-1">
            <p className="text-xs text-white font-bold tracking-widest">ROMANOS 12:12</p>
          </div>
        </motion.div>

        {/* Three phases preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-2 mb-7"
        >
          {[
            { label: 'Alegria', color: 'bg-amber-400', emoji: '☀️' },
            { label: 'Paciência', color: 'bg-blue-400', emoji: '🛡️' },
            { label: 'Oração', color: 'bg-violet-500', emoji: '🔥' },
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.1 }}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-11 h-11 rounded-2xl ${phase.color} flex items-center justify-center text-lg shadow-md`}>
                {phase.emoji}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{phase.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          <Link to="/jornada" onClick={playClick}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl px-10 py-7 text-lg font-extrabold shadow-2xl shadow-purple-400/40 transition-all hover:shadow-purple-400/60 hover:scale-105 active:scale-95"
            >
              <Zap className="mr-2 h-5 w-5 fill-white" />
              Começar jornada
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-muted-foreground mt-5 max-w-[220px]"
        >
          3 etapas · Quizzes bíblicos · Desafios práticos · Ranking
        </motion.p>
      </div>
    </div>
  );
}