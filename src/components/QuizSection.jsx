import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle, Star } from "lucide-react";
import { playCorrect, playWrong } from "../lib/sounds";

export default function QuizSection({ quiz, savedAnswers, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(savedAnswers?.length === quiz.length);
  const [score, setScore] = useState(
    savedAnswers?.filter((answer, index) => answer === quiz[index]?.correct).length || 0
  );

  if (!quiz?.length) return null;

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4 rounded-2xl border border-green-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
          >
            <Check className="h-5 w-5 text-green-600" />
          </motion.div>

          <div>
            <h3 className="text-sm font-bold text-green-700">
              Quiz concluído! 🎉
            </h3>
            <p className="text-xs text-green-600">
              {score} de {quiz.length} acertos
            </p>
          </div>

          <div className="ml-auto flex gap-0.5">
            {quiz.map((_, index) => (
              <Star
                key={index}
                className={`h-3.5 w-3.5 ${
                  index < score
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const q = quiz[currentQ];

  const handleSelect = (index) => {
    if (showResult) return;

    const isCorrect = index === q.correct;

    setSelected(index);
    setShowResult(true);

    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore((current) => current + 1);
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      if (currentQ < quiz.length - 1) {
        setCurrentQ((current) => current + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setDone(true);
        onComplete(newAnswers);
      }
    }, 2400);
  };

  return (
    <div className="mb-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <HelpCircle className="h-4 w-4 text-purple-500" />
          Quiz Bíblico
        </h3>

        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-600">
          {currentQ + 1}/{quiz.length}
        </span>
      </div>

      <div className="mb-4 h-2 rounded-full bg-purple-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentQ + Number(showResult)) / quiz.length) * 100}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="mb-4 text-sm font-semibold leading-relaxed text-foreground">
            {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((option, index) => {
              const isCorrect = index === q.correct;
              const isSelected = selected === index;

              let className =
                "border-gray-200 bg-gray-50/50 active:scale-[0.98] hover:border-purple-200 hover:bg-purple-50";

              if (showResult && isCorrect) {
                className = "border-green-400 bg-green-50 shadow-green-100 shadow-md";
              } else if (showResult && isSelected && !isCorrect) {
                className = "border-red-300 bg-red-50";
              } else if (showResult) {
                className = "border-gray-200 bg-gray-50 opacity-40";
              }

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all ${className}`}
                >
                  <span className="font-medium">{option}</span>

                  {showResult && isCorrect && (
                    <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                  )}

                  {showResult && isSelected && !isCorrect && (
                    <X className="h-4 w-4 flex-shrink-0 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 rounded-xl border px-3 py-2 text-xs leading-relaxed ${
                selected === q.correct
                  ? "border-green-100 bg-green-50 text-green-700"
                  : "border-amber-100 bg-amber-50 text-amber-800"
              }`}
            >
              <strong>
                {selected === q.correct ? "Muito bem!" : "Quase!"}
              </strong>{" "}
              {q.comment || `Resposta correta: ${q.options[q.correct]}.`}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}