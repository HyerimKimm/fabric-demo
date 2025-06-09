import classes from './App.module.scss';
import * as fabric from 'fabric'; // v6
import { useState, useEffect, useRef } from 'react';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // canvas 객체 참조용

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // Fabric.js를 사용하여 생성한 캔버스 객체의 상태를 저장하는 용도로 사용
  const [activeTool, setActiveTool] = useState("");

  function handlePenButtonClick () {
    setActiveTool('pen');
  }

  function handleSelectButtonClick () {
    setActiveTool('select');
  }

  function handleDeleteButtonClick () {
    if(!canvas) return;

    setActiveTool('select');

    const activeObjects = canvas.getActiveObjects();

    if (activeObjects.length) {
      activeObjects.forEach(obj => canvas.remove(obj)); // 선택된 모든 객체 제거
      canvas.discardActiveObject(); // 선택 해제
      canvas.requestRenderAll();    // 캔버스 리렌더링
    }
  }
  
  /* 캔버스 초기 세팅 */
  useEffect(()=>{
    if(canvasRef.current && canvasContainerRef.current ) {
      const canvasConatainer = canvasContainerRef.current;

      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasConatainer.offsetWidth,
        height: canvasConatainer.offsetHeight,
      });

      /* 마우스 휠로 zoom in, zoom out 기능을 사용하도록 설정하기 */
      newCanvas.on("mouse:wheel", (opt: fabric.TPointerEventInfo<WheelEvent>)=>{
        const delta = opt.e.deltaY;

        let zoom: number = newCanvas.getZoom();

        zoom *= 0.999 ** delta;

        if(zoom>20) zoom = 20;
        if(zoom<0.01) zoom = 0.01;

        const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY); // Fabric.js가 사용하는 좌표 객체

        newCanvas.zoomToPoint(point, zoom);

        opt.e.preventDefault();
        opt.e.stopPropagation();
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

  /* 도구 선택 시 캔버스 모드 설정 */
  useEffect(()=>{
    if(!canvas) return;

    function setPenTool () {
      if(!canvas) return;

      canvas.isDrawingMode = true;

      // Fabric v6에서는 brush를 직접 생성해줘야 함
      const brush = new fabric.PencilBrush(canvas); // ✅ 직접 생성
      brush.color = '#000000';
      brush.width = 4;

      canvas.freeDrawingBrush = brush; // ✅ 명시적으로 설정
    }

    function setSelectTool () {
      if(!canvas) return;

      canvas.isDrawingMode = false;
    }

    switch(activeTool) {
      case "pen": 
        setPenTool();
        break;
      case "select" : 
        setSelectTool();
        break;
      default: break;
    }
  },[activeTool, canvas]);

  return (
    <div className={classes.page_wrap}>
      <div ref={canvasContainerRef} className={classes.canvas_wrap}>
      <canvas ref={canvasRef} className={classes.canvas} />
    </div>
      <div className={classes.tool_wrap}>
        <button onClick={handleSelectButtonClick} className={classes.tool_button}>선택</button>
        <button onClick={handlePenButtonClick} className={classes.tool_button}>펜</button>
        <button onClick={handleDeleteButtonClick} className={classes.tool_button}>삭제</button>
      </div>
    </div>
  );
}

export default App;
