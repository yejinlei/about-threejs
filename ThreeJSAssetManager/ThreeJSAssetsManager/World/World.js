import { BoxGeometry, MeshBasicMaterial, Mesh, DirectionalLight, Color} from 'three';
import ThreeJSAssetsManager from "../ThreeJSAssetsManager.js";

export default class worldManager
{
    constructor()
    {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.scene = this.threejsassetsmanagerInstance.scene;
        
        // 测试用
        const geometry = new BoxGeometry( 1, 1, 1 ); 
        const material = new MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new Mesh( geometry, material ); 
        this.scene.add(cube);
    }

    update() {
        // TODO
    }
}