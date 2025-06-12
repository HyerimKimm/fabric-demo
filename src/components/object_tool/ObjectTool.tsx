import classes from './ObjectTool.module.scss';
import deleteIcon from '../../assets/images/material-symbols_delete-outline.svg';
import fontFamilyIcon from '../../assets/images/qlementine-icons_font-16.svg';
import boldIcon from '../../assets/images/ooui_bold-b.svg';
import * as fabric from 'fabric'; // v6
import { ObjectTypeType } from '../../types';

function ObjectTool({
  canvas,
  objectTool,
}: {
  canvas: fabric.Canvas;
  objectTool: { type: ObjectTypeType; x: number; y: number };
}) {
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

  return (
    <div
      className={classes.tool_wrap}
      style={{ left: objectTool.x, top: objectTool.y }}
    >
      {objectTool.type !== 'activeselection' && (
        <button title='색상' className={classes.tool_button}>
          <span
            className={classes.palette}
            style={{ backgroundColor: '#ff0000' }}
          />
        </button>
      )}
      {objectTool.type === 'textbox' && (
        <>
          <button className={classes.tool_button} title='글꼴 변경하기'>
            <img src={fontFamilyIcon} />
          </button>
          <button className={classes.tool_button} title='굵게'>
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
