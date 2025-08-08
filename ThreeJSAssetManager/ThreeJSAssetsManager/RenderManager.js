import { WebGLRenderer } from 'three';
import ThreeJSAssetsManager from './ThreeJSAssetsManager.js'
import Sizes from "./Utils/Sizes.js";
import config from './config.js';

export default class RenderManager {
    constructor () {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.canvas = this.threejsassetsmanagerInstance.canvas;
        this.sizes = this.threejsassetsmanagerInstance.sizes;
        this.scene = this.threejsassetsmanagerInstance.scene;
        this.camera = this.threejsassetsmanagerInstance.cameraManagerInstance.camera;
        this.debug = this.threejsassetsmanagerInstance.debug;
        this.gui = this.threejsassetsmanagerInstance.gui;
 
        this.webGLRenderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
         });

        // 基础渲染器配置
        this.webGLRenderer.physicallyCorrectLights = true;
        this.webGLRenderer.outputEncoding = THREE.sRGBEncoding;
        
        // 应用config配置
        this.webGLRenderer.toneMapping = config.RenderManager?.toneMapping || THREE.CineonToneMapping;
        this.webGLRenderer.toneMappingExposure = config.RenderManager?.toneMappingExposure || 1.75;
        this.webGLRenderer.shadowMap.enabled = config.RenderManager?.shadowMap?.enabled || true;
        this.webGLRenderer.shadowMap.type = config.RenderManager?.shadowMap?.type || THREE.PCFSoftShadowMap;
        this.webGLRenderer.setClearColor(config.RenderManager?.clearColor || '#211d20');
        
        // 设置渲染器尺寸
        this.webGLRenderer.setSize(this.sizes.width, this.sizes.height);
        this.webGLRenderer.setPixelRatio(this.sizes.pixelRatio);
        
        // 调试模式下添加GUI控制
        if(this.debug) {
            this.setupDebugGUI();
        }
    }

    resize() {
        this.webGLRenderer.setSize(this.sizes.width, this.sizes.height);
        this.webGLRenderer.setPixelRatio(this.sizes.pixelRatio);
      }
    
      update() {
        this.webGLRenderer.render(this.scene, this.camera);
      }

      setupDebugGUI() {
        const rendererFolder = this.gui.addFolder('Renderer');
        rendererFolder.add(this.webGLRenderer, 'toneMappingExposure').min(0).max(5).step(0.01).name('曝光度');
        rendererFolder.addColor(this.webGLRenderer, 'clearColor').name('背景色');
        rendererFolder.add(this.webGLRenderer.shadowMap, 'enabled').name('阴影映射');
      }
}