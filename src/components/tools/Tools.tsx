import * as fabric from 'fabric'; // v6
import brushIcon from '../../assets/images/hugeicons_brush.svg';
import cursorIcon from '../../assets/images/ph_cursor-bold.svg';
import eraserIcon from '../../assets/images/tabler_eraser.svg';
import textIcon from '../../assets/images/solar_text-bold.svg';
import classes from './Tools.module.scss';
import { useState, useEffect } from 'react';

type ToolType = 'select' | 'pen' | 'delete' | 'text';

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

  function handleTextButtonClick () {
    setActiveTool('text');
  }

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
        width: 150,
        fontSize: 30,
        fill: '#000',
        editable: true,
        selectable: true,
        evented: true,
      });

      canvas.add(textbox); // 텍스트 박스 추가
      textbox.enterEditing(); // 텍스트 박스 객체 편집모드 설정하기
      textbox.selectAll(); // 입력된 텍스트 전체 선택
      canvas.setActiveObject(textbox); // 캔버스에서 현재 선택된 오브젝트를 이 textbox로 설정
      canvas.requestRenderAll(); // 모든 변경 사항을 캔버스 화면에 반영
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

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    return ()=>{
      canvas.off('selection:created', handleDeleteObject);
      canvas.off('selection:updated', handleDeleteObject);
      canvas.off('mouse:down', addText);
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
          <button  onClick={handleTextButtonClick} className={`${classes.tool_button} ${activeTool==='text'? classes.selected : undefined}`}>
            <img src={textIcon} />
          </button>
        </div>
    )
}

export default Tools;