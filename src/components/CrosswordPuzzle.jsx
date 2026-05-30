import { useState } from 'react';
import { playWordSolved, playWordWrong } from '../lib/sounds';
import { motion } from 'framer-motion';
import { Check, RotateCcw, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CrosswordPuzzle({ words, savedSolved, onComplete }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [solved, setSolved] = useState(savedSolved || []);
  const allDone = solved.length === words.length;

  if (allDone) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-700 text-sm">Palavra cruzada concluída!</h3>
            <p className="text-xs text-green-600">{words.length} palavras encontradas</p>
          </div>
        </div>
      </div>
    );
  }

  const word = words[currentWord];
  const cleanWord = word.word.toUpperCase();
  const userAnswer = (userInputs[currentWord] || '').toUpperCase();
  const isWordSolved = solved.includes(currentWord);

  const handleCheck = () => {
    if (userAnswer === cleanWord) {
      playWordSolved();
      const newSolved = [...solved, currentWord];
      setSolved(newSolved);
      if (newSolved.length === words.length) {
        onComplete(newSolved);
      } else {
        for (let i = 0; i < words.length; i++) {
          if (!newSolved.includes(i)) { setCurrentWord(i); break; }
        }
      }
    } else {
      playWordWrong();
    }
  };

  const handleInputChange = (value) => {
    const clean = value.toUpperCase().replace(/[^A-Z]/g, '');
    setUserInputs(prev => ({ ...prev, [currentWord]: clean }));
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
          <Pencil className="h-4 w-4 text-purple-500" /> Palavra Cruzada
        </h3>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
          {solved.length}/{words.length}
        </span>
      </div>

      {/* Word selector pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {words.map((w, idx) => {
          const isSolved = solved.includes(idx);
          const isCurrent = currentWord === idx;
          return (
            <button
              key={idx}
              onClick={() => !isSolved && setCurrentWord(idx)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isSolved ? 'bg-green-100 text-green-700' :
                isCurrent ? 'bg-purple-600 text-white' :
                'bg-gray-100 text-gray-500'
              }`}
            >
              {isSolved ? '✓ ' : ''}{idx + 1}
            </button>
          );
        })}
      </div>

      {/* Current word clue */}
      <div className="bg-purple-50 rounded-xl p-4 mb-4">
        <p className="text-xs text-purple-500 font-semibold mb-1">Dica:</p>
        <p className="text-sm text-foreground font-medium">{word.clue}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {cleanWord.length} letras
        </p>
      </div>

      {/* Letter boxes */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {cleanWord.split('').map((letter, idx) => {
          const userLetter = userAnswer[idx] || '';
          const isCorrect = userLetter === letter;
          return (
            <div
              key={idx}
              className={`w-9 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all ${
                isCorrect ? 'border-green-400 bg-green-50 text-green-700' :
                userLetter ? 'border-red-300 bg-red-50 text-red-600' :
                'border-purple-200 bg-purple-50/30 text-foreground'
              }`}
            >
              {userLetter || ''}
            </div>
          );
        })}
      </div>

      {/* Input field */}
      {!isWordSolved && (
        <>
          <input
            type="text"
            value={userInputs[currentWord] || ''}
            onChange={e => handleInputChange(e.target.value)}
            maxLength={cleanWord.length}
            placeholder="Digite a palavra..."
            className="w-full px-4 py-3 rounded-xl border border-purple-200 text-center font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={handleCheck} size="sm" className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white" disabled={userAnswer.length !== cleanWord.length}>
              <Check className="h-4 w-4 mr-1" /> Verificar
            </Button>
            <Button onClick={() => handleInputChange('')} size="sm" variant="outline" className="rounded-xl">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          {userAnswer.length === cleanWord.length && userAnswer !== cleanWord && (
            <p className="text-xs text-red-500 mt-2 text-center">Tente novamente! Algumas letras estão incorretas.</p>
          )}
        </>
      )}
    </div>
  );
}