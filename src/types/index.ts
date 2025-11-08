export interface GradingItem {
  question_number: string;
  question_type: 'objective' | 'subjective';
  question_text: string;
  student_answer: string;
  is_correct: boolean;
  analysis: string;
  image?: string;
  steps?: Array<{
    step_id: number;
    step_text: string;
    is_correct: boolean;
    feedback: string;
  }>;
  isAdded?: boolean;
  actual_is_correct?: '正确' | '错误';
  actual_question_type?: '主观' | '客观';
  analysis_acceptability?: '优质' | '合格' | '不可接受';
  description?: string;
}

export interface GradingData {
  grading_report: GradingItem[];
}

export interface Stats {
  objective: number;
  subjective: number;
  total: number;
}