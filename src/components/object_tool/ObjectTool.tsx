import classes from './ObjectTool.module.scss'

function ObjectTool ({objectTool}: {objectTool: { type: string; x: number; y: number }}) {
    return <div className={classes.tool_wrap} style={{ left: objectTool.x, top: objectTool.y}}>인라인 도구</div>
}

export default ObjectTool;