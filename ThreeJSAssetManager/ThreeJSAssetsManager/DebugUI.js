import * as dat from 'https://gcore.jsdelivr.net/npm/lil-gui@0.18.1/dist/lil-gui.umd.min.js'

export default class DebugUI 
{
    /**
     * 构造函数，用于初始化 DebugUI 实例。
     * 该函数会根据当前 URL 的哈希值判断是否启用调试模式，
     * 若启用则创建一个 lil-gui 调试界面。
     */
    constructor()
    {
        // 打印构造函数启动日志，包含当前 URL 的哈希值，方便调试时确认启动状态
        console.log(`DebugUI 构造函数：${window.location.hash}`);
        // 通过比较 URL 的哈希值是否为 '#debug' 来决定是否开启调试模式，结果存储在实例属性中
        this.debug = window.location.hash === '#debug';

        // 检查调试模式是否已开启
        if ( this.debug === true )
        {
            // 当调试模式开启时，使用 lil-gui 库创建一个图形用户界面实例
            this.debugui = new dat.GUI();
            // 打印调试界面创建成功的日志，提示用户调试界面已正常加载
            console.log('DebugUI 已加载');
        }
    }
}