import { useMemo, useState } from "react";
import { playWordSolved, playWordWrong } from "../lib/sounds";
import { motion } from "framer-motion";
import { Check, RotateCcw, Pencil, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

function normalizeText(value) {
  return String(value || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
}

function getFirstUnsolvedIndex(words = [], solved = []) {
  const index = words.findIndex((_, itemIndex) => !solved.includes(itemIndex));
  return index >= 0 ? index : 0;
}

export default function CrosswordPuzzle({ words = [], savedSolved, onComplete }) {
  const validWords = Array.isArray(words) ? words : [];

  const initialSolved = useMemo(() => {
    if (!Array.isArray(savedSolved)) {
      return [];
    }

    return savedSolved.filter(
      (item, index, array) =>
        Number.isInteger(item) &&
        item >= 0 &&
        item < validWords.length &&
        array.indexOf(item) === index
    );
  }, [savedSolved, validWords.length]);

  const [solved, setSolved] = useState(initialSolved);
  const [currentWord, setCurrentWord] = useState(() =>
    getFirstUnsolvedIndex(validWords, initialSolved)
  );
  const [userInputs, setUserInputs] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  if (!validWords.length) {
    return null;
  }

  const allDone = solved.length >= validWords.length;

  if (allDone) {
    return (
      <div className="mb-4 rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Check className="h-4 w-4 text-green-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-green-700">
              Palavras concluídas!
            </h3>
            <p className="text-xs text-green-600">
              {validWords.length} palavras encontradas
            </p>
          </div>
        </div>
      </div>
    );
  }

  const word = validWords[currentWord] || validWords[0];
  const cleanWord = normalizeText(word.word);
  const displayWord = word.display || word.word;
  const userAnswer = normalizeText(userInputs[currentWord] || "");
  const isWordSolved = solved.includes(currentWord);

  const handleCheck = () => {
    if (!cleanWord) {
      return;
    }

    if (userAnswer === cleanWord) {
      playWordSolved();
      setErrorMessage("");

      const newSolved = solved.includes(currentWord)
        ? solved
        : [...solved, currentWord];

      setSolved(newSolved);

      if (newSolved.length >= validWords.length) {
        onComplete(newSolved);
        return;
      }

      setCurrentWord(getFirstUnsolvedIndex(validWords, newSolved));
      return;
    }

    playWordWrong();
    setErrorMessage("Tente novamente! Algumas letras ainda estão incorretas.");
  };

  const handleInputChange = (value) => {
    const clean = normalizeText(value).slice(0, cleanWord.length);

    setUserInputs((previousInputs) => ({
      ...previousInputs,
      [currentWord]: clean,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSelectWord = (index) => {
    setCurrentWord(index);
    setErrorMessage("");
  };

  const handleClearInput = () => {
    handleInputChange("");
    setErrorMessage("");
  };

  return (
    <div className="mb-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Pencil className="h-4 w-4 text-purple-500" />
          Palavras da Etapa
        </h3>

        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-600">
          {solved.length}/{validWords.length}
        </span>
      </div>

      <div className="mb-4 h-2 rounded-full bg-purple-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(solved.length / validWords.length) * 100}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {validWords.map((item, index) => {
          const solvedItem = solved.includes(index);
          const currentItem = currentWord === index;

          return (
            <button
              key={`${item.word}-${index}`}
              type="button"
              onClick={() => handleSelectWord(index)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                solvedItem
                  ? "bg-green-100 text-green-700"
                  : currentItem
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {solvedItem ? "✓ " : ""}
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mb-4 rounded-xl bg-purple-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-purple-500" />
          <p className="text-xs font-semibold text-purple-500">Dica:</p>
        </div>

        <p className="text-sm font-medium text-foreground">{word.clue}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {cleanWord.length} letras
        </p>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-1">
        {cleanWord.split("").map((letter, index) => {
          const userLetter = userAnswer[index] || "";
          const isCorrect = userLetter === letter;

          return (
            <div
              key={`${letter}-${index}`}
              className={`flex h-10 w-9 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all ${
                isCorrect
                  ? "border-green-400 bg-green-50 text-green-700"
                  : userLetter
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-purple-200 bg-purple-50/30 text-foreground"
              }`}
            >
              {userLetter || ""}
            </div>
          );
        })}
      </div>

      {isWordSolved ? (
        <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-center">
          <p className="text-xs font-bold text-green-700">
            Palavra encontrada: {displayWord}
          </p>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={userInputs[currentWord] || ""}
            onChange={(event) => handleInputChange(event.target.value)}
            maxLength={cleanWord.length}
            placeholder="Digite a palavra..."
            autoComplete="off"
            inputMode="text"
            className="mb-3 w-full rounded-xl border border-purple-200 px-4 py-3 text-center text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleCheck}
              size="sm"
              className="flex-1 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              disabled={userAnswer.length !== cleanWord.length}
            >
              <Check className="mr-1 h-4 w-4" />
              Verificar
            </Button>

            <Button
              type="button"
              onClick={handleClearInput}
              size="sm"
              variant="outline"
              className="rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {errorMessage && (
            <p className="mt-2 text-center text-xs font-semibold text-red-500">
              {errorMessage}
            </p>
          )}
        </>
      )}
    </div>
  );
}