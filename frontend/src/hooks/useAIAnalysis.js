import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for managing AI analysis state
 */
export const useAIAnalysis = () => {
  const location = useLocation();
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    const {
      aiAnalysisResult: stateResult,
      isAnalyzing: stateAnalyzing,
      analysisError: stateError,
    } = location.state || {};

    if (stateAnalyzing !== undefined) {
      setIsAnalyzing(stateAnalyzing);
    }

    if (stateError) {
      setAnalysisError(stateError);
      setIsAnalyzing(false);
    }

    if (stateResult) {
      setAiAnalysisResult(stateResult);
      setIsAnalyzing(false);
    } else if (!stateAnalyzing && !stateError) {
      setAnalysisError("No AI analysis result found");
      setIsAnalyzing(false);
    }
  }, [location.state]);

  return {
    aiAnalysisResult,
    isAnalyzing,
    analysisError,
    setAiAnalysisResult,
    setIsAnalyzing,
    setAnalysisError,
  };
};
