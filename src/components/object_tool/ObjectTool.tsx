import classes from './ObjectTool.module.scss'
import deleteIcon from '../../assets/images/material-symbols_delete-outline.svg';
import fontFamilyIcon from '../../assets/images/qlementine-icons_font-16.svg';

function ObjectTool ({objectTool}: {objectTool: { type: string; x: number; y: number }}) {
    
    return (
        <div className={classes.tool_wrap} style={{ left: objectTool.x, top: objectTool.y}}>
            {objectTool.type==='textbox' && 
                <>
                    <button className={classes.tool_button} title="글꼴 변경하기">
                        <img src={fontFamilyIcon} />
                    </button>
                </>
            }
            <button title="객체 삭제하기" className={classes.tool_button}>
                <img src={deleteIcon} />
            </button>
        </div>
    )
}

export default ObjectTool;