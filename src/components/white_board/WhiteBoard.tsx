import classes from './WhiteBoard.module.scss';
import * as fabric from 'fabric'; // v6
import { useState, useEffect, useRef } from 'react';

import Tools from '../side_tool/SideTool';
import ObjectTool from '../object_tool/ObjectTool';
import { ObjectTypeType } from '../../types';

function WhiteBoard() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // canvas 객체 참조용

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // Fabric.js를 사용하여 생성한 캔버스 객체의 상태를 저장하는 용도로 사용
  const [objectTool, setObjectTool] = useState<{
    type: ObjectTypeType;
    x: number;
    y: number;
  } | null>(null);

  /* 캔버스 초기 세팅 */
  useEffect(() => {
    if (canvasRef.current && canvasContainerRef.current) {
      const canvasConatainer = canvasContainerRef.current;

      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasConatainer.offsetWidth,
        height: canvasConatainer.offsetHeight,
        backgroundColor: '#ffffff',
      });

      setCanvas(newCanvas);

      /* 캔버스 사이즈를 부모 요소에 맞추기 */
      const handleResize = () => {
        newCanvas.setDimensions({
          width: canvasConatainer.offsetWidth,
          height: canvasConatainer.offsetHeight,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        newCanvas.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  /* 객체가 선택되었을 때 객체 툴바 띄워주기 */
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();

      if (activeObj) {
        const boundingRect = activeObj.getBoundingRect();
        console.log(activeObj.type);
        setObjectTool({
          type: activeObj.type,
          x: boundingRect.left,
          y: boundingRect.top, // 도구바가 객체 위에 떠 있도록
        });
      } else {
        setObjectTool(null);
      }
    };

    const clearToolbarPosition = () => {
      setObjectTool(null);
    };

    canvas.on('selection:created', handleSelection); // 객체 선택 시
    canvas.on('selection:updated', handleSelection); // 다른 객체 선택 시
    canvas.on('selection:cleared', clearToolbarPosition); // 객체 선택 해제 시
    canvas.on('object:scaling', clearToolbarPosition); // 객체 크기조절 중일 때
    canvas.on('object:moving', clearToolbarPosition); // 객체 이동중일 때
    canvas.on('object:rotating', clearToolbarPosition); // 객체 회전중일 때
    canvas.on('object:modified', handleSelection); // 객체 수정 완료 후

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', clearToolbarPosition);
      canvas.off('object:scaling', clearToolbarPosition);
      canvas.off('object:moving', clearToolbarPosition);
      canvas.off('object:rotating', clearToolbarPosition);
      canvas.off('object:modified', handleSelection);
    };
  }, [canvas]);

  return (
    <div className={classes.board_wrap}>
      <div
        ref={canvasContainerRef}
        className={classes.canvas_wrap}
        style={{ backgroundColor: '#fff' }}
      >
        <canvas ref={canvasRef} className={classes.canvas} />
      </div>
      {/* 도구모음 */}
      {canvas && <Tools canvas={canvas} />}
      {/* 인라인 도구 */}
      {objectTool && canvas && (
        <ObjectTool canvas={canvas} objectTool={objectTool} />
      )}
    </div>
  );
}

export default WhiteBoard;
