import { create } from 'zustand';
import { GradingData, GradingItem, JsonDataItem } from '@/types';

interface GradingStore {
  data: GradingItem[] | null;
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
  setData: (data: GradingData) => {
    const flattenedData = data.flatMap(item => 
      item.questions_info.map(question => ({
        ...question,
        image_url: item.image_url,
      }))
    );
    set({ data: flattenedData, selectedCardIndex: -1, selectedQuestionImage: null });
  },
  selectCard: (index) => {
    set((state) => {
      if (!state.data) return {};
      const item = state.data[index];
      return {
        selectedCardIndex: index,
        selectedQuestionImage: item?.image_url || null,
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
        };
        return {
          data: [...state.data, newQuestion],
        };
      }
      return state;
    }),
  deleteQuestion: (index) =>
    set((state) => {
      if (state.data) {
        const newData = [...state.data];
        newData.splice(index, 1);
        return {
          data: newData,
        };
      }
      return state;
    }),
  updateQuestion: (index, updatedFields) =>
    set((state) => {
      if (state.data) {
        const newData = [...state.data];
        newData[index] = { ...newData[index], ...updatedFields };
        return {
          data: newData,
        };
      }
      return state;
    }),
}));