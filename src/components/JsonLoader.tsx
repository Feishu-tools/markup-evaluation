import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useGradingStore } from '@/stores/gradingStore';
import { GradingData } from '@/types';

export default function JsonLoader() {
  const { setData } = useGradingStore();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadData = () => {
    try {
      const parsedData = JSON.parse(jsonInput) as GradingData;
      if (!Array.isArray(parsedData)) {
        throw new Error('JSON数据格式错误：应为数组');
      }
      setData(parsedData);
      setError('');
      setJsonInput('');
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON解析失败');
    }
  };

  const loadDefaultData = async (fileName: string) => {
    try {
      const response = await fetch(`./${fileName}`);
      if (!response.ok) {
        throw new Error(`无法加载默认数据文件: ${fileName}`);
      }
      const data = await response.json() as GradingData;
      setData(data);
      setError('');
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载默认数据失败');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
        aria-label="上传数据"
      >
        <Upload size={24} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="关闭"
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4">上传评分数据</h3>
            <div className="space-y-4">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="在此输入JSON数据..."
                className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg font-mono text-xs resize-none focus:border-blue-500 focus:outline-none transition-colors"
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLoadData}
                  disabled={!jsonInput.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  加载数据
                </button>
                
                <button
                  onClick={() => loadDefaultData('1.json')}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  加载默认数据 1
                </button>
                <button
                  onClick={() => loadDefaultData('2.json')}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
                >
                  加载默认数据 2
                </button>
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200 mt-3">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}