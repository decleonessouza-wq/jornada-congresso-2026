import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, Star } from 'lucide-react';

export default function QuizSection({ quiz, savedAnswers, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(savedAnswers?.length === quiz.length);
  const [score, setScore] = useState(savedAnswers?.filter((a, i) => a === quiz[i].correct).length || 0);

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 mb-4"
      >
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
          >
            <Check className="h-4 w-4 text-green-600" />
          </motion.div>
          <div>
            <h3 className="font-bold text-green-700 text-sm">Quiz concluído! 🎉</h3>
            <p className="text-xs text-green-600">{score} de {quiz.length} acertos</p>
          </div>
        </div>
      </motion.div>
    );
  }


  const q = quiz[currentQ];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (idx === q.correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQ < quiz.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setDone(true);
        onComplete(newAnswers);
      }
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
          <HelpCircle className="h-4 w-4 text-purple-500" /> Quiz Bíblico
        </h3>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
          {currentQ + 1}/{quiz.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <p className="text-sm font-semibold text-foreground mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correct;
              const isSelected = selected === idx;
              let cls = 'border-gray-200 bg-gray-50/50 active:scale-[0.98]';
              if (showResult && isCorrect) cls = 'border-green-400 bg-green-50 shadow-green-100 shadow-md';
              else if (showResult && isSelected && !isCorrect) cls = 'border-red-300 bg-red-50';
              else if (showResult) cls = 'border-gray-200 bg-gray-50 opacity-40';

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between active:scale-[0.98] ${cls}`}
                >
                  <span className="font-medium">{opt}</span>
                  {showResult && isCorrect && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                  {showResult && isSelected && !isCorrect && <X className="h-4 w-4 text-red-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}