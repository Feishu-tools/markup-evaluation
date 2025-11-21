import { useGradingStore } from '@/stores/gradingStore';
import { GradingItem, AnswerStep } from '@/types';

export default function QuestionDetail() {
  const { data, selectedCardIndex, updateQuestion } = useGradingStore();

  if (selectedCardIndex === -1 || !data?.[selectedCardIndex]) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        请选择一道题目查看详情
      </div>
    );
  }

  const item = data[selectedCardIndex];
  const questionTypeText = item.question_type === 'objective' ? '客观题' : 
                           item.question_type === 'subjective' ? '主观题' : '未知类型';

  const handleFieldChange = (field: keyof GradingItem | keyof AnswerStep, value: any, stepIndex?: number) => {
    if (typeof stepIndex === 'number' && item.answer_steps[stepIndex]) {
      const newAnswerSteps = [...item.answer_steps];
      newAnswerSteps[stepIndex] = { ...newAnswerSteps[stepIndex], [field]: value };
      updateQuestion(selectedCardIndex, { answer_steps: newAnswerSteps });
    } else {
      updateQuestion(selectedCardIndex, { [field as keyof GradingItem]: value });
    }
  };
  
  const firstStep = item.answer_steps?.[0];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-800">题目详情</h3>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="actual_is_correct" className="block text-sm font-medium text-gray-700">* 实际学生作答是否正确</label>
            <select
              id="actual_is_correct"
              name="actual_is_correct"
              value={item.actual_is_correct || ''}
              onChange={(e) => handleFieldChange('actual_is_correct', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">--</option>
              <option value="正确">正确</option>
              <option value="错误">错误</option>
            </select>
          </div>
          <div>
            <label htmlFor="actual_question_type" className="block text-sm font-medium text-gray-700">* 实际题目类型</label>
            <select
              id="actual_question_type"
              name="actual_question_type"
              value={item.actual_question_type || ''}
              onChange={(e) => handleFieldChange('actual_question_type', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">--</option>
              <option value="客观">客观（选择填空）</option>
              <option value="主观">主观</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-150 rounded-lg p-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-500">备注（可选，分析的问题）</label>
        <textarea
          id="description"
          name="description"
          value={item.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm rounded-md"
          rows={3}
        />
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto mt-4">
        <div>
          <div className="font-bold text-gray-700 mb-1">题号</div>
          <div className="text-gray-600">{item.question_number}</div>
        </div>
        
        <div>
          <div className="font-bold text-gray-700 mb-1">题目类型</div>
          <div className="text-gray-600">{questionTypeText}</div>
        </div>
        
        <div>
          <div className="font-bold text-gray-700 mb-1">题目文本</div>
          <div className="text-gray-600 bg-gray-50 p-2 rounded">{item.question_text}</div>
        </div>

        {firstStep && (
          <>
            <div>
              <div className="font-bold text-gray-700 mb-1">学生答案</div>
              <div className="text-gray-600 bg-gray-50 p-2 rounded">{firstStep.student_answer}</div>
            </div>
            
            {firstStep.analysis && (
              <div>
                <div className="font-bold text-gray-700 mb-1">解析</div>
                <div className="text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                  {firstStep.analysis}
                </div>
              </div>
            )}
          </>
        )}
        
        {item.answer_steps && item.answer_steps.length > 0 && (
          <div>
            <div className="font-bold text-gray-700 mb-2">解题步骤</div>
            <div className="space-y-2">
              {item.answer_steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border-l-3 ${
                    step.is_correct 
                      ? 'bg-green-50 border-green-500 border-l-4' 
                      : 'bg-red-50 border-red-500 border-l-4'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-700">
                      <span className="font-medium">步骤 {index + 1}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        step.is_correct 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {step.is_correct ? '正确' : '错误'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-2/3">
                      <div className="w-1/2">
                        <label htmlFor={`is_location_correct_${index}`} className="sr-only">定位是否正确</label>
                        <select
                          id={`is_location_correct_${index}`}
                          name={`is_location_correct_${index}`}
                          value={step.is_location_correct ? '正确' : '错误'}
                          onChange={(e) => handleFieldChange('is_location_correct', e.target.value === '正确', index)}
                          className="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                          <option value="正确">正确</option>
                          <option value="错误">错误</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label htmlFor={`analysis_acceptability_${index}`} className="sr-only">解析可接受度</label>
                        <select
                          id={`analysis_acceptability_${index}`}
                          name={`analysis_acceptability_${index}`}
                          value={step.analysis_acceptability || ''}
                          onChange={(e) => handleFieldChange('analysis_acceptability', e.target.value, index)}
                          className="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                          <option value="" disabled>解析可接受度</option>
                          <option value="优质">优质</option>
                          <option value="合格">合格</option>
                          <option value="不可接受">不可接受</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">学生答案</div>
                    <div className="text-gray-600">{step.student_answer}</div>
                  </div>
                  {step.analysis && (
                    <div className="text-gray-500 text-sm mt-1 italic">
                      {step.analysis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}