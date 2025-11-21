import { useState } from 'react';
import { AnswerStep } from '@/types';

interface AddQuestionFormProps {
  onAdd: (newQuestion: any) => void;
  onCancel: () => void;
}

export default function AddQuestionForm({ onAdd, onCancel }: AddQuestionFormProps) {
  const [questionNumber, setQuestionNumber] = useState('');
  const [newStep, setNewStep] = useState<AnswerStep>({ 
     step_id: 1, 
     is_correct: true, 
     is_location_correct: true,
     analysis: '', 
     student_answer: '', 
     answer_location: [],
     analysis_acceptability: '合格'
   }); 
   const [questionType, setQuestionType] = useState('objective'); 
  const [isCorrect, setIsCorrect] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      question_number: questionNumber,
      question_type: questionType as 'objective' | 'subjective',
      answer_steps: [{
        step_id: 1,
        step_text: '',
        is_correct: isCorrect,
        analysis: '',
        answer_location: [],
        analysis_acceptability: '合格',
      }],
      isAdded: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">添加新题目</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="question_number" className="block text-sm font-medium text-gray-700 mb-1">题号</label>
            <input
              type="text"
              id="question_number"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
            />
          </div>
          <div>
            <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-1">题目类型</label>
            <select
              id="question_type"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            >
              <option value="objective">客观题</option>
              <option value="subjective">主观题</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">是否正确</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="is_correct"
                  checked={isCorrect}
                  onChange={() => setIsCorrect(true)}
                  className="form-radio h-5 w-5 text-blue-600 transition-colors"
                />
                <span className="ml-2 text-gray-700">正确</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="is_correct"
                  checked={!isCorrect}
                  onChange={() => setIsCorrect(false)}
                  className="form-radio h-5 w-5 text-red-600 transition-colors"
                />
                <span className="ml-2 text-gray-700">错误</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}