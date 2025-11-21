export interface AnswerStep {
  step_id: number;
  student_answer: string;
  is_correct: boolean;
  is_location_correct: boolean;
  analysis: string;
  answer_location: any[];
  analysis_acceptability: '优质' | '合格' | '不可接受';
}

export interface GradingItem {
  question_number: string;
  question_type: 'objective' | 'subjective';
  question_text: string;
  answer_steps: AnswerStep[];
  isAdded?: boolean;
  description?: string;
  image_url?: string; 
  actual_is_correct?: '正确' | '错误';
  actual_question_type?: '主观' | '客观';
}

export interface JsonDataItem {
  image_url: string;
  markup_status: string;
  questions_info: GradingItem[];
}

export type GradingData = JsonDataItem[];

export interface Stats {
  objective: number;
  subjective: number;
  total: number;
}