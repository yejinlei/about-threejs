// 从 three 库中导入所需的类，用于创建灯光、几何体、材质和辅助对象
import { AmbientLight, HemisphereLight, DirectionalLight, PointLight, SpotLight, RectAreaLight, Mesh, SphereGeometry, MeshBasicMaterial, ArrowHelper, Vector3 } from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
// import { SpotLightHelper } from 'three/helpers/SpotLightHelper.js';
import { HemisphereLightHelper, DirectionalLightHelper, PointLightHelper, SpotLightHelper }from'three';
// 导入 ThreeJSAssetsManager 类，用于获取项目管理实例
import ThreeJSAssetsManager from "./ThreeJSAssetsManager.js";
// 导入配置文件，用于获取灯光配置信息
import config from "./config.js";

/**
 * LightManager 类负责管理场景中的各种灯光，包括环境光、方向光、点光源和聚光灯。
 * 在调试模式下，还会提供 GUI 界面来调整灯光参数，并添加灯光辅助对象。
 */
export default class LightManager {
    /**
     * 构造函数，初始化灯光管理器并根据配置创建灯光。
     */
    constructor() {
        // 获取 ThreeJSAssetsManager 的单例实例
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        // 从管理器实例中获取场景对象
        this.scene = this.threejsassetsmanagerInstance.scene;
        // 从管理器实例中获取调试模式标志
        this.debug = this.threejsassetsmanagerInstance.debug;
        // 从管理器实例中获取 GUI 对象
        this.gui = this.threejsassetsmanagerInstance.gui;
        // 用于存储所有灯光的辅助对象，方便后续管理
        this.lightHelpers = []; 

        // 检查调试模式是否开启，GUI 对象是否存在，以及灯光管理器配置是否启用
        if (this.debug && this.gui && config['LightManager'] && config['LightManager'].enabled) {
            // 在 GUI 中创建一个名为 'LightManager(光源管理)' 的文件夹
            const folder = this.gui.addFolder('LightManager(光源管理)');
            
            // 环境光配置
            if (config['LightManager'].ambientLight.enabled) {
                // 创建环境光实例，根据配置设置颜色和强度
                const ambientLight = new AmbientLight(
                    config['LightManager'].ambientLight.color,
                    config['LightManager'].ambientLight.intensity
                );
                // 将环境光添加到场景中
                this.scene.add(ambientLight);
                
                // 在 GUI 中为环境光创建一个子文件夹
                const ambientFolder = folder.addFolder('环境光');
                // 在 GUI 中添加颜色选择器，用于调整环境光颜色
                ambientFolder.addColor(ambientLight, 'color').name('颜色');
                // 在 GUI 中添加滑动条，用于调整环境光强度，范围 0 到 1，步长 0.01
                ambientFolder.add(ambientLight, 'intensity', 0, 1, 0.01).name('强度');
            }
            
            // 方向光配置
            if (config['LightManager'].directionalLight.enabled) {
                // 创建方向光实例，根据配置设置颜色和强度
                const directionalLight = new DirectionalLight(
                    config['LightManager'].directionalLight.color,
                    config['LightManager'].directionalLight.intensity
                );
                // 根据配置设置方向光的位置
                directionalLight.position.set(...config['LightManager'].directionalLight.position);
                // 将方向光添加到场景中
                this.scene.add(directionalLight);
                
                // 添加方向光辅助箭头（增大尺寸和颜色对比度）
                // 创建一个向量，复制方向光的位置并归一化
                const dir = new Vector3().copy(directionalLight.position).normalize();
                // 创建箭头辅助对象，红色，长度为 2
                const arrowHelper = new ArrowHelper(dir, directionalLight.position, 2, 0xff0000); 
                // 将箭头辅助对象添加到场景中
                this.scene.add(arrowHelper);
                // 将箭头辅助对象添加到辅助对象数组中
                this.lightHelpers.push(arrowHelper);
                
                // 在 GUI 中为方向光创建一个子文件夹
                const directionalFolder = folder.addFolder('方向光');
                // 在 GUI 中添加颜色选择器，用于调整方向光颜色
                directionalFolder.addColor(directionalLight, 'color').name('颜色');
                // 在 GUI 中添加滑动条，用于调整方向光强度，范围 0 到 5，步长 0.1
                directionalFolder.add(directionalLight, 'intensity', 0, 5, 0.1).name('强度');
                // 在 GUI 中添加滑动条，用于调整方向光 X 轴位置，范围 -10 到 10，步长 0.1
                directionalFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                // 在 GUI 中添加滑动条，用于调整方向光 Y 轴位置，范围 -10 到 10，步长 0.1
                directionalFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                // 在 GUI 中添加滑动条，用于调整方向光 Z 轴位置，范围 -10 到 10，步长 0.1
                directionalFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            // 点光源配置
            if (config['LightManager'].pointLight.enabled) {
                // 创建点光源实例，根据配置设置颜色、强度、距离和衰减
                const pointLight = new PointLight(
                    config['LightManager'].pointLight.color,
                    config['LightManager'].pointLight.intensity,
                    config['LightManager'].pointLight.distance,
                    config['LightManager'].pointLight.decay
                );
                // 根据配置设置点光源的位置
                pointLight.position.set(...config['LightManager'].pointLight.position);
                // 将点光源添加到场景中
                this.scene.add(pointLight);
                
                // 添加点光源辅助球体（增大尺寸和颜色对比度）
                // 创建球体几何体，半径为 0.3
                const sphereGeometry = new SphereGeometry(0.3, 32, 32); 
                // 创建基础材质，绿色
                const sphereMaterial = new MeshBasicMaterial({ color: 0x00ff00 }); 
                // 创建球体网格对象
                const sphere = new Mesh(sphereGeometry, sphereMaterial);
                // 将球体位置复制为点光源的位置
                sphere.position.copy(pointLight.position);
                // 将球体添加到场景中
                this.scene.add(sphere);
                // 将球体添加到辅助对象数组中
                this.lightHelpers.push(sphere);
                
                // 在 GUI 中为点光源创建一个子文件夹
                const pointFolder = folder.addFolder('点光源');
                // 在 GUI 中添加颜色选择器，用于调整点光源颜色
                pointFolder.addColor(pointLight, 'color').name('颜色');
                // 在 GUI 中添加滑动条，用于调整点光源强度，范围 0 到 5，步长 0.1
                pointFolder.add(pointLight, 'intensity', 0, 5, 0.1).name('强度');
                // 在 GUI 中添加滑动条，用于调整点光源照射距离，范围 0 到 100，步长 1
                pointFolder.add(pointLight, 'distance', 0, 100, 1).name('距离');
                // 在 GUI 中添加滑动条，用于调整点光源衰减，范围 0 到 2，步长 0.1
                pointFolder.add(pointLight, 'decay', 0, 2, 0.1).name('衰减');
                // 在 GUI 中添加滑动条，用于调整点光源 X 轴位置，范围 -10 到 10，步长 0.1
                pointFolder.add(pointLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                // 在 GUI 中添加滑动条，用于调整点光源 Y 轴位置，范围 -10 到 10，步长 0.1
                pointFolder.add(pointLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                // 在 GUI 中添加滑动条，用于调整点光源 Z 轴位置，范围 -10 到 10，步长 0.1
                pointFolder.add(pointLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            // 聚光灯配置
            if (config['LightManager'].spotLight.enabled) {
                // 创建聚光灯实例，根据配置设置颜色、强度、距离、角度、半影和衰减
                const spotLight = new SpotLight(
                    config['LightManager'].spotLight.color,
                    config['LightManager'].spotLight.intensity,
                    config['LightManager'].spotLight.distance,
                    config['LightManager'].spotLight.angle,
                    config['LightManager'].spotLight.penumbra,
                    config['LightManager'].spotLight.decay
                );
                // 根据配置设置聚光灯的位置
                spotLight.position.set(...config['LightManager'].spotLight.position);
                spotLight.target.position.set(...config['LightManager'].spotLight.target);
                // 将聚光灯添加到场景中
                this.scene.add(spotLight);
                // 将聚光灯目标添加到场景中
                this.scene.add(spotLight.target);
                
                // 添加聚光灯辅助圆锥（增大尺寸和颜色对比度）
                // 创建聚光灯辅助对象，蓝色
                const spotLightHelper = new SpotLightHelper(spotLight, 0x0000ff); 
                // 将聚光灯辅助对象添加到场景中
                this.scene.add(spotLightHelper);
                // 将聚光灯辅助对象添加到辅助对象数组中
                this.lightHelpers.push(spotLightHelper);
                
                // 在 GUI 中为聚光灯创建一个子文件夹
                const spotFolder = folder.addFolder('聚光灯');
                // 在 GUI 中添加颜色选择器，用于调整聚光灯颜色
                spotFolder.addColor(spotLight, 'color').name('颜色');
                // 在 GUI 中添加滑动条，用于调整聚光灯强度，范围 0 到 5，步长 0.1
                spotFolder.add(spotLight, 'intensity', 0, 5, 0.1).name('强度');
                // 在 GUI 中添加滑动条，用于调整聚光灯照射距离，范围 0 到 100，步长 1
                spotFolder.add(spotLight, 'distance', 0, 100, 1).name('距离');
                // 在 GUI 中添加滑动条，用于调整聚光灯角度，范围 0 到 π/2，步长 0.01
                spotFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01).name('角度');
                // 在 GUI 中添加滑动条，用于调整聚光灯半影，范围 0 到 1，步长 0.01
                spotFolder.add(spotLight, 'penumbra', 0, 1, 0.01).name('半影');
                // 在 GUI 中添加滑动条，用于调整聚光灯衰减，范围 0 到 2，步长 0.1
                spotFolder.add(spotLight, 'decay', 0, 2, 0.1).name('衰减');
                // 在 GUI 中添加滑动条，用于调整聚光灯 X 轴位置，范围 -10 到 10，步长 0.1
                spotFolder.add(spotLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                // 在 GUI 中添加滑动条，用于调整聚光灯 Y 轴位置，范围 -10 到 10，步长 0.1
                spotFolder.add(spotLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                // 在 GUI 中添加滑动条，用于调整聚光灯 Z 轴位置，范围 -10 到 10，步长 0.1
                spotFolder.add(spotLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            // 半球光配置
            if (config['LightManager'].hemiLight && config['LightManager'].hemiLight.enabled) {
                const hemisphereLight = new HemisphereLight(
                    config['LightManager'].hemiLight.color,
                       config['LightManager'].hemiLight.groundColor,
                      config['LightManager'].hemiLight.intensity
                );
                hemisphereLight.position.set(...config['LightManager'].hemiLight.position);
                this.scene.add(hemisphereLight);

                // 添加半球光方向辅助箭头
                const dir = new Vector3(0, 1, 0); // 半球光默认方向向上
                const arrowHelper = new ArrowHelper(dir, hemisphereLight.position, 2, 0xffff00);
                this.scene.add(arrowHelper);
                this.lightHelpers.push(arrowHelper);

                const hemisphericFolder = folder.addFolder('半球光');
                hemisphericFolder.addColor(hemisphereLight, 'color').name('天空颜色');
                hemisphericFolder.addColor(hemisphereLight, 'groundColor').name('地面颜色');
                  hemisphericFolder.add(hemisphereLight, 'intensity', 0, 5, 0.1).name('强度');
                  hemisphericFolder.add(hemisphereLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                  hemisphericFolder.add(hemisphereLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                  hemisphericFolder.add(hemisphereLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }

            // 半球光配置
            if (config['LightManager'].hemiLight && config['LightManager'].hemiLight.enabled) {
                  const hemisphereLight = new HemisphereLight(
                      config['LightManager'].hemiLight.color,
                      config['LightManager'].hemiLight.groundColor,
                      config['LightManager'].hemiLight.intensity
                );
                hemisphereLight.position.set(...config['LightManager'].hemiLight.position);
                this.scene.add(hemisphereLight);

                // 添加半球光方向辅助箭头
                const dir = new Vector3(0, 1, 0); // 半球光默认方向向上
                const arrowHelper = new ArrowHelper(dir, hemisphereLight.position, 2, 0xffff00);
                this.scene.add(arrowHelper);
                this.lightHelpers.push(arrowHelper);

                const hemisphericFolder = folder.addFolder('半球光');
                hemisphericFolder.addColor(hemisphereLight, 'color').name('天空颜色');
                hemisphericFolder.addColor(hemisphereLight, 'groundColor').name('地面颜色');
                  hemisphericFolder.add(hemisphereLight, 'intensity', 0, 5, 0.1).name('强度');
                hemisphericFolder.add(hemisphereLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                  hemisphericFolder.add(hemisphereLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                  hemisphericFolder.add(hemisphereLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }

            // 矩形区域光配置
            if (config['LightManager'].rectAreaLight.enabled) {
                const rectAreaLight = new RectAreaLight(
                    config['LightManager'].rectAreaLight.color,
                    config['LightManager'].rectAreaLight.intensity,
                    config['LightManager'].rectAreaLight.width,
                    config['LightManager'].rectAreaLight.height
                );
                rectAreaLight.position.set(...config['LightManager'].rectAreaLight.position);
                this.scene.add(rectAreaLight);

                if (this.debug) {
                    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
                    this.scene.add(rectAreaLightHelper);
                    this.lightHelpers.push(rectAreaLightHelper);
                }
                
                // 添加矩形区域光辅助对象
                const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
                this.scene.add(rectAreaLightHelper);
                this.lightHelpers.push(rectAreaLightHelper);
                
                // 矩形区域光GUI控制
                const rectAreaFolder = folder.addFolder('矩形区域光');
                rectAreaFolder.addColor(rectAreaLight, 'color').name('颜色');
                rectAreaFolder.add(rectAreaLight, 'intensity', 0, 10, 0.1).name('强度');
                rectAreaFolder.add(rectAreaLight, 'width', 0, 20, 0.1).name('宽度');
                rectAreaFolder.add(rectAreaLight, 'height', 0, 20, 0.1).name('高度');
                rectAreaFolder.add(rectAreaLight.position, 'x', -10, 10, 0.1).name('X轴位置');
                rectAreaFolder.add(rectAreaLight.position, 'y', -10, 10, 0.1).name('Y轴位置');
                rectAreaFolder.add(rectAreaLight.position, 'z', -10, 10, 0.1).name('Z轴位置');
            }
            
            // 打开 LightManager 文件夹
            folder.open();
        } else {
            // 非调试模式下的默认灯光
            if (config['LightManager'].ambientLight.enabled) {
                // 创建环境光实例，根据配置设置颜色和强度
                const ambientLight = new AmbientLight(
                    config['LightManager'].ambientLight.color,
                    config['LightManager'].ambientLight.intensity
                );
                // 将环境光添加到场景中
                this.scene.add(ambientLight);
            }
            
            if (config['LightManager'].directionalLight.enabled) {
                // 创建方向光实例，根据配置设置颜色和强度
                const directionalLight = new DirectionalLight(
                    config['LightManager'].directionalLight.color,
                    config['LightManager'].directionalLight.intensity
                );
                // 根据配置设置方向光的位置
                directionalLight.position.set(...config['LightManager'].directionalLight.position);
                // 将方向光添加到场景中
                this.scene.add(directionalLight);
                
                // 添加方向光辅助箭头（增大尺寸和颜色对比度）
                // 创建一个向量，复制方向光的位置并归一化
                const dir = new Vector3().copy(directionalLight.position).normalize();
                // 创建箭头辅助对象，红色，长度为 2
                const arrowHelper = new ArrowHelper(dir, directionalLight.position, 2, 0xff0000); 
                // 将箭头辅助对象添加到场景中
                this.scene.add(arrowHelper);
                // 将箭头辅助对象添加到辅助对象数组中
                this.lightHelpers.push(arrowHelper);
            }
            
            if (config['LightManager'].pointLight && config['LightManager'].pointLight.enabled) {
                // 创建点光源实例，根据配置设置颜色、强度、距离和衰减
                const pointLight = new PointLight(
                    config['LightManager'].pointLight.color,
                    config['LightManager'].pointLight.intensity,
                    config['LightManager'].pointLight.distance,
                    config['LightManager'].pointLight.decay
                );
                // 根据配置设置点光源的位置
                pointLight.position.set(...config['LightManager'].pointLight.position);
                // 将点光源添加到场景中
                this.scene.add(pointLight);
                
                // 添加点光源辅助球体（增大尺寸和颜色对比度）
                // 创建球体几何体，半径为 0.3
                const sphereGeometry = new SphereGeometry(0.3, 32, 32); 
                // 创建基础材质，绿色
                const sphereMaterial = new MeshBasicMaterial({ color: 0x00ff00 }); 
                // 创建球体网格对象
                const sphere = new Mesh(sphereGeometry, sphereMaterial);
                // 将球体位置复制为点光源的位置
                sphere.position.copy(pointLight.position);
                // 将球体添加到场景中
                this.scene.add(sphere);
                // 将球体添加到辅助对象数组中
                this.lightHelpers.push(sphere);
            }
            
            if (config['LightManager'].spotLight && config['LightManager'].spotLight.enabled) {
                // 创建聚光灯实例，根据配置设置颜色、强度、距离、角度、半影和衰减
                const spotLight = new SpotLight(
                    config['LightManager'].spotLight.color,
                    config['LightManager'].spotLight.intensity,
                    config['LightManager'].spotLight.distance,
                    config['LightManager'].spotLight.angle,
                    config['LightManager'].spotLight.penumbra,
                    config['LightManager'].spotLight.decay
                );
                // 根据配置设置聚光灯的位置
                spotLight.position.set(...config['LightManager'].spotLight.position);
                // 根据配置设置聚光灯目标的位置
                spotLight.target.position.set(...config['LightManager'].spotLight.target);
                // 将聚光灯添加到场景中
                this.scene.add(spotLight);
                // 将聚光灯目标添加到场景中
                this.scene.add(spotLight.target);
                
                // 添加聚光灯辅助圆锥（增大尺寸和颜色对比度）
                // 创建聚光灯辅助对象，蓝色
                const spotLightHelper = new SpotLightHelper(spotLight, 0x0000ff); 
                // 将聚光灯辅助对象添加到场景中
                this.scene.add(spotLightHelper);
                // 将聚光灯辅助对象添加到辅助对象数组中
                this.lightHelpers.push(spotLightHelper);
            }
            
            // 半球光配置
            if (config['LightManager'].hemiLight && config['LightManager'].hemiLight.enabled) {
                  const hemisphereLight = new HemisphereLight(
                      config['LightManager'].hemiLight.color,
                    config['LightManager'].hemiLight.groundColor,
                      config['LightManager'].hemiLight.intensity
                );
                hemisphereLight.position.set(...config['LightManager'].hemiLight.position);
                this.scene.add(hemisphereLight);

                // 添加半球光方向辅助箭头
                const dir = new Vector3(0, 1, 0); // 半球光默认方向向上
                const arrowHelper = new ArrowHelper(dir, hemisphereLight.position, 2, 0xffff00);
                this.scene.add(arrowHelper);
                this.lightHelpers.push(arrowHelper);
            }
            
            // 矩形区域光配置
            if (config['LightManager'].rectAreaLight.enabled) {
                const rectAreaLight = new RectAreaLight(
                    config['LightManager'].rectAreaLight.color,
                    config['LightManager'].rectAreaLight.intensity,
                    config['LightManager'].rectAreaLight.width,
                    config['LightManager'].rectAreaLight.height
                );
                rectAreaLight.position.set(...config['LightManager'].rectAreaLight.position);
                this.scene.add(rectAreaLight);
            }
        }
    }
}