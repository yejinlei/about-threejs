import * as THREE from 'https://gcore.jsdelivr.net/npm/three@0.132.2/build/three.min.js'

import sceneManagerInstance from './SceneManager'

// 单例
let instance = null;
export default class ThreeJSAssetsManager 
{
  constructor(canvas) 
  {	
    if (instance) 
    {
      return instance;
    }

    instance = this;
    window.ThreeJSAssetsManagerInstance = instance;
    this.canvas = canvas;
  }
}				
