/** 该文件仅供参考，不随其它JS文件一起打包发布 **/
/**
 * 全局的控件颜色自定义设置
 */

let color={
    main:"#20A0FF",
    font:"#15428B",
    node:"#C0CCDA",
    line:"#1D8CE0",
    lineFont:"#ff6600",
    mark:"#ff8800",
    mix:"#B6F700",
    mixFont:"#777"
};
/**
 * 控件操作按钮的title提示设置
 * 取代setNodeRemarks方法，采用更灵活的注释配置
 */
//左边工具栏按钮的title提示设置，每个key名与初始化配置中相应按钮的类型名相同
let remarks={};
remarks.toolBtns={
    cursor:"选择指针",
    direct:"有向连线",
    dirDashed:"有向虚线",
    segment:"无向连线",
    segDashed:"无向虚线",
    start:"开始",
    "end":"结束",
    "task":"任务节点",
    node:"排程",
    chat:"消息",
    state:"状态节点",
    plug:"单据",
    fork:"分支节点",
    join:"联合节点",
    sound:'语音节点',
    menu:'菜单节点',
    complex:"复合节点",
    group:"区域编辑",
    memo:"添加便笺"
};
//顶部标题栏按钮的title提示设置，每个key名与初始化配置中相应按钮的类型名相同
remarks.headBtns={
    'new':"新建流程",
    open:"打开流程",
    save:"保存结果",
    undo:"撤销",
    redo:"重做",
    reload:"刷新流程",
    print:"打印流程图"
};
//工作区域面积扩展按钮的title提示设置
remarks.extendRight="工作区向右扩展";
remarks.extendBottom="工作区向下扩展";
export default {
    color,remarks
}
