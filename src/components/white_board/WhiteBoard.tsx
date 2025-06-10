import classes from './WhiteBoard.module.scss';
import * as fabric from 'fabric'; // v6
import { useState, useEffect, useRef } from 'react';

import Tools from '../tools/Tools';

function WhiteBoard () {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // canvas 객체 참조용

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // Fabric.js를 사용하여 생성한 캔버스 객체의 상태를 저장하는 용도로 사용
  
  /* 캔버스 초기 세팅 */
  useEffect(()=>{
    if(canvasRef.current && canvasContainerRef.current ) {
      const canvasConatainer = canvasContainerRef.current;

      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasConatainer.offsetWidth,
        height: canvasConatainer.offsetHeight,
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
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
      <div className={classes.board_wrap}>
        <div 
          ref={canvasContainerRef} 
          className={classes.canvas_wrap} 
          style={{ backgroundColor: '#fff' }}>
            <canvas ref={canvasRef} className={classes.canvas} />
        </div>
        {/* 도구모음 */}
        {canvas && <Tools canvas={canvas} />}
      </div>
  );
}

export default WhiteBoard;