import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Eraser, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  playCelebrate,
  playClick,
  playWordSolved,
  playWordWrong,
} from "../lib/sounds";

const DEFAULT_THEME = {
  gradient: "from-purple-600 to-indigo-600",
  lightBg: "bg-purple-50",
  border: "border-purple-100",
  text: "text-purple-700",
  chip: "bg-purple-100 text-purple-700",
  selected: "bg-purple-300 text-purple-950 border-purple-500",
  found: "bg-purple-600 text-white border-purple-700",
  solved: "bg-green-100 text-green-700 border-green-200",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DIRECTIONS = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: -1, col: 1 },
];

function normalizeText(value) {
  return String(value || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
}

function createSeededRandom(seedText) {
  let seed = 0;

  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }

  return function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function shuffle(items, random) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }

  return copy;
}

function canPlaceWord(grid, word, row, col, direction) {
  const size = grid.length;

  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + direction.row * index;
    const nextCol = col + direction.col * index;

    if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
      return false;
    }

    const currentLetter = grid[nextRow][nextCol];

    if (currentLetter && currentLetter !== word[index]) {
      return false;
    }
  }

  return true;
}

function placeWord(grid, wordItem, row, col, direction) {
  const path = [];

  for (let index = 0; index < wordItem.word.length; index += 1) {
    const nextRow = row + direction.row * index;
    const nextCol = col + direction.col * index;

    grid[nextRow][nextCol] = wordItem.word[index];
    path.push({ row: nextRow, col: nextCol });
  }

  return {
    ...wordItem,
    path,
  };
}

function buildWordSearch(puzzle) {
  const size = Number(puzzle?.size || 12);
  const words = (puzzle?.words || [])
    .map((item) => ({
      word: normalizeText(item.word),
      display: item.display || item.word,
    }))
    .filter((item) => item.word.length > 0)
    .sort((a, b) => b.word.length - a.word.length);

  const seedSource = `${puzzle?.title || "word-search"}:${words
    .map((item) => item.word)
    .join("-")}`;

  const random = createSeededRandom(seedSource);
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  const placedWords = [];

  words.forEach((wordItem) => {
    let placed = false;

    const shuffledDirections = shuffle(DIRECTIONS, random);
    const attempts = size * size * shuffledDirections.length * 2;

    for (let attempt = 0; attempt < attempts && !placed; attempt += 1) {
      const row = Math.floor(random() * size);
      const col = Math.floor(random() * size);
      const direction = shuffledDirections[attempt % shuffledDirections.length];

      if (canPlaceWord(grid, wordItem.word, row, col, direction)) {
        placedWords.push(placeWord(grid, wordItem, row, col, direction));
        placed = true;
      }
    }

    if (!placed) {
      for (let row = 0; row < size && !placed; row += 1) {
        for (let col = 0; col < size && !placed; col += 1) {
          for (const direction of DIRECTIONS) {
            if (canPlaceWord(grid, wordItem.word, row, col, direction)) {
              placedWords.push(placeWord(grid, wordItem, row, col, direction));
              placed = true;
              break;
            }
          }
        }
      }
    }
  });

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!grid[row][col]) {
        grid[row][col] = ALPHABET[Math.floor(random() * ALPHABET.length)];
      }
    }
  }

  return {
    grid,
    placedWords,
  };
}

function getCellKey(row, col) {
  return `${row}:${col}`;
}

function getLineBetween(start, end) {
  if (!start || !end) {
    return [];
  }

  const rowDiff = end.row - start.row;
  const colDiff = end.col - start.col;

  const rowStep = Math.sign(rowDiff);
  const colStep = Math.sign(colDiff);

  const sameRow = rowDiff === 0;
  const sameCol = colDiff === 0;
  const diagonal = Math.abs(rowDiff) === Math.abs(colDiff);

  if (!sameRow && !sameCol && !diagonal) {
    return [start];
  }

  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
  const cells = [];

  for (let index = 0; index <= steps; index += 1) {
    cells.push({
      row: start.row + rowStep * index,
      col: start.col + colStep * index,
    });
  }

  return cells;
}

