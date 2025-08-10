//import * as THREE from 'https://gcore.jsdelivr.net/npm/three@0.132.2/build/three.min.js'
import { Scene, Fog, Color, Group, SRGBColorSpace } from 'three'
import threeJSAssetsManager from './ThreeJSAssetsManager.js'
import config from './config.js'
/**
 * 场景管理器类
 */
export default class SceneManager {
  /**
   * 构造函数
   * @param {Object} THREE - Three.js 库对象
   * @param {Object} [options] - 场景配置选项
   */
  constructor(cavas, options = {}) {
    this.threejsassetsmanagerInstance = new threeJSAssetsManager();
    this.debug = this.threejsassetsmanagerInstance.debug;
    this.gui = this.threejsassetsmanagerInstance.gui;
  
    console.log(this.threejsassetsmanagerInstance);

    this.cavas = cavas;

    this.scene = new Scene();
    this.mainGroup = new Group();
    this.mainGroup.name = 'MainGroup';
    this.scene.add(this.mainGroup);
    this.confScene();
    this.confGUI();
    this.modelVisibility = {}; // 模型可见性状态
    
    // 应用配置选项
    // 背景颜色
    // if (options.background) {
    //   this.scene.background = new THREE.Color(options.background);
    // } else {
    //   this.scene.background = new THREE.Color(0xffffff);
    // }
  }
  
  /**
   * 设置当前场景对象
   * @param {THREE.Scene} scene - 要设置的新场景对象
   */
  setScence(scene) {
    // 将传入的场景对象赋值给当前实例的场景属性
    this.scene = scene;
  }
  /**
   * 获取场景对象
   * @returns {THREE.Scene}
   */
  getScene() {
    return this.scene;
  }

  confScene() {
  
    if(!(config['SceneManager'] || {}).enabled)
      return; 


    console.log('SceneManager:confScene函数，配置：',(config['SceneManager'] || {}));
    // 背景颜色
    if ((config['SceneManager'] || {}).Color.enabled) {
      console.log((config['SceneManager'] || {}).Color.value);
      this.scene.background = new Color((config['SceneManager'] || {}).Color.value);
    } else {
      this.scene.background = new Color(0xffffff);
    }

    // 雾效果
    if ((config['SceneManager'] || {}).fog.enabled) {
      this.scene.fog = new Fog((config['SceneManager'] || {}).fog.color, (config['SceneManager'] || {}).fog.near, (config['SceneManager'] || {}).fog.far);
    }

    // // 环境光
    // if (sceneConfig.environment) {
    //   this.scene.environment = new THREE.TextureLoader().load(sceneConfig.environment);
    // }

    // // 阴影设置
    // if (sceneConfig.shadow) {
    //   this.setupShadows(sceneConfig.shadow);
    // }
    
  }

  confGUI()
  {
    if (this.debug && this.gui) 
    {
      if (!this.scene) this.scene = new Scene();
      this.debugFolder = this.gui.addFolder('SceneManager(场景管理)');

      // 确保场景属性存在
      if (!this.scene.background) this.scene.background = new Color(0xffffff);
      if (!this.scene.fog) this.scene.fog = new Fog(0xcccccc, 10, 50);
      if (this.scene.fog && !this.scene.fog.color) this.scene.fog.color = new Color(0xcccccc);
      if (!this.scene.environment) this.scene.environment = new Color(0xffffff);

      // 背景颜色控制
      const bgFolder = this.debugFolder.addFolder('Background');
      const bgColor = {
        value: this.scene.background ? this.scene.background.getHex() : 0xffffff
      };
      bgFolder.addColor(bgColor, 'value').name('背景色').onChange((val) => {
        this.scene.background = new Color(val);
        console.log('config:this.scene.background', val.toString(16));  
      });

      // 雾效启用 
      const fogFolder = this.debugFolder.addFolder('Fog(雾效)');
      fogFolder.add(config['SceneManager'].fog, 'enabled').name('启用').onChange(value => {
        if (value) {
          this.scene.fog = new Fog(config['SceneManager'].fog.color, config['SceneManager'].fog.near, (config['SceneManager'].fog.far));
        } else {
          this.scene.fog = null;
        }
      });

      // 雾效果控制
      if (this.scene.fog) {
        const fogColor = {
          value: this.scene.fog.color.getHex()
        };
        fogFolder.addColor(fogColor, 'value').name('雾颜色').onChange((val) => {
          this.scene.fog.color = new Color(val);
          console.log('config:this.scene.fog.color', val.toString(16));
        });
        fogFolder.add(this.scene.fog, 'near').name('近距离');
        fogFolder.add(this.scene.fog, 'far').name('远距离');
      }

      // 环境光控制
      const envFolder = this.debugFolder.addFolder('Environment(环境光)');
      if (!this.scene.environment) {
        this.scene.environment = null;
      }
      envFolder.add({
        toggleEnvironment: () => {
          if (this.scene.environment) {
            this.scene.environment = null;
            console.log('环境光已禁用');
          } else {
            this.scene.environment = new Color(0xffffff);
            console.log('使用灰色环境光');
          }
        }
      }, 'toggleEnvironment').name('切换环境光');

      // 默认展开部分文件夹
      bgFolder.open();
      fogFolder.close();
    }
  }

  /**
   * 切换场景
   * @param {string} sceneName - 场景名称
   */
  switchScene(sceneName) {
    if (this.scenes[sceneName]) {
      this.scene = this.scenes[sceneName];
    } else {
      console.warn(`场景 ${sceneName} 不存在`);
    }
  }

  /**
   * 设置模型可见性
   * @param {string} uuid - 模型唯一标识
   * @param {boolean} visible - 是否可见
   */
  setModelVisibility(uuid, visible) {
    this.modelVisibility[uuid] = visible;
  }

  /**
   * 获取模型可见性状态
   * @param {string} uuid - 模型唯一标识
   * @returns {boolean} - 是否可见
   */
  getModelVisibility(uuid) {
    return this.modelVisibility[uuid] !== false;
  }
}

class ModelsManager 
{
  constructor(THREE) 
  {
  }
}
