import classes from './ObjectTool.module.scss';
import deleteIcon from '../../assets/images/material-symbols_delete-outline.svg';
import fontFamilyIcon from '../../assets/images/qlementine-icons_font-16.svg';
import boldIcon from '../../assets/images/ooui_bold-b.svg';
import * as fabric from 'fabric'; // v6
import { ObjectTypeType } from '../../types';
import { useMemo, useState } from 'react';

function ObjectTool({
  canvas,
  objectTool,
  setObjectTool,
}: {
  canvas: fabric.Canvas;
  objectTool: {
    type: ObjectTypeType;
    x: number;
    y: number;
    activeObj: fabric.FabricObject;
  };
  setObjectTool: (objectTool: {
    type: ObjectTypeType;
    x: number;
    y: number;
    activeObj: fabric.FabricObject;
  }) => void;
}) {
  const [subPopupType, setSubPopupType] = useState<
    'color' | 'fontStyle' | null
  >(null);

  const objectColor = useMemo(() => {
    switch (objectTool.type) {
      case 'activeselection':
        return undefined;
      case 'path':
        return objectTool.activeObj.stroke;
      case 'textbox':
        return objectTool.activeObj.fill;
      default:
        return undefined;
    }
  }, [objectTool]);

  const isBoldTextBox = useMemo(() => {
    return (
      objectTool.type === 'textbox' &&
      (objectTool.activeObj as fabric.Textbox).fontWeight === 'bold'
    );
  }, [objectTool]);

  function handleDeleteClick() {
    const activeObjects = canvas.getActiveObjects();

    if (activeObjects) {
      activeObjects.forEach((activeObject) => {
        canvas.remove(activeObject);
      });

      canvas.discardActiveObject(); // 선택 해제
      canvas.requestRenderAll(); // 캔버스 리랜더링
    }
  }

  function handleFontWeightClick() {
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
      const textbox = activeObject as fabric.Textbox;

      textbox.set(
        'fontWeight',
        textbox.fontWeight === 'bold' ? 'normal' : 'bold'
      );
      canvas.requestRenderAll();
    }

    setObjectTool({
      type: objectTool.type,
      x: objectTool.x,
      y: objectTool.y,
      activeObj: activeObject as fabric.FabricObject,
    });
  }

  function handleFontStyleClick() {
    if (subPopupType === 'fontStyle') {
      setSubPopupType(null);
    } else {
      setSubPopupType('fontStyle');
    }
  }

  function handleFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
      const textbox = activeObject as fabric.Textbox;
      textbox.set('fontFamily', e.target.value);
      canvas.requestRenderAll();
    }

    setObjectTool({
      type: objectTool.type,
      x: objectTool.x,
      y: objectTool.y,
      activeObj: activeObject as fabric.FabricObject,
    });
  }

  function handleColorClick() {
    if (subPopupType === 'color') {
      setSubPopupType(null);
    } else {
      setSubPopupType('color');
    }
  }

  return (
    <div
      className={classes.tool_wrap}
      style={{ left: objectTool.x, top: objectTool.y }}
    >
      {objectTool.type !== 'activeselection' && (
        <button
          title='색상'
          className={`${classes.tool_button} ${subPopupType === 'color' ? classes.selected : ''}`}
          onClick={handleColorClick}
        >
          <span
            className={classes.palette}
            style={{
              backgroundColor: (objectColor as string) || '#0000000',
            }}
          />
          {subPopupType === 'color' && (
            <div
              className={classes.sub_popup_wrap}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button className={classes.tool_button} title='빨간색'>
                <span
                  className={classes.palette}
                  style={{ backgroundColor: '#ff0000' }}
                />
              </button>
              <button className={classes.tool_button} title='노란색'>
                <span
                  className={classes.palette}
                  style={{ backgroundColor: '#ffff00' }}
                />
              </button>
              <button className={classes.tool_button} title='초록색'>
                <span
                  className={classes.palette}
                  style={{ backgroundColor: '#008800' }}
                />
              </button>
              <button className={classes.tool_button} title='파란색'>
                <span
                  className={classes.palette}
                  style={{ backgroundColor: '#0000ff' }}
                />
              </button>
              <button className={classes.tool_button} title='보라색'>
                <span
                  className={classes.palette}
                  style={{ backgroundColor: '#880088' }}
                />
              </button>
              <button className={classes.tool_button} title='검정색'>
                <span
                  className={classes.palette}
                  style={{ backgroundColor: '#000000' }}
                />
              </button>
            </div>
          )}
        </button>
      )}
      {objectTool.type === 'textbox' && (
        <>
          <button
            className={`${classes.tool_button} ${subPopupType === 'fontStyle' ? classes.selected : ''}`}
            title='글꼴 변경하기'
            onClick={handleFontStyleClick}
          >
            <img src={fontFamilyIcon} />
            {subPopupType === 'fontStyle' && (
              <div
                className={classes.sub_popup_wrap}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={classes.font_style_wrap}>
                  <select
                    className={classes.font_style_select}
                    onChange={handleFontFamilyChange}
                    value={
                      (objectTool.activeObj as fabric.Textbox)?.fontFamily ||
                      'Arial'
                    }
                  >
                    <option value='Arial'>Arial</option>
                    <option value='Times New Roman'>Times New Roman</option>
                    <option value='Courier New'>Courier New</option>
                    <option value='Georgia'>Georgia</option>
                    <option value='Verdana'>Verdana</option>
                    <option value='Helvetica'>Helvetica</option>
                  </select>
                </div>
              </div>
            )}
          </button>
          <button
            className={`${classes.tool_button} ${isBoldTextBox ? classes.selected : ''}`}
            title='굵게'
            onClick={handleFontWeightClick}
          >
            <img src={boldIcon} />
          </button>
        </>
      )}
      <button
        title='객체 삭제하기'
        className={classes.tool_button}
        onClick={handleDeleteClick}
      >
        <img src={deleteIcon} />
      </button>
    </div>
  );
}

export default ObjectTool;
