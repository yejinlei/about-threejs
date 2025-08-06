import * as dat from 'https://gcore.jsdelivr.net/npm/lil-gui@0.18.1/dist/lil-gui.umd.min.js'

export default class DebugUI 
{
    constructor()
    {
        console.log(`DebugUI 构造函数：${window.location.hash}`);
        this.debug = window.location.hash === '#debug';

        if ( this.debug === true )
        {
            this.debugui = new dat.GUI();
            console.log('DebugUI 已加载');
        }
    }
}