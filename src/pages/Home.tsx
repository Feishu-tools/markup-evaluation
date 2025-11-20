import { useEffect } from 'react';
import { useGradingStore } from '@/stores/gradingStore';
import QuestionImageViewer from '@/components/QuestionImageViewer';
import StatsPanel from '@/components/StatsPanel';
import GradingCards from '@/components/GradingCards';
import QuestionDetail from '@/components/QuestionDetail';
import toast from 'react-hot-toast';

import { isValidGradingData } from '@/lib/utils';

export default function Home() {
  const { selectedQuestionImage, setData, selectCard, selectedCardIndex } = useGradingStore();

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData('text');
      if (text) {
        try {
          const jsonData = JSON.parse(text);
          if (isValidGradingData(jsonData)) {
            setData(jsonData);
            selectCard(0);
          } else {
            toast.error('Pasted data is not valid GradingData');
            console.error('Pasted data is not valid GradingData');
          }
        } catch (error) {
          toast.error('Failed to parse pasted JSON');
          console.error('Failed to parse pasted JSON:', error);
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [setData]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 font-sans">
      
      <main className="max-h-[100%] flex h-[calc(100vh-2rem)] gap-4">
        {/* Left Panel: Image Viewer */}
        <div className="w-3/5 flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex-1 min-h-0">
            <QuestionImageViewer imageUrl={selectedQuestionImage} />
          </div>
        </div>

        {/* Right Panel: Details */}
        <div className="w-2/5 flex flex-col gap-4">
          <div className="h-3/10 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <GradingCards />
          </div>
          <div className="h-7/10 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <QuestionDetail />
          </div>
        </div>
      </main>

        <button
          onClick={() => {
          try {
            const data = useGradingStore.getState().data;
            if (data) {
              const isAllFilled = data.every((item) => {
                const firstStep = item.answer_steps?.[0];
                return (
                  firstStep?.actual_is_correct &&
                  firstStep?.actual_question_type &&
                  firstStep?.analysis_acceptability
                );
              });

              if (!isAllFilled) {
                toast.error('请填写所有必填字段后再导出。');
                return;
              }
            }

            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            toast.success('已成功导出到剪贴板！');
          } catch (error) {
            console.log(error)
            toast.error('导出到剪贴板失败。');
          }
        }}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          导出
        </button>
    </div>
  );
}