import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveQuestions, getQuestions as getLocalQuestions } from '@/lib/indexeddb';
import { getDeviceId } from '@/lib/device';

export interface Question {
  id: string;
  subject: string;
  topic: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  difficulty: number;
  svg_data: string | null;
}

interface UseQuestionsOptions {
  subject?: string;
  topic?: string;
  excludeUsed?: boolean;
  sessionType?: string;
}

export function useQuestions(options: UseQuestionsOptions = {}) {
  const { subject, topic, excludeUsed = false, sessionType = 'practice' } = options;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const deviceId = getDeviceId();
      
      // Get used question IDs if needed
      let usedIds: Set<string> = new Set();
      if (excludeUsed) {
        const { data: usedData } = await supabase
          .from('used_questions')
          .select('question_id')
          .eq('device_id', deviceId)
          .eq('session_type', sessionType);
        
        usedIds = new Set((usedData || []).map(u => u.question_id));
      }

      // Build query - always fetch fresh from DB without limits
      let query = supabase.from('questions').select('*');
      
      if (subject) {
        query = query.eq('subject', subject);
      }
      if (topic) {
        query = query.eq('topic', topic);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      let formattedQuestions = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
      })) as Question[];

      // Filter out used questions if needed
      if (excludeUsed && usedIds.size > 0) {
        formattedQuestions = formattedQuestions.filter(q => !usedIds.has(q.id));
      }
      
      setQuestions(formattedQuestions);
      
      // Cache for offline use
      await saveQuestions(formattedQuestions.map(q => ({
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        questionText: q.question_text,
        questionType: q.question_type,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        svgData: q.svg_data,
      })));
    } catch (err) {
      console.error('Error fetching questions:', err);
      
      // Try to load from IndexedDB
      try {
        const localQuestions = await getLocalQuestions();
        let filtered = localQuestions;
        
        if (subject) {
          filtered = filtered.filter(q => q.subject === subject);
        }
        if (topic) {
          filtered = filtered.filter(q => q.topic === topic);
        }
        
        setQuestions(filtered.map(q => ({
          id: q.id,
          subject: q.subject,
          topic: q.topic,
          question_text: q.questionText,
          question_type: q.questionType,
          options: q.options,
          correct_answer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          svg_data: q.svgData,
        })));
      } catch {
        setError('Failed to load questions. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [subject, topic, excludeUsed, sessionType]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Mark a question as used
  const markQuestionUsed = async (questionId: string) => {
    try {
      const deviceId = getDeviceId();
      await supabase.from('used_questions').insert({
        device_id: deviceId,
        question_id: questionId,
        session_type: sessionType,
      });
    } catch (e) {
      console.error('Failed to mark question as used:', e);
    }
  };

  // Reset used questions for this session type
  const resetUsedQuestions = async () => {
    try {
      const deviceId = getDeviceId();
      await supabase
        .from('used_questions')
        .delete()
        .eq('device_id', deviceId)
        .eq('session_type', sessionType);
      
      await fetchQuestions();
    } catch (e) {
      console.error('Failed to reset used questions:', e);
    }
  };

  return { 
    questions, 
    loading, 
    error, 
    refetch: fetchQuestions,
    markQuestionUsed,
    resetUsedQuestions,
  };
}
