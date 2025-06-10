import * as fabric from 'fabric'; // v6
import brushIcon from '../../assets/images/hugeicons_brush.svg';
import cursorIcon from '../../assets/images/ph_cursor-bold.svg';
import eraserIcon from '../../assets/images/tabler_eraser.svg';
import textIcon from '../../assets/images/solar_text-bold.svg';
import classes from './Tools.module.scss';
import { useState, useEffect } from 'react';

type ToolType = 'select' | 'pen' | 'delete';

function Tools ({ canvas }: {canvas: fabric.Canvas }) {
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

  /* 펜툴 설정 */
  function setPenTool () {
    if(!canvas) return;

    canvas.isDrawingMode = true;

    // Fabric v6에서는 brush를 직접 생성해줘야 함
    const brush = new fabric.PencilBrush(canvas); // ✅ 직접 생성
    brush.color = '#000000';
    brush.width = 4;

    canvas.freeDrawingBrush = brush; // ✅ 명시적으로 설정
  }

  /* 펜툴 설정 날림 */
  function clearPenTool () {
    canvas.isDrawingMode = false;
    canvas.freeDrawingBrush = undefined;
  }

  /* 현재 선택된 객체들을 삭제하는 메소드 */
  function handleDeleteObject (e: fabric.CanvasEvents["selection:created"]) {
    const selected = e.selected;

    if(selected?.length > 0) {
      selected.forEach(obj => canvas?.remove(obj));
      canvas?.discardActiveObject();
    }
  }

  useEffect(()=>{
    if(!canvas) return;

    clearPenTool();

    if(activeTool==='pen') {
        canvas.discardActiveObject();
        setPenTool();
    } else if(activeTool==='delete') {
        canvas.discardActiveObject();
        canvas.on('selection:created', handleDeleteObject);
        canvas.on('selection:updated', handleDeleteObject);
    }

    
    canvas.requestRenderAll();

    return ()=>{
      if(activeTool==='pen'){
        clearPenTool()
      } else if(activeTool==='delete') {
        canvas.off('selection:created', handleDeleteObject);
        canvas.off('selection:updated', handleDeleteObject);
      }
    }
  },[activeTool, canvas]);


    return (
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
        </div>
    )
}

export default Tools;