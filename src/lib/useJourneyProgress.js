import { useState, useEffect, useCallback } from 'react';
import { phases } from './journeyData';

const STORAGE_KEY = 'jornada1212_progress';

const defaultState = {
  phases: {
    "1": { quizCorrect: [], crosswordSolved: [], reflection: "", completed: false },
    "2": { quizCorrect: [], crosswordSolved: [], reflection: "", completed: false },
    "3": { quizCorrect: [], crosswordSolved: [], reflection: "", completed: false },
  }
};

export function useJourneyProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { phases: { ...defaultState.phases, ...parsed.phases } };
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updatePhase = useCallback((phaseId, data) => {
    setProgress(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phaseId]: { ...prev.phases[phaseId], ...data }
      }
    }));
  }, []);

  const completePhase = useCallback((phaseId) => {
    updatePhase(phaseId, { completed: true });
  }, [updatePhase]);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress.phases).filter(p => p.completed).length;
  }, [progress]);

  const getOverallProgress = useCallback(() => {
    return Math.round((getCompletedCount() / 3) * 100);
  }, [getCompletedCount]);

  const isPhaseUnlocked = useCallback((phaseId) => {
    const id = parseInt(phaseId);
    if (id === 1) return true;
    return progress.phases[String(id - 1)]?.completed === true;
  }, [progress]);

  const getTotalScore = useCallback(() => {
    let score = 0;
    phases.forEach(phase => {
      const p = progress.phases[phase.id];
      if (!p) return;
      (p.quizCorrect || []).forEach((answer, i) => {
        if (answer === phase.quiz[i]?.correct) score += 10;
      });
      score += (p.crosswordSolved?.length || 0) * 15;
      if (p.completed) score += 50;
    });
    return score;
  }, [progress]);

  return { progress, updatePhase, completePhase, getCompletedCount, getOverallProgress, isPhaseUnlocked, getTotalScore };
}