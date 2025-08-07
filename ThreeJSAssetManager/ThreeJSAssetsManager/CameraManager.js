import ThreeJSAssetsManager from "./ThreeJSAssetsManager.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default class CameraManager
{
    constructor() {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.sizes = this.threejsassetsmanagerInstance.sizes;
        this.scene = this.threejsassetsmanagerInstance.scene;
        this.canvas = this.threejsassetsmanagerInstance.canvas;
        console.log(this.canvas);

        this.setInstance();
        this.setOrbitControls();
      }
    
      setInstance() {
        this.percamera = new THREE.PerspectiveCamera(
          35,
          this.sizes.width / this.sizes.height,
          0.1,
          100
        );
    
        this.percamera.position.set(6, 4, 8);
        this.scene.add(this.percamera);
      }
    
      setOrbitControls() {
        this.controls = new OrbitControls(this.percamera, this.canvas);
        this.controls.enableDamping = true;
      }
    
      resize() {
        this.percamera.aspect = this.sizes.width / this.sizes.height;
        this.percamera.updateProjectionMatrix();
      }
    
      update() {
        // update the orbit controls on each frame
        this.controls.update();
      }
    }
    