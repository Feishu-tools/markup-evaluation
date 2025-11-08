import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Expand } from 'lucide-react';

interface QuestionImageViewerProps {
  imageUrl: string | null;
}

export default function QuestionImageViewer({ imageUrl }: QuestionImageViewerProps) {
  if (!imageUrl) {
    return <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden"><div className="text-gray-500 text-lg">点击右侧卡片查看题目图片</div></div>;
  }

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentClass="w-full h-full flex items-center justify-center"
            >
              <img src={imageUrl} alt="Question" className="max-w-full max-h-full object-contain" />
            </TransformComponent>
            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              <button onClick={() => zoomOut()} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => zoomIn()} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => resetTransform()} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                <Expand className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}