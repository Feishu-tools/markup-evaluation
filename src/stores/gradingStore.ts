import { create } from 'zustand';
import { GradingData, GradingItem } from '@/types';

interface GradingStore {
  data: GradingData | null;
  selectedCardIndex: number;
  selectedQuestionImage: string | null;
  setData: (data: GradingData) => void;
  selectCard: (index: number) => void;
  setQuestionImage: (imageUrl: string | null) => void;
  addQuestion: (question: GradingItem) => void;
  deleteQuestion: (index: number) => void;
  updateQuestion: (index: number, updatedFields: Partial<GradingItem>) => void;
}

export const useGradingStore = create<GradingStore>((set) => ({
  data: null,
  selectedCardIndex: -1,
  selectedQuestionImage: null,
  setData: (data) => set({ data, selectedCardIndex: -1, selectedQuestionImage: null }),
  selectCard: (index) => {
    set((state) => {
      const item = state.data?.grading_report[index];
      return {
        selectedCardIndex: index,
        selectedQuestionImage: item?.image || null,
      };
    });
  },
  setQuestionImage: (imageUrl) => set({ selectedQuestionImage: imageUrl }),
  addQuestion: (question: GradingItem) =>
    set((state) => {
      if (state.data) {
        const newQuestion = {
          ...question,
          isAdded: true,
          actual_is_correct: question.is_correct ? '正确' : '错误',
          actual_question_type: question.question_type === 'subjective' ? '主观' : '客观',
          analysis_acceptability: '优质',
        };
        return {
          data: {
            ...state.data,
            grading_report: [...state.data.grading_report, newQuestion],
          },
        };
      }
      return state;
    }),
  deleteQuestion: (index) =>
    set((state) => {
      if (state.data) {
        const newGradingReport = [...state.data.grading_report];
        newGradingReport.splice(index, 1);
        return {
          data: {
            ...state.data,
            grading_report: newGradingReport,
          },
        };
      }
      return state;
    }),
  updateQuestion: (index, updatedFields) =>
    set((state) => {
      if (state.data) {
        const newGradingReport = [...state.data.grading_report];
        newGradingReport[index] = { ...newGradingReport[index], ...updatedFields };
        return {
          data: {
            ...state.data,
            grading_report: newGradingReport,
          },
        };
      }
      return state;
    }),
}));