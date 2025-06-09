import classes from './App.module.scss';
import * as fabric from 'fabric'; // v6
import { useState, useEffect, useRef } from 'react';

import brushIcon from './assets/images/hugeicons_brush.svg';
import cursorIcon from './assets/images/ph_cursor-bold.svg';
import eraserIcon from './assets/images/tabler_eraser.svg';
import textIcon from './assets/images/solar_text-bold.svg';

type ToolType = 'select' | 'pen' | 'delete' | 'text';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // canvas 객체 참조용

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // Fabric.js를 사용하여 생성한 캔버스 객체의 상태를 저장하는 용도로 사용
  const [activeTool, setActiveTool] = useState<ToolType>("select");

  function handlePenButtonClick () {
    setActiveTool('pen');
  }

  function handleSelectButtonClick () {
    setActiveTool('select');
  }

  function handleDeleteButtonClick () {
    setActiveTool('delete');
  }

  function handleTextButtonClick () {
    setActiveTool('text');
  }
  
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

    function handleDeleteObject (e: fabric.CanvasEvents["selection:created"]) {
      const selected = e.selected;

      if(selected?.length > 0) {
        selected.forEach(obj => canvas?.remove(obj));
        canvas?.discardActiveObject();
        canvas?.requestRenderAll();
      }
    }

    function addText (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
      if(!canvas) return;

      const pointer = canvas.getScenePoint(opt.e);

      const textbox = new fabric.Textbox('Edit me', {
        left: pointer.x,
        top: pointer.y,
        width: 200,
        fontSize: 20,
        fill: '#000'
      });

      canvas.add(textbox);
      canvas.setActiveObject(textbox);
      canvas.requestRenderAll();
      
       setActiveTool("select");
    }

    switch(activeTool) {
      case "pen": 
        setPenTool();
        break;
      case "select" : 
        canvas.isDrawingMode = false;
        break;
      case "delete": 
        canvas.isDrawingMode = false;
        canvas.hoverCursor = 'pointer';
        canvas.on('selection:created', handleDeleteObject);
        canvas.on('selection:updated', handleDeleteObject);
        break;
      case "text": 
        canvas.on('mouse:down', addText);
        break;
      default: break;
    }

    return ()=>{
      canvas.off('selection:created', handleDeleteObject);
      canvas.off('selection:updated', handleDeleteObject);
      canvas.off('mouse:down', addText)
    }
  },[activeTool, canvas]);

  return (
    <div className={classes.page_wrap}>
      <div ref={canvasContainerRef} className={classes.canvas_wrap}>
        <canvas ref={canvasRef} className={classes.canvas} />
      </div>
      <div className={classes.tool_wrap}>
        <button onClick={handleSelectButtonClick} className={`${classes.tool_button} ${activeTool==='select'? classes.selected : undefined}`}>
          <img src={cursorIcon} />
        </button>
        <button onClick={handlePenButtonClick} className={`${classes.tool_button} ${activeTool==='pen'? classes.selected : undefined}`}>
          <img src={brushIcon} />
        </button>
        <button onClick={handleDeleteButtonClick} className={`${classes.tool_button} ${activeTool==='delete'? classes.selected : undefined}`}>
          <img src={eraserIcon} />
        </button>
        <button  onClick={handleTextButtonClick} className={`${classes.tool_button} ${activeTool==='text'? classes.selected : undefined}`}>
          <img src={textIcon} />
        </button>
      </div>
    </div>
  );
}

export default App;
