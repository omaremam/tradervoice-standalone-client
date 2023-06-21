import React, { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingBoard = () => {
  const stageRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setStartPoint(point);
    setEndPoint(point);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const updatedLines = lines.concat([{ ...startPoint }, { ...endPoint }]);
    setLines(updatedLines);
  };

  const handleMouseMove = () => {
    if (!isDrawing) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setEndPoint(point);
  };

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      <Stage
        width={1010}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, index) => {
            if (index % 2 === 0 && index !== lines.length - 1) {
              const nextPoint = lines[index + 1];
              return (
                <Line
                  key={index}
                  points={[line.x, line.y, nextPoint.x, nextPoint.y]}
                  stroke="black"
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  dash={[5, 5]} // Add dashed line style
                />
              );
            }
            return null;
          })}
          {/* Render the current line */}
          {isDrawing && (
            <Line
              points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
              stroke="black"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              dash={[5, 5]} // Add dashed line style
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingBoard;
