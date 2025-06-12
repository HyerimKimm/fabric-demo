import * as fabric from 'fabric'; // v6

import brushIcon from '../../assets/images/hugeicons_brush.svg';
import cursorIcon from '../../assets/images/ph_cursor-bold.svg';
import eraserIcon from '../../assets/images/tabler_eraser.svg';
import saveIcon from '../../assets/images/lucide_save.svg';
import fillIcon from '../../assets/images/bxs_color-fill.svg';
import textIcon from '../../assets/images/solar_text-bold.svg';

import classes from './Tools.module.scss';

import { useState, useEffect, useCallback } from 'react';

type ToolType = 'select' | 'pen' | 'delete' | 'fill' | 'text';

function Tools ({ canvas }: {canvas: fabric.Canvas }) {
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [brush, setBrush] = useState<fabric.PencilBrush | null>(null);
  const [fill, setFill] = useState(canvas.backgroundColor);

  function handleSaveButtonClick () {
    const dataUrl = canvas.toDataURL({
      multiplier: 1, // 해상도
      format: 'png',
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'whiteboard.png';
    link.click();
  }

  function handleSelectFillClick () {
    setActiveTool('fill')
  }

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
    setActiveTool('text')
  }

  /* 배경색 설정 */
  const setFillColor = (color: string) => {
    canvas.backgroundColor = color;
    setFill(color);
    canvas.renderAll();
  }

  /* 펜툴 설정 */
  const setPenTool = useCallback((color?: string, width?: number) => {
    if(!canvas) return;

    canvas.isDrawingMode = true;

    // Fabric v6에서는 brush를 직접 생성해줘야 함
    const brush = new fabric.PencilBrush(canvas); // ✅ 직접 생성
    brush.color = color || '#000000';
    brush.width = width || 4;

    canvas.freeDrawingBrush = brush; // ✅ 명시적으로 설정
    setBrush(brush);
  }, [canvas]);

  /* 펜툴 설정 날림 */
  const clearPenTool = useCallback(()=>{
    canvas.isDrawingMode = false;
    canvas.freeDrawingBrush = undefined;
    setBrush(null);
  }, [canvas])

  const addTextbox = useCallback((opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
    const pointer = canvas.getScenePoint(opt.e);

    const textbox = new fabric.Textbox('Edit me', {
      left: pointer.x,
      top: pointer.y,
      width: 200,
      fontFamily: 'Courier New',
      fontSize: 20,
      fill: '#000000',
      editable: true,
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);

    setActiveTool('select');
    canvas.defaultCursor = 'default';
  }, [canvas]);

  /* 현재 선택된 객체들을 삭제하는 메소드 */
  const handleDeleteObject = useCallback((e: fabric.CanvasEvents["selection:created"])=>{
    const selected = e.selected;

    if(selected?.length > 0) {
      selected.forEach(obj => canvas?.remove(obj));
      canvas?.discardActiveObject();
    }
  }, [canvas])

  useEffect(() => {
    if(!canvas) return;

    clearPenTool(); // 펜 사용 설정 해제

    if(activeTool==='pen') {
        canvas.discardActiveObject();
        setPenTool();
    } else if(activeTool==='delete') {
        canvas.discardActiveObject();
        canvas.on('selection:created', handleDeleteObject);
        canvas.on('selection:updated', handleDeleteObject);
    } else if (activeTool==='text') {
      canvas.defaultCursor = 'text';
      canvas.on('mouse:up', addTextbox);
    }
    
    canvas.requestRenderAll();

    return ()=>{
        canvas.off('selection:created', handleDeleteObject);
        canvas.off('selection:updated', handleDeleteObject);
        canvas.off('mouse:up', addTextbox);
    }
  },[activeTool, canvas, handleDeleteObject, clearPenTool, setPenTool, addTextbox]);

    return (
        <div className={classes.tool_wrap}>
          <button title="저장하기" onClick={handleSaveButtonClick} className={classes.tool_button}>
            <img src={saveIcon} />
          </button>
          <button title="선택" onClick={handleSelectButtonClick} className={`${classes.tool_button} ${activeTool==='select'? classes.selected : undefined}`}>
            <img src={cursorIcon} />
          </button>
          <button title="배경색" onClick={handleSelectFillClick} className={`${classes.tool_button} ${activeTool==='fill'? classes.selected : undefined}`}>
            <img src={fillIcon} />
          </button>
          <button title="펜" onClick={handlePenButtonClick} className={`${classes.tool_button} ${activeTool==='pen'? classes.selected : undefined}`}>
            <img src={brushIcon} />
          </button>
          <button title="텍스트" onClick={handleTextButtonClick} className={`${classes.tool_button} ${activeTool==='text'? classes.selected : undefined}`}>
            <img src={textIcon} />
          </button>
          <button title="지우개" onClick={handleDeleteButtonClick} className={`${classes.tool_button} ${activeTool==='delete'? classes.selected : undefined}`}>
            <img src={eraserIcon} />
          </button>
          {activeTool==='pen' && (
            <div className={classes.sub_tool_wrap}>
              <button className={classes.tool_button} onClick={()=>{ setPenTool('#ff0000', 4) }}>
                <span className={`${classes.palette} ${brush?.color==='#ff0000' ? classes.selected : undefined}`} style={{ backgroundColor: '#ff0000' }} />
              </button>
               <button className={classes.tool_button} onClick={()=>{ setPenTool('#ffff00', 4) }}>
                <span className={`${classes.palette} ${brush?.color==='#ffff00' ? classes.selected : undefined}`} style={{ backgroundColor: '#ffff00' }} />
              </button>
              <button className={classes.tool_button} onClick={()=>{ setPenTool('#007700', 4) }}>
                <span className={`${classes.palette} ${brush?.color==='#007700' ? classes.selected : undefined}`} style={{ backgroundColor: '#007700' }} />
              </button>
              <button className={classes.tool_button} onClick={()=>{ setPenTool('#0000ff', 4) }}>
                <span className={`${classes.palette} ${brush?.color==='#0000ff' ? classes.selected : undefined}`} style={{ backgroundColor: '#0000ff' }} />
              </button>
             <button className={classes.tool_button} onClick={()=>{ setPenTool('#880088', 4) }}>
                <span className={`${classes.palette} ${brush?.color==='#880088' ? classes.selected : undefined}`} style={{ backgroundColor: '#880088' }} />
              </button>
              <button className={classes.tool_button} onClick={()=>{ setPenTool('#000000', 4) }}>
                <span className={`${classes.palette} ${brush?.color==='#000000' ? classes.selected : undefined}`} style={{ backgroundColor: '#000000' }} />
              </button>
            </div>
          )}
          {activeTool==='fill' && (
            <div className={classes.sub_tool_wrap}>
              <button className={classes.tool_button} onClick={()=>{ setFillColor('#ffffff') }}>
                <span className={`${classes.palette} ${fill==='#ffffff' ? classes.selected : undefined}`} style={{ backgroundColor: '#ffffff' }} />
              </button>
              <button className={classes.tool_button} onClick={()=>{ setFillColor('#ffdddf') }}>
                <span className={`${classes.palette} ${fill==='#ffdddf' ? classes.selected : undefined}`} style={{ backgroundColor: '#ff0000' }} />
              </button>
               <button className={classes.tool_button} onClick={()=>{ setFillColor('#ffffdd') }}>
                <span className={`${classes.palette} ${fill==='#ffffdd' ? classes.selected : undefined}`} style={{ backgroundColor: '#ffff00' }} />
              </button>
              <button className={classes.tool_button} onClick={()=>{ setFillColor('#ddffdd') }}>
                <span className={`${classes.palette} ${fill==='#ddffdd' ? classes.selected : undefined}`} style={{ backgroundColor: '#007700' }} />
              </button>
              <button className={classes.tool_button} onClick={()=>{ setFillColor('#ccccff') }}>
                <span className={`${classes.palette} ${fill==='#ccccff' ? classes.selected : undefined}`} style={{ backgroundColor: '#0000ff' }} />
              </button>
             <button className={classes.tool_button} onClick={()=>{ setFillColor('#eeccff') }}>
                <span className={`${classes.palette} ${fill==='#eeccff' ? classes.selected : undefined}`} style={{ backgroundColor: '#880088' }} />
              </button>
            </div>
          )}
        </div>
    )
}

export default Tools;