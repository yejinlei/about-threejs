import * as THREE from 'https://gcore.jsdelivr.net/npm/three@0.132.2/build/three.min.js'

import debuguiInstance from './DebugUI.js'
import SceneManager from './SceneManager.js'
import CameraManager from './CameraManager.js'
import LightManager from './LightManager.js'
import RenderManager from './RenderManager.js'
import DebugUI from './DebugUI.js'

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

    // 安装各个管理组件
    this.debuguiinstance = new DebugUI();
    this.sceneManagerinstance = new SceneManager(document.getElementById("canvas01"));
    this.cameraManagerInstance = new CameraManager();
    this.lightManagerInstance = new LightManager();
    this.renderManagerInstance = new RenderManager();


  }
}
