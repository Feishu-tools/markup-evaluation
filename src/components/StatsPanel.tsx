import { useGradingStore } from '@/stores/gradingStore';

export default function StatsPanel() {
  const { data } = useGradingStore();
  
  const stats = data?.grading_report.reduce(
    (acc, item) => {
      if (item.question_type === 'objective') {
        acc.objective++;
      } else if (item.question_type === 'subjective') {
        acc.subjective++;
      }
      acc.total++;
      return acc;
    },
    { objective: 0, subjective: 0, total: 0 }
  ) || { objective: 0, subjective: 0, total: 0 };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
      <div className="text-sm font-semibold text-gray-700 mb-2 text-center">题目类型统计</div>
      <div className="flex justify-around items-center">
        <div className="text-center">
          <div className="text-xs text-gray-500">客观题</div>
          <div className="text-lg font-bold text-blue-600">{stats.objective}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">主观题</div>
          <div className="text-lg font-bold text-blue-600">{stats.subjective}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">总计</div>
          <div className="text-lg font-bold text-blue-600">{stats.total}</div>
        </div>
      </div>
    </div>
  );
}