function getSelectedWord(selection, grid) {
  return selection.map((cell) => grid[cell.row]?.[cell.col] || "").join("");
}

function reverseText(value) {
  return value.split("").reverse().join("");
}

function normalizeSavedSolved(savedSolved, placedWords) {
  if (!Array.isArray(savedSolved)) {
    return [];
  }

  const validWords = new Set(placedWords.map((item) => item.word));

  return savedSolved
    .map(normalizeText)
    .filter((word, index, array) => validWords.has(word) && array.indexOf(word) === index);
}

export default function WordSearchPuzzle({ puzzle, savedSolved = [], onComplete }) {
  const gridRef = useRef(null);

  const theme = {
    ...DEFAULT_THEME,
    ...(puzzle?.theme || {}),
  };

  const { grid, placedWords } = useMemo(() => buildWordSearch(puzzle), [puzzle]);

  const initialSolved = useMemo(
    () => normalizeSavedSolved(savedSolved, placedWords),
    [savedSolved, placedWords]
  );

  const [solvedWords, setSolvedWords] = useState(initialSolved);
  const [selection, setSelection] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tapStart, setTapStart] = useState(null);
  const [feedback, setFeedback] = useState("");

  if (!puzzle?.words?.length) {
    return null;
  }

  const solvedSet = new Set(solvedWords);
  const foundCellKeys = new Set();

  placedWords.forEach((wordItem) => {
    if (solvedSet.has(wordItem.word)) {
      wordItem.path.forEach((cell) => foundCellKeys.add(getCellKey(cell.row, cell.col)));
    }
  });

  const selectionKeys = new Set(selection.map((cell) => getCellKey(cell.row, cell.col)));
  const completed = solvedWords.length >= placedWords.length;

  function findCellFromPoint(clientX, clientY) {
    const element = document.elementFromPoint(clientX, clientY);
    const cellElement = element?.closest?.("[data-word-cell]");

    if (!cellElement || !gridRef.current?.contains(cellElement)) {
      return null;
    }

    return {
      row: Number(cellElement.dataset.row),
      col: Number(cellElement.dataset.col),
    };
  }

  function commitSolvedWord(wordItem) {
    const updatedSolved = solvedSet.has(wordItem.word)
      ? solvedWords
      : [...solvedWords, wordItem.word];

    setSolvedWords(updatedSolved);
    onComplete(updatedSolved);

    if (updatedSolved.length >= placedWords.length) {
      playCelebrate();
      setFeedback("Caça-palavras concluído! Muito bem 🎉");
    } else {
      playWordSolved();
      setFeedback(`Palavra encontrada: ${wordItem.display}`);
    }
  }

  function validateSelection(currentSelection) {
    if (currentSelection.length < 2) {
      return;
    }

    const selectedWord = getSelectedWord(currentSelection, grid);
    const reversedWord = reverseText(selectedWord);

    const foundWord = placedWords.find(
      (item) =>
        !solvedSet.has(item.word) &&
        (item.word === selectedWord || item.word === reversedWord)
    );

    if (foundWord) {
      commitSolvedWord(foundWord);
      setSelection([]);
      setTapStart(null);
      return;
    }

    playWordWrong();
    setFeedback("Essa seleção ainda não forma uma palavra da lista. Tente novamente!");
    setTimeout(() => setSelection([]), 450);
  }

  function handlePointerDown(event, row, col) {
    event.preventDefault();

    const currentCell = { row, col };

    if (tapStart) {
      const line = getLineBetween(tapStart, currentCell);

      setSelection(line);
      validateSelection(line);
      setTapStart(null);
      return;
    }

    playClick();
    setFeedback("");
    setDragStart(currentCell);
    setSelection([currentCell]);
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    if (!isDragging || !dragStart) {
      return;
    }

    const currentCell = findCellFromPoint(event.clientX, event.clientY);

    if (!currentCell) {
      return;
    }

    const line = getLineBetween(dragStart, currentCell);
    setSelection(line);
  }

  function handlePointerUp() {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    if (selection.length <= 1) {
      const singleCell = selection[0];

      if (singleCell) {
        setTapStart(singleCell);
        setFeedback("Agora toque na última letra da palavra.");
      }

      return;
    }

    validateSelection(selection);
    setDragStart(null);
  }

  function clearSelection() {
    setSelection([]);
    setDragStart(null);
    setTapStart(null);
    setIsDragging(false);
    setFeedback("");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 rounded-3xl border ${theme.border} bg-white p-4 shadow-md`}
    >
      <div className={`mb-4 rounded-2xl bg-gradient-to-r ${theme.gradient} p-4 text-white`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Search className="h-5 w-5" />
          </div>

          <div>
            <div className="mb-1 inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
              Desafio extra
            </div>

            <h3 className="text-base font-extrabold">
              {puzzle.title || "Caça-palavras da etapa"}
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-white/85">
              {puzzle.subtitle || "Encontre as palavras ligadas à mensagem desta fase."}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-extrabold text-muted-foreground">
          Encontradas: {solvedWords.length}/{placedWords.length}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          className="h-8 rounded-xl text-xs"
        >
          <Eraser className="mr-1 h-3.5 w-3.5" />
          Limpar
        </Button>
      </div>

      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${placedWords.length ? (solvedWords.length / placedWords.length) * 100 : 0}%`,
          }}
          transition={{ duration: 0.4 }}
          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
        />
      </div>

      <div
        ref={gridRef}
        className="mx-auto mb-4 grid max-w-[340px] touch-none select-none gap-1 rounded-2xl bg-slate-50 p-2"
        style={{
          gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearSelection}
        onPointerLeave={() => {
          if (isDragging) {
            handlePointerUp();
          }
        }}
      >
        {grid.map((rowItems, row) =>
          rowItems.map((letter, col) => {
            const key = getCellKey(row, col);
            const selected = selectionKeys.has(key);
            const found = foundCellKeys.has(key);
            const tapSelected =
              tapStart && tapStart.row === row && tapStart.col === col;

            let className =
              "border-slate-200 bg-white text-slate-700 hover:bg-slate-100";

            if (found) {
              className = theme.found;
            } else if (selected || tapSelected) {
              className = theme.selected;
            }

            return (
              <button
                key={key}
                type="button"
                data-word-cell
                data-row={row}
                data-col={col}
                onPointerDown={(event) => handlePointerDown(event, row, col)}
                className={`flex aspect-square min-h-[23px] items-center justify-center rounded-lg border text-[11px] font-extrabold transition-all sm:text-xs ${className}`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      {feedback && (
        <div
          className={`mb-4 rounded-2xl px-3 py-2 text-center text-xs font-bold ${
            feedback.includes("encontrada") || feedback.includes("concluído")
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="mb-2 grid grid-cols-2 gap-2">
        {placedWords.map((wordItem) => {
          const solved = solvedSet.has(wordItem.word);

          return (
            <div
              key={wordItem.word}
              className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs font-extrabold ${
                solved ? theme.solved : `${theme.chip} ${theme.border}`
              }`}
            >
              <span>{wordItem.display}</span>
              {solved && <Check className="h-4 w-4" />}
            </div>
          );
        })}
      </div>

      <div className={`${theme.lightBg} mt-3 rounded-2xl px-3 py-2`}>
        <p className={`text-[11px] font-semibold leading-relaxed ${theme.text}`}>
          Toque na primeira letra e arraste até a última. Se preferir, toque na
          primeira letra e depois na última para selecionar a palavra.
        </p>
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center"
        >
          <Sparkles className="mx-auto mb-1 h-5 w-5 text-green-600" />
          <p className="text-sm font-extrabold text-green-700">
            Desafio extra concluído!
          </p>
          <p className="mt-1 text-xs text-green-700/80">
            Você encontrou todas as palavras desta etapa.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}