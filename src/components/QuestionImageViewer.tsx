import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Expand } from 'lucide-react';
import { useGradingStore } from '@/stores/gradingStore';
import { useEffect, useRef, useState } from 'react';

export default function QuestionImageViewer() {
  const { selectedQuestionImage, selectedLocations } = useGradingStore();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformWrapperRef = useRef<ReactZoomPanPinchContentRef>(null);

  const colors = ['border-red-500', 'border-blue-500', 'border-green-500', 'border-yellow-500', 'border-purple-500', 'border-pink-500'];
  const textColors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500'];

  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;
    const transformWrapper = transformWrapperRef.current;

    if (image && container && transformWrapper) {
      const handleLoad = () => {
        const { naturalWidth, naturalHeight } = image;
        const { clientWidth, clientHeight } = container;
        
        setImageSize({ width: naturalWidth, height: naturalHeight });

        if (naturalHeight > 0 && clientHeight > 0) {
          const newScale = clientHeight / naturalHeight;
          const newPositionX = (clientWidth - naturalWidth * newScale) / 2;
          
          transformWrapper.setTransform(newPositionX, 0, newScale, 200, 'easeOut');
          setScale(newScale);
        }
      };

      image.addEventListener('load', handleLoad);
      if (image.complete) {
        handleLoad();
      }

      return () => image.removeEventListener('load', handleLoad);
    }
  }, [selectedQuestionImage]);

  if (!selectedQuestionImage) {
    return <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden"><div className="text-gray-500 text-lg">点击右侧卡片查看题目图片</div></div>;
  }

  const renderRectangles = () => {
    if (!selectedLocations) return null;

    return selectedLocations.map((location, index) => {
      if (location.length !== 4) return null;
      const [x1, y1, x2, y2] = location;
      const color = colors[index % colors.length];
      const textColor = textColors[index % textColors.length];

      return (
        <div key={index}>
          <div
            className={`absolute ${color} border-2 pointer-events-none`}
            style={{
              left: `${x1 * scale}px`,
              top: `${y1 * scale}px`,
              width: `${(x2 - x1) * scale}px`,
              height: `${(y2 - y1) * scale}px`,
            }}
          />
          <span
            className={`absolute ${textColor} font-bold pointer-events-none`}
            style={{
              left: `${x1 * scale - 20}px`,
              top: `${y1 * scale}px`,
              fontSize: `${16 * scale}px`,
            }}
          >
            {index + 1}
          </span>
        </div>
      );
    });
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
      <TransformWrapper
        ref={transformWrapperRef}
        onTransformed={(ref, state) => setScale(state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: imageSize.width, height: imageSize.height }}
            >
              <div style={{ position: 'relative', width: imageSize.width, height: imageSize.height }}>
                <img 
                  ref={imageRef}
                  src={selectedQuestionImage} 
                  alt="Question" 
                  style={{ display: 'block', width: '100%', height: '100%' }}
                />
                {renderRectangles()}
              </div>
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