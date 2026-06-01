import { useCallback, useEffect, useState } from "react";
import { phases } from "./journeyData";

export const JOURNEY_PROGRESS_STORAGE_KEY = "jornada1212_progress";

function createDefaultPhaseState() {
  return {
    quizCorrect: [],
    funnyCorrect: [],
    crosswordSolved: [],
    wordSearchSolved: [],
    reflection: "",
    completed: false,
  };
}

function createDefaultState() {
  return {
    phases: phases.reduce((acc, phase) => {
      acc[phase.id] = createDefaultPhaseState();
      return acc;
    }, {}),
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function safeParseProgress(rawValue) {
  try {
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function mergeProgressWithDefault(savedProgress) {
  const defaultState = createDefaultState();

  if (!savedProgress?.phases) {
    return defaultState;
  }

  return {
    phases: phases.reduce((acc, phase) => {
      const savedPhase = savedProgress.phases?.[phase.id] || {};

      acc[phase.id] = {
        ...createDefaultPhaseState(),
        ...savedPhase,
        quizCorrect: normalizeArray(savedPhase.quizCorrect),
        funnyCorrect: normalizeArray(savedPhase.funnyCorrect),
        crosswordSolved: normalizeArray(savedPhase.crosswordSolved),
        wordSearchSolved: normalizeArray(savedPhase.wordSearchSolved),
        reflection: savedPhase.reflection || "",
        completed: Boolean(savedPhase.completed),
      };

      return acc;
    }, {}),
  };
}

export function getStoredJourneyProgress() {
  if (!canUseStorage()) {
    return createDefaultState();
  }

  const saved = safeParseProgress(
    localStorage.getItem(JOURNEY_PROGRESS_STORAGE_KEY)
  );

  return mergeProgressWithDefault(saved);
}

export function saveJourneyProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(JOURNEY_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function clearJourneyProgress() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(JOURNEY_PROGRESS_STORAGE_KEY);
}

export function resetJourneyProgress() {
  const defaultState = createDefaultState();
  saveJourneyProgress(defaultState);
  return defaultState;
}

export function useJourneyProgress() {
  const [progress, setProgress] = useState(() => getStoredJourneyProgress());

  useEffect(() => {
    saveJourneyProgress(progress);
  }, [progress]);

  const updatePhase = useCallback((phaseId, data) => {
    setProgress((previousProgress) => ({
      ...previousProgress,
      phases: {
        ...previousProgress.phases,
        [phaseId]: {
          ...createDefaultPhaseState(),
          ...previousProgress.phases[phaseId],
          ...data,
        },
      },
    }));
  }, []);

  const completePhase = useCallback(
    (phaseId) => {
      updatePhase(phaseId, { completed: true });
    },
    [updatePhase]
  );

  const resetProgress = useCallback(() => {
    const defaultState = resetJourneyProgress();
    setProgress(defaultState);
    return defaultState;
  }, []);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress.phases).filter((phase) => phase.completed).length;
  }, [progress]);

  const getOverallProgress = useCallback(() => {
    if (!phases.length) {
      return 0;
    }

    return Math.round((getCompletedCount() / phases.length) * 100);
  }, [getCompletedCount]);

  const isPhaseUnlocked = useCallback(
    (phaseId) => {
      const currentId = Number(phaseId);

      if (currentId === 1) {
        return true;
      }

      return progress.phases[String(currentId - 1)]?.completed === true;
    },
    [progress]
  );

  const getPhaseScore = useCallback(
    (phaseId) => {
      const phase = phases.find((item) => item.id === String(phaseId));
      const phaseProgress = progress.phases[String(phaseId)];

      if (!phase || !phaseProgress) {
        return 0;
      }

      let score = 0;

      (phaseProgress.quizCorrect || []).forEach((answer, index) => {
        if (answer === phase.quiz?.[index]?.correct) {
          score += 10;
        }
      });

      (phaseProgress.funnyCorrect || []).forEach((answer, index) => {
        if (answer === phase.funnyQuestions?.[index]?.correct) {
          score += 5;
        }
      });

      score += (phaseProgress.crosswordSolved?.length || 0) * 15;

      /*
        Caça-palavras é desafio extra.
        Ele aumenta a experiência e a pontuação, mas não bloqueia a conclusão da fase.
      */
      score += (phaseProgress.wordSearchSolved?.length || 0) * 10;

      if (phaseProgress.completed) {
        score += 50;
      }

      return score;
    },
    [progress]
  );

  const getTotalScore = useCallback(() => {
    return phases.reduce((total, phase) => total + getPhaseScore(phase.id), 0);
  }, [getPhaseScore]);

  const getPhaseTaskProgress = useCallback(
    (phaseId) => {
      const phase = phases.find((item) => item.id === String(phaseId));
      const phaseProgress = progress.phases[String(phaseId)];

      if (!phase || !phaseProgress) {
        return {
          completedTasks: 0,
          totalTasks: 4,
        };
      }

      const quizDone =
        (phaseProgress.quizCorrect || []).length >= (phase.quiz || []).length;

      const funnyDone =
        (phaseProgress.funnyCorrect || []).length >=
        (phase.funnyQuestions || []).length;

      const crosswordDone =
        (phaseProgress.crosswordSolved || []).length >=
        (phase.crossword || []).length;

      const reflectionDone = Boolean(phaseProgress.reflection?.trim());

      return {
        completedTasks: [quizDone, funnyDone, crosswordDone, reflectionDone].filter(
          Boolean
        ).length,
        totalTasks: 4,
      };
    },
    [progress]
  );

  const getWordSearchProgress = useCallback(
    (phaseId) => {
      const phase = phases.find((item) => item.id === String(phaseId));
      const phaseProgress = progress.phases[String(phaseId)];

      if (!phase || !phaseProgress) {
        return {
          solved: [],
          solvedCount: 0,
          totalWords: 0,
          completed: false,
        };
      }

      const solved = normalizeArray(phaseProgress.wordSearchSolved);
      const totalWords = phase.wordSearch?.words?.length || 0;

      return {
        solved,
        solvedCount: solved.length,
        totalWords,
        completed: totalWords > 0 && solved.length >= totalWords,
      };
    },
    [progress]
  );

  return {
    progress,
    updatePhase,
    completePhase,
    resetProgress,
    getCompletedCount,
    getOverallProgress,
    isPhaseUnlocked,
    getPhaseScore,
    getTotalScore,
    getPhaseTaskProgress,
    getWordSearchProgress,
  };
}