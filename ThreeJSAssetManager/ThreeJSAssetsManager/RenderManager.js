import { WebGLRenderer } from 'three';
import ThreeJSAssetsManager from './ThreeJSAssetsManager.js'
import Sizes from "./Utils/Sizes.js";

export default class RenderManager {
    constructor () {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.canvas = this.threejsassetsmanagerInstance.canvas;
        this.sizes = this.threejsassetsmanagerInstance.sizes;
        this.scene = this.threejsassetsmanagerInstance.scene;
        this.camera = this.threejsassetsmanagerInstance.cameraManagerInstance.camera;
;
 
        this.webGLRenderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
         });

        this.webGLRenderer.physicallyCorrectLights = true;
        this.webGLRenderer.outputEncoding = THREE.sRGBEncoding;
        this.webGLRenderer.toneMapping = THREE.CineonToneMapping;
        this.webGLRenderer.toneMappingExposure = 1.75;
        this.webGLRenderer.shadowMap.enabled = true;
        this.webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.webGLRenderer.setClearColor('#211d20');
        this.webGLRenderer.setSize(this.sizes.width, this.sizes.height);
        this.webGLRenderer.setPixelRatio(this.sizes.pixelRatio);
    }

    resize() {
        this.webGLRenderer.setSize(this.sizes.width, this.sizes.height);
        this.webGLRenderer.setPixelRatio(this.sizes.pixelRatio);
      }
    
      update() {
        this.webGLRenderer.render(this.scene, this.camera);
      }
}
