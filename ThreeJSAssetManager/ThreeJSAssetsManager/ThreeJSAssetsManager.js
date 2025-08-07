import * as THREE from 'https://gcore.jsdelivr.net/npm/three@0.132.2/build/three.min.js'

import debuguiInstance from './DebugUI.js'
import SceneManager from './SceneManager.js'
import CameraManager from './CameraManager.js'
import LightManager from './LightManager.js'
import RenderManager from './RenderManager.js'
import DebugUI from './DebugUI.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'

import worldManager from './World/World.js'

// 单例
let instance = null;
export default class ThreeJSAssetsManager 
{
  constructor(canvas) 
  {	
    // 全局只有一个单例
    if (instance) 
    {
      return instance;
    }
    instance = this;
    // 放入window中以防止被清除
    window.ThreeJSAssetsManagerInstance = this;
    
    // 从canvas中获取画布
    this.canvas = canvas;

    // 调试GUI
    this.debuguiinstance = new DebugUI();

    // resize事件响应、tick事件响应
    this.sizes = new Sizes();
    this.time = new Time();

    // 安装各个管理组件
    this.sceneManagerinstance = new SceneManager(this.canvas);
    this.scene = this.sceneManagerinstance.scene
    this.cameraManagerInstance = new CameraManager();
    this.percamera = this.cameraManagerInstance.percamera;
    console.log(this.percamera);
    this.lightManagerInstance = new LightManager();
    this.renderManagerInstance = new RenderManager();
    this.worldRenderInstance = new worldManager();

    //
    this.sizes.on('resize', () => {
      this.resize();
    });

    this.time.on('tick', () => {
      this.tick();
    });
  }

  resize()
  {
    //TODO: 当尺寸调整时，可以在这里调整画布尺寸。
    console.log('ThreeJSAssetsManager:resize');
    this.cameraManagerInstance.resize();
    this.renderManagerInstance.resize();
  }

  tick()
  {
    //TODO: 每帧更新时，可以在这里更新时间或者进行游戏逻辑
    console.log('ThreeJSAssetsManager:tick');
    this.cameraManagerInstance.update();
    this.worldRenderInstance.update();
    this.renderManagerInstance.update();
  }
}
