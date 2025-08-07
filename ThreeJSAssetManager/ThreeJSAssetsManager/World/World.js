import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Mesh } from 'three';
import ThreeJSAssetsManager from "../ThreeJSAssetsManager.js";

export default class worldManager
{
    constructor()
    {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.scene = this.threejsassetsmanagerInstance.scene;
        
        // 测试用
        const geometry1 = new BoxGeometry( 1, 1, 1 ); 
        const material = new MeshBasicMaterial( {color: 0xffff00} ); 
        const cube = new Mesh( geometry1, material ); 
        this.scene.add(cube);

        const geometry2 = new BoxGeometry( 1, 1, 1 ); 
        const materia2 = new MeshStandardMaterial( {color: 0x00ff00} ); 
        const cube2 = new Mesh( geometry2, materia2 ); 
        this.scene.add(cube2);
        cube2.position.set(0,0,2);

    }

    update() {
        // TODO
    }
}