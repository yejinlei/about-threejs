import { AmbientLight, DirectionalLight, PointLight, SpotLight, Mesh, SphereGeometry, MeshBasicMaterial, ArrowHelper, Vector3 } from 'three';
import ThreeJSAssetsManager from "./ThreeJSAssetsManager.js";
import config from "./config.js";

export default class LightManager {
    constructor() {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.scene = this.threejsassetsmanagerInstance.scene;
        this.debug = this.threejsassetsmanagerInstance.debug;
        this.gui = this.threejsassetsmanagerInstance.gui;
        this.lightHelpers = []; // 存储灯光辅助对象

        if (this.debug && this.gui && config['LightManager'] && config['LightManager'].enabled) {
            const folder = this.gui.addFolder('LightManager(光源管理)');
            
            // 环境光配置
            if (config['LightManager'].ambientLight.enabled) {
                const ambientLight = new AmbientLight(
                    config['LightManager'].ambientLight.color,
                    config['LightManager'].ambientLight.intensity
                );
                this.scene.add(ambientLight);
                
                const ambientFolder = folder.addFolder('环境光');
                ambientFolder.addColor(ambientLight, 'color').name('颜色');
                ambientFolder.add(ambientLight, 'intensity', 0, 1, 0.01).name('强度');
            }
            
            // 方向光配置
            if (config['LightManager'].directionalLight.enabled) {
                const directionalLight = new DirectionalLight(
                    config['LightManager'].directionalLight.color,
                    config['LightManager'].directionalLight.intensity
                );
                directionalLight.position.set(...config['LightManager'].directionalLight.position);
                this.scene.add(directionalLight);
                
                // 添加方向光辅助箭头（增大尺寸和颜色对比度）
                const dir = new Vector3().copy(directionalLight.position).normalize();
                const arrowHelper = new ArrowHelper(dir, directionalLight.position, 2, 0xff0000); // 红色箭头，长度2
                this.scene.add(arrowHelper);
                this.lightHelpers.push(arrowHelper);
                
                const directionalFolder = folder.addFolder('方向光');
                directionalFolder.addColor(directionalLight, 'color').name('颜色');
                directionalFolder.add(directionalLight, 'intensity', 0, 5, 0.1).name('强度');
                directionalFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                directionalFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                directionalFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            // 点光源配置
            if (config['LightManager'].pointLight && config['LightManager'].pointLight.enabled) {
                const pointLight = new PointLight(
                    config['LightManager'].pointLight.color,
                    config['LightManager'].pointLight.intensity,
                    config['LightManager'].pointLight.distance,
                    config['LightManager'].pointLight.decay
                );
                pointLight.position.set(...config['LightManager'].pointLight.position);
                this.scene.add(pointLight);
                
                // 添加点光源辅助球体（增大尺寸和颜色对比度）
                const sphereGeometry = new SphereGeometry(0.3, 32, 32); // 半径增大到0.3
                const sphereMaterial = new MeshBasicMaterial({ color: 0x00ff00 }); // 绿色球体
                const sphere = new Mesh(sphereGeometry, sphereMaterial);
                sphere.position.copy(pointLight.position);
                this.scene.add(sphere);
                this.lightHelpers.push(sphere);
                
                const pointFolder = folder.addFolder('点光源');
                pointFolder.addColor(pointLight, 'color').name('颜色');
                pointFolder.add(pointLight, 'intensity', 0, 5, 0.1).name('强度');
                pointFolder.add(pointLight, 'distance', 0, 100, 1).name('距离');
                pointFolder.add(pointLight, 'decay', 0, 2, 0.1).name('衰减');
                pointFolder.add(pointLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                pointFolder.add(pointLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                pointFolder.add(pointLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            // 聚光灯配置
            if (config['LightManager'].spotLight && config['LightManager'].spotLight.enabled) {
                const spotLight = new SpotLight(
                    config['LightManager'].spotLight.color,
                    config['LightManager'].spotLight.intensity,
                    config['LightManager'].spotLight.distance,
                    config['LightManager'].spotLight.angle,
                    config['LightManager'].spotLight.penumbra,
                    config['LightManager'].spotLight.decay
                );
                spotLight.position.set(...config['LightManager'].spotLight.position);
                spotLight.target.position.set(...config['LightManager'].spotLight.target);
                this.scene.add(spotLight);
                this.scene.add(spotLight.target);
                
                // 添加聚光灯辅助圆锥（增大尺寸和颜色对比度）
                const spotLightHelper = new SpotLightHelper(spotLight, 0x0000ff); // 蓝色圆锥
                this.scene.add(spotLightHelper);
                this.lightHelpers.push(spotLightHelper);
                
                const spotFolder = folder.addFolder('聚光灯');
                spotFolder.addColor(spotLight, 'color').name('颜色');
                spotFolder.add(spotLight, 'intensity', 0, 5, 0.1).name('强度');
                spotFolder.add(spotLight, 'distance', 0, 100, 1).name('距离');
                spotFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01).name('角度');
                spotFolder.add(spotLight, 'penumbra', 0, 1, 0.01).name('半影');
                spotFolder.add(spotLight, 'decay', 0, 2, 0.1).name('衰减');
                spotFolder.add(spotLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                spotFolder.add(spotLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                spotFolder.add(spotLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            folder.open();
        } else {
            // 非调试模式下的默认灯光
            if (config['LightManager'].ambientLight.enabled) {
                const ambientLight = new AmbientLight(
                    config['LightManager'].ambientLight.color,
                    config['LightManager'].ambientLight.intensity
                );
                this.scene.add(ambientLight);
            }
            
            if (config['LightManager'].directionalLight.enabled) {
                const directionalLight = new DirectionalLight(
                    config['LightManager'].directionalLight.color,
                    config['LightManager'].directionalLight.intensity
                );
                directionalLight.position.set(...config['LightManager'].directionalLight.position);
                this.scene.add(directionalLight);
                
                // 添加方向光辅助箭头（增大尺寸和颜色对比度）
                const dir = new Vector3().copy(directionalLight.position).normalize();
                const arrowHelper = new ArrowHelper(dir, directionalLight.position, 2, 0xff0000); // 红色箭头，长度2
                this.scene.add(arrowHelper);
                this.lightHelpers.push(arrowHelper);
            }
            
            if (config['LightManager'].pointLight && config['LightManager'].pointLight.enabled) {
                const pointLight = new PointLight(
                    config['LightManager'].pointLight.color,
                    config['LightManager'].pointLight.intensity,
                    config['LightManager'].pointLight.distance,
                    config['LightManager'].pointLight.decay
                );
                pointLight.position.set(...config['LightManager'].pointLight.position);
                this.scene.add(pointLight);
                
                // 添加点光源辅助球体（增大尺寸和颜色对比度）
                const sphereGeometry = new SphereGeometry(0.3, 32, 32); // 半径增大到0.3
                const sphereMaterial = new MeshBasicMaterial({ color: 0x00ff00 }); // 绿色球体
                const sphere = new Mesh(sphereGeometry, sphereMaterial);
                sphere.position.copy(pointLight.position);
                this.scene.add(sphere);
                this.lightHelpers.push(sphere);
            }
            
            if (config['LightManager'].spotLight && config['LightManager'].spotLight.enabled) {
                const spotLight = new SpotLight(
                    config['LightManager'].spotLight.color,
                    config['LightManager'].spotLight.intensity,
                    config['LightManager'].spotLight.distance,
                    config['LightManager'].spotLight.angle,
                    config['LightManager'].spotLight.penumbra,
                    config['LightManager'].spotLight.decay
                );
                spotLight.position.set(...config['LightManager'].spotLight.position);
                spotLight.target.position.set(...config['LightManager'].spotLight.target);
                this.scene.add(spotLight);
                this.scene.add(spotLight.target);
                
                // 添加聚光灯辅助圆锥（增大尺寸和颜色对比度）
                const spotLightHelper = new SpotLightHelper(spotLight, 0x0000ff); // 蓝色圆锥
                this.scene.add(spotLightHelper);
                this.lightHelpers.push(spotLightHelper);
            }
        }
    }
}