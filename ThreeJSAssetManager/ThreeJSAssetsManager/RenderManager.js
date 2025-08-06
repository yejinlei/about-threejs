import ThreeJSAssetsManager from "./ThreeJSAssetsManager.js";

export default class RenderManager {
    constructor () {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.canvas = this.threejsassetsmanagerInstance.canvas;
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
         });
    }
}
