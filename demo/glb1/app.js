/**
 * Three.js 游泳池水效果演示
 * 
 * 本示例展示了如何使用 Three.js 创建一个带有逼真水面效果的游泳池场景。
 * 主要特点包括：
 * - 使用 Water 对象创建动态水面效果
 * - 模拟游泳池结构（池边和池内）
 * - 多种光源组合提供逼真照明
 * - 交互式相机控制
 * - 响应式设计，适应窗口大小变化
 */

// 从全局对象中引入 CDN 加载的模块
const THREE = window.THREE;
const { OrbitControls } = window.THREE;
const { Sky } = window.THREE;
const GUI = lil.GUI; // 正确引用 lil-gui 库

// 初始化场景、相机和渲染器
const scene = new THREE.Scene();

let sky = null; // 天空对象，后续创建
let sun = null; // 太阳位置，用于天空盒
let useSkybox = false; // 控制是否使用天空盒
let pmremGenerator = null; // 预过滤的镜面反射环境贴图生成器
let envMap = null; // 环境贴图

// 光源对象
let ambientLight = null; // 环境光
let directionalLight = null; // 定向光
let hemisphereLight = null; // 半球光
let modelFolder = null; // 模型控制文件夹

// GUI参数
const parameters = {
    // 渲染参数
    antialias: true, // 控制是否启用抗锯齿
    useSkybox: false,
    useBackground: false, // 默认关闭背景色
    elevation: 2,
    azimuth: 180,
    useNormalMap: true, // 控制是否使用法向贴图
    distortionScale: 0, // 扭曲比例设置为0
    sunColor: 0x000000, // 太阳光颜色设置为黑色
    textureWidth: 2048, // 水面纹理宽度
    textureHeight: 2048, // 水面纹理高度
    backgroundColor: '#000000', // 背景色设置为黑色
    widthSegments: 32, // 水面宽度分段数
    heightSegments: 32, // 水面高度分段数
    
    // 光源参数
    useAmbientLight: true, // 启用环境光
    ambientLightColor: 0xffffff, // 环境光颜色
    ambientLightIntensity: 0.5, // 环境光强度
    
    useDirectionalLight: true, // 启用定向光
    directionalLightColor: 0xffffff, // 定向光颜色
    directionalLightIntensity: 1.0, // 定向光强度
    directionalLightPositionX: 100, // 定向光X位置
    directionalLightPositionY: 100, // 定向光Y位置
    directionalLightPositionZ: 50, // 定向光Z位置
    directionalLightCastShadow: true, // 定向光投射阴影
    
    useHemisphereLight: true, // 启用半球光
    hemisphereLightSkyColor: 0xffffbb, // 半球光天空颜色
    hemisphereLightGroundColor: 0x080820, // 半球光地面颜色
    hemisphereLightIntensity: 0.6 // 半球光强度
};

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000); // 增加远平面距离以显示更远的场景
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 启用抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // 设置背景色为黑色，不透明度为0
renderer.setPixelRatio(window.devicePixelRatio); // 适应设备像素比
//renderer.setAnimationLoop(animate); // 使用 setAnimationLoop 替代 requestAnimationFrame (WebXR 应用推荐)
renderer.toneMapping = THREE.ACESFilmicToneMapping; // 设置色调映射，提高视觉质量
renderer.toneMappingExposure = 0.5; // 调整曝光度
document.body.appendChild(renderer.domElement); // 将渲染器的画布添加到页面

// 添加轨道控制器，实现交互式相机控制
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 100, 200);
controls.update(); // 更新控制器

// 全局模型可见性状态对象
const modelVisibility = {};

// 创建模型拓扑树
function createModelTree() {
    console.log('开始创建模型树...');
    
    // 销毁旧的模型树文件夹
    if (window.modelTreeFolder) {
        try {
            // 使用 GUI 的 remove 方法移除文件夹
            modelFolder.children.forEach((child, index) => {
                if (child === window.modelTreeFolder) {
                    modelFolder.children.splice(index, 1);
                    console.log('已从父文件夹中移除旧的模型树文件夹');
                }
            });
            
            window.modelTreeFolder.destroy();
            console.log('已销毁旧的模型树文件夹');
        } catch (e) {
            console.warn('销毁模型树文件夹时出错:', e);
        }
    }
    
    // 创建新的模型树文件夹
    window.modelTreeFolder = modelFolder.addFolder(`${window.currentModelName}模型拓扑树`);
    console.log('已创建新的模型树文件夹');
    
    const glbParent = scene.children.find(child => child.name === window.currentModelName);
    if (glbParent) {
        // 检查是否有子模型
        const hasChildren = (glbParent.children && glbParent.children.length > 0) || 
                          (glbParent.userData && glbParent.userData.children && glbParent.userData.children.length > 0);
        console.log('创建模型拓扑树，找到子模型数量:', hasChildren ? 
            (glbParent.children ? glbParent.children.length : glbParent.userData.children.length) : 0);
        
        // 递归创建模型树
        function addModelToTree(obj, prefix = '') {
            // 为每个模型创建一个可见性控制
            const objName = obj.name || `未命名模型_${obj.uuid.substring(0, 8)}`;
            const displayName = prefix + objName;
            
            // 初始化可见性状态（默认为可见）
            if (modelVisibility[obj.uuid] === undefined) {
                modelVisibility[obj.uuid] = true;
            }
            
            // 添加勾选框控制模型可见性
            window.modelTreeFolder.add(modelVisibility, obj.uuid)
                .name(displayName)
                .setValue(obj.visible)
                .onChange(function(visible) {
                    const updateVisibility = (obj, visible) => {
                        obj.visible = visible;
                        if (obj.children && obj.children.length > 0) {
                            obj.children.forEach(child => updateVisibility(child, visible));
                        }
                    };
                    updateVisibility(obj, visible);
                    renderer.render(scene, camera);
                });
            
            // 递归处理子对象
            const children = obj.children || (obj.userData && obj.userData.children);
            if (children && children.length > 0) {
                children.forEach(child => {
                    // 检查是否是集合(Collection)
                    if (child.isGroup || child.type === 'Group' || (child.userData && child.userData.isCollection)) {
                        // 为集合创建单独的文件夹
                        const collectionFolder = window.modelTreeFolder.addFolder(prefix + child.name || `集合_${child.uuid.substring(0, 8)}`);
                        collectionFolder.open();
                        
                        // 递归处理集合中的子对象
                        const collectionChildren = child.children || (child.userData && child.userData.children);
                        if (collectionChildren && collectionChildren.length > 0) {
                            collectionChildren.forEach(collectionChild => {
                                addModelToTree(collectionChild, prefix + '  ');
                            });
                        }
                    } else {
                        // 普通模型对象
                        addModelToTree(child, prefix + '  ');
                    }
                });
            }
        }
        
        // 为每个顶级子模型创建树节点
        if (hasChildren) {
            const children = glbParent.children || (glbParent.userData && glbParent.userData.children);
            children.forEach(child => {
                addModelToTree(child);
            });
        }
        
        // 打开拓扑树文件夹
        window.modelTreeFolder.open();
    } else {
        console.warn(`未找到${window.currentModelName}模型或子模型为空`);
        window.modelTreeFolder.add({ message: `未找到${window.currentModelName}模型` }, 'message').name('状态').disable();
    }
}

/**
 * 光照系统设置
 * 使用三种不同类型的光源创建逼真的照明效果：
 * 1. 环境光：提供基础照明
 * 2. 定向光：模拟太阳光，产生阴影
 * 3. 半球光：模拟环境反射光
 */
// 初始化光源函数
function initLights() {
    // 创建环境光 - 提供基础照明
    if (parameters.useAmbientLight) {
        ambientLight = new THREE.AmbientLight(
            parameters.ambientLightColor, 
            parameters.ambientLightIntensity
        );
        scene.add(ambientLight);
    } else {
        if (ambientLight) scene.remove(ambientLight);
    }

    // 创建定向光源模拟太阳光
    if (parameters.useDirectionalLight) {
        directionalLight = new THREE.DirectionalLight(
            parameters.directionalLightColor, 
            parameters.directionalLightIntensity
        );
        directionalLight.position.set(
            parameters.directionalLightPositionX, 
            parameters.directionalLightPositionY, 
            parameters.directionalLightPositionZ
        );
        directionalLight.castShadow = parameters.directionalLightCastShadow;
        directionalLight.shadow.mapSize.width = 1024; // 设置阴影贴图分辨率
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
    } else {
        if (directionalLight) scene.remove(directionalLight);
    }

    // 创建半球光以模拟环境反射光
    if (parameters.useHemisphereLight) {
        hemisphereLight = new THREE.HemisphereLight(
            parameters.hemisphereLightSkyColor, 
            parameters.hemisphereLightGroundColor, 
            parameters.hemisphereLightIntensity
        );
        scene.add(hemisphereLight);
    } else {
        if (hemisphereLight) scene.remove(hemisphereLight);
    }
}

/**
 * 初始化天空盒
 * 创建Three.js的Sky对象，模拟真实天空效果
 */
function initSky() {
    // 创建Sky对象
    sky = new THREE.Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    
    // 初始化环境贴图生成器
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    
    // 定义太阳位置
    sun = new THREE.Vector3();
    
    // 设置Sky的uniforms参数
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
    
    // 更新太阳位置
    updateSun();
}

// 更新太阳位置和天空效果
function updateSun() {
    // 只有在启用天空盒时才更新太阳位置
    if (!useSkybox || !sky) return;
    
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    
    sun.setFromSphericalCoords(1, phi, theta);
    
    sky.material.uniforms['sunPosition'].value.copy(sun);
    
    // 生成环境贴图
    if (pmremGenerator) {
        // 渲染天空到环境贴图
        scene.environment = pmremGenerator.fromScene(scene).texture;
    }
}

// 初始化GUI控制面板
function initGUI() {
    const gui = new GUI();
    
    // 添加几何体文件夹
    modelFolder = gui.addFolder('模型控制');
    
    // 添加模型拓扑树功能
    let modelTreeFolder = modelFolder.addFolder('模型拓扑树');
    // 将模型树文件夹添加到全局作用域，以便在函数间共享
    window.modelTreeFolder = modelTreeFolder;
    
    // 存储模型可见性状态的对象


    
    // 添加刷新拓扑树按钮
    modelFolder.add({ 
        refreshTree: function() {
            console.log('刷新模型树...');
            createModelTree();
            console.log('模型树刷新完成');
        } 
    }, 'refreshTree').name('刷新模型树');
    
    // 添加全选/全不选按钮
    const selectionControls = {
        selectAll: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent) {
                const updateVisibility = (obj, visible) => {
                    obj.visible = visible;
                    if (modelVisibility[obj.uuid] !== undefined) {
                        modelVisibility[obj.uuid] = visible;
                    }
                    if (obj.children && obj.children.length > 0) {
                        obj.children.forEach(child => updateVisibility(child, visible));
                    }
                };
                
                glbParent.children.forEach(child => updateVisibility(child, true));
                createModelTree(); // 刷新树以更新UI状态
                renderer.render(scene, camera);
            }
        },
        deselectAll: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent) {
                const updateVisibility = (obj, visible) => {
                    obj.visible = visible;
                    if (modelVisibility[obj.uuid] !== undefined) {
                        modelVisibility[obj.uuid] = visible;
                    }
                    if (obj.children && obj.children.length > 0) {
                        obj.children.forEach(child => updateVisibility(child, visible));
                    }
                };
                
                glbParent.children.forEach(child => updateVisibility(child, false));
                createModelTree(); // 刷新树以更新UI状态
                renderer.render(scene, camera);
            }
        }
    };
    
    modelFolder.add(selectionControls, 'selectAll').name('全选');
    modelFolder.add(selectionControls, 'deselectAll').name('全不选');
    
    // 添加模型过滤功能
    const filterOptions = {
        pattern: '',  // 用于存储正则表达式模式
        applyFilter: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent && glbParent.children.length > 0) {
                const pattern = filterOptions.pattern.trim();
                if (!pattern) {
                    // 如果没有输入过滤条件，显示所有模型
                    glbParent.children.forEach(child => {
                        child.visible = true;
                        // 更新可见性状态
                        if (modelVisibility[child.uuid] !== undefined) {
                            modelVisibility[child.uuid] = true;
                        }
                    });
                } else {
                    // 判断是否是排除模式（以!开头）
                    const isExcludeMode = pattern.startsWith('!');
                    const actualPattern = isExcludeMode ? pattern.substring(1) : pattern;
                    
                    try {
                        const regex = new RegExp(actualPattern, 'i');  // 不区分大小写
                        
                        glbParent.children.forEach(child => {
                            // 递归检查子模型名称
                            const checkChildren = (obj) => {
                                const nameMatches = regex.test(obj.name || '');
                                const newVisibility = isExcludeMode ? !nameMatches : nameMatches;
                                obj.visible = newVisibility;
                                
                                // 更新可见性状态
                                if (modelVisibility[obj.uuid] !== undefined) {
                                    modelVisibility[obj.uuid] = newVisibility;
                                }
                                
                                // 递归处理子对象
                                if (obj.children && obj.children.length > 0) {
                                    obj.children.forEach(checkChildren);
                                }
                            };
                            checkChildren(child);
                        });
                        
                        console.log(`已${isExcludeMode ? '排除' : '筛选'}模型，模式: ${actualPattern}`);
                    } catch (e) {
                        console.error('正则表达式无效:', e);
                        // 正则表达式无效时，显示所有模型
                        glbParent.children.forEach(child => {
                            child.visible = true;
                            // 更新可见性状态
                            if (modelVisibility[child.uuid] !== undefined) {
                                modelVisibility[child.uuid] = true;
                            }
                        });
                    }
                }
                // 刷新拓扑树以更新UI状态
                createModelTree();
                
                // 强制触发重绘
                controls.update();
                renderer.render(scene, camera);
                // 确保动画循环继续运行
                animate();
            }
        }
    };
    
    // 添加过滤输入框 - 使用onChange而不是onFinishChange，实现实时过滤
    modelFolder.add(filterOptions, 'pattern').name('模型名称过滤').onChange(filterOptions.applyFilter);
    
    // 添加模型显示控制
    const showModels = { show: true };
    modelFolder.add(showModels, 'show').name('显示模型').onChange(function(value) {
        // 控制模型的显示/隐藏逻辑
        console.log('模型显示状态:', value);
        const glbModels = scene.children.filter(child => child.name === window.currentModelName);
        if (glbModels.length > 0) {
            glbModels.forEach(model => {
                if (model) model.visible = value;
            });
            if (renderer && scene && camera) {
                renderer.render(scene, camera); // 强制渲染一帧
            }
        } else {
            console.warn(`未找到${window.currentModelName}模型`);
        }
    });

    // 添加平铺功能
    const tileFunctions = {
        tileXY: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent && glbParent.children.length > 0) {
                console.log(`找到${window.currentModelName}模型父节点及其子模型:`, glbParent.children);
                const spacing = 10; // 子模型之间的间距
                let x = 0, y = 0;
                
                // 只处理可见的子模型
                const visibleChildren = glbParent.children.filter(child => child.visible);
                
                visibleChildren.forEach((child, index) => {
                    // 重置旋转和缩放，确保原点对齐
                    child.rotation.set(0, 0, 0);
                    child.scale.set(1, 1, 1);
                    child.position.set(x, y, 0);
                    x += spacing;
                    if (x > 10000) { // 每行最多显示10个模型
                        x = 0;
                        y += spacing;
                    }
                });
                renderer.render(scene, camera);
            } else {
                console.warn(`未找到${window.currentModelName}模型父节点或子模型:`, glbParent);
            }
        },
        tileXZ: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent && glbParent.children.length > 0) {
                console.log(`找到${window.currentModelName}模型父节点及其子模型:`, glbParent.children);
                const spacing = 10; // 子模型之间的间距
                let x = 0, z = 0;
                
                // 只处理可见的子模型
                const visibleChildren = glbParent.children.filter(child => child.visible);
                
                visibleChildren.forEach((child, index) => {
                    // 重置旋转和缩放，确保原点对齐
                    child.rotation.set(0, 0, 0);
                    child.scale.set(1, 1, 1);
                    child.position.set(x, 0, z);
                    x += spacing;
                    if (x > 100) { // 每行最多显示10个模型
                        x = 0;
                        z += spacing;
                    }
                });
                renderer.render(scene, camera);
            } else {
                console.warn(`未找到${window.currentModelName}模型父节点或子模型:`, glbParent);
            }
        },
        tileYZ: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent && glbParent.children.length > 0) {
                console.log(`找到${window.currentModelName}模型父节点及其子模型:`, glbParent.children);
                const spacing = 10; // 子模型之间的间距
                let y = 0, z = 0;
                
                // 只处理可见的子模型
                const visibleChildren = glbParent.children.filter(child => child.visible);
                
                visibleChildren.forEach((child, index) => {
                    // 重置旋转和缩放，确保原点对齐
                    child.rotation.set(0, 0, 0);
                    child.scale.set(1, 1, 1);
                    child.position.set(0, y, z);
                    y += spacing;
                    if (y > 100) { // 每行最多显示10个模型
                        y = 0;
                        z += spacing;
                    }
                });
                renderer.render(scene, camera);
            } else {
                console.warn(`未找到${window.currentModelName}模型父节点或子模型:`, glbParent);
            }
        },
        reset: function() {
            const glbParent = scene.children.find(child => child.name === window.currentModelName);
            if (glbParent && glbParent.children.length > 0) {
                console.log('恢复子模型初始状态:', glbParent.children);
                
                // 只处理可见的子模型
                const visibleChildren = glbParent.children.filter(child => child.visible);
                
                visibleChildren.forEach((child) => {
                    const initial = modelInitialPositions[child.uuid];
                    if (initial) {
                        child.position.copy(initial.position);
                        child.rotation.copy(initial.rotation);
                        child.scale.copy(initial.scale);
                    } else {
                        // 如果没有记录初始位置，则重置为默认值
                        child.position.set(0, 0, 0);
                        child.rotation.set(0, 0, 0);
                        child.scale.set(1, 1, 1);
                    }
                });
                renderer.render(scene, camera);
            } else {
                console.warn(`未找到${window.currentModelName}模型父节点或子模型:`, glbParent);
            }
        }
    };

    // 添加平铺按钮
    modelFolder.add(tileFunctions, 'tileXY').name('XY平铺');
    modelFolder.add(tileFunctions, 'tileXZ').name('XZ平铺');
    modelFolder.add(tileFunctions, 'tileYZ').name('YZ平铺');
    
    // 添加恢复按钮
    modelFolder.add(tileFunctions, 'reset').name('恢复');
    
    // 添加渲染参数控制
    const renderFolder = gui.addFolder('渲染参数');
    renderFolder.add(parameters, 'antialias').name('启用抗锯齿').onChange((value) => {
        console.log('抗锯齿状态:', value ? '启用' : '禁用');
        renderer.antialias = value;
        renderer.setPixelRatio(window.devicePixelRatio); // 重新设置像素比以应用抗锯齿
        renderer.render(scene, camera); // 强制渲染一帧
    });
    
    //预留 
    
    // 添加天空盒参数控制
    const skyFolder = gui.addFolder('天空参数');
    
    // 添加天空盒切换控制
    skyFolder.add(parameters, 'useSkybox').name('使用天空盒').onChange(function(value) {
        useSkybox = value;
        parameters.useSkybox = value; // 确保两个变量保持同步
        
        // 强制清除渲染器状态，确保之前的设置不会影响新的设置
        renderer.clear();
        
        if (useSkybox) {
            // 如果天空盒未初始化，则初始化
            if (!sky) {
                initSky();
            } else if (!scene.children.includes(sky)) {
                // 如果天空盒已初始化但不在场景中，则添加到场景
                scene.add(sky);
            }
            
            // 使用天空盒时不需要背景色
            renderer.setClearColor(0x000000, 0);
            
            // 更新环境贴图
            if (pmremGenerator) {
                scene.environment = pmremGenerator.fromScene(scene).texture;
            }
        } else {
            // 不使用天空盒时，背景色设置为黑色
            renderer.setClearColor(0x000000, 1);
            
            // 清除环境贴图
            scene.environment = null;
            
            // 如果天空盒存在，从场景中移除
            if (sky && scene.children.includes(sky)) {
                scene.remove(sky);
            }
            
            // 强制更新渲染器的清除状态
            renderer.clear();
        }
        
        // 更新太阳控制器的启用状态
        updateSunControllers();
        
        // 立即渲染一帧以刷新显示
        renderer.render(scene, camera);
    });
    
    // 添加背景色启用控制
    skyFolder.add(parameters, 'useBackground').name('使用背景色').onChange(function(value) {
        // 只有在不使用天空盒时才考虑背景色设置
        if (!useSkybox) {
            if (value) {
                // 启用背景色
                renderer.setClearColor(parameters.backgroundColor, 1);
            } else {
                // 禁用背景色 - 使用透明背景
                renderer.setClearColor(0x000000, 0);
            }
            
            // 强制更新渲染器的清除状态
            renderer.clear();
            
            // 立即渲染一帧以刷新显示
            renderer.render(scene, camera);
        }
    });
    
    // 添加背景色控制 - 作为独立参数
    skyFolder.addColor(parameters, 'backgroundColor').name('背景色').onChange(function(value) {
        // 只有在不使用天空盒且启用背景色时才应用背景色
        if (!useSkybox && parameters.useBackground) {
            renderer.setClearColor(value, 1); // 设置不透明度为1，确保完全覆盖
            
            // 强制更新渲染器的清除状态
            renderer.clear();
            
            // 立即渲染一帧以刷新显示
            renderer.render(scene, camera);
        }
    });
    
    // 创建太阳控制子文件夹，只在启用天空盒时可用
    const sunFolder = skyFolder.addFolder('太阳控制');
    
    // 添加太阳高度控制
    const elevationController = sunFolder.add(parameters, 'elevation', 0, 90, 0.1).name('太阳高度').onChange(updateSun);
    
    // 添加太阳方位控制
    const azimuthController = sunFolder.add(parameters, 'azimuth', -180, 180, 0.1).name('太阳方位').onChange(updateSun);
    
    // 根据天空盒启用状态更新控制器
    function updateSunControllers() {
        const enabled = useSkybox;
        elevationController.enable(enabled);
        azimuthController.enable(enabled);
        if (enabled) {
            sunFolder.open();
        } else {
            sunFolder.close();
        }
    }
    
    // 初始更新控制器状态
    updateSunControllers();
    
    skyFolder.open();
    
    // 添加灯光参数控制
    const lightFolder = gui.addFolder('灯参数');
    
    // 环境光控制
    const ambientLightFolder = lightFolder.addFolder('环境光');
    ambientLightFolder.add(parameters, 'useAmbientLight').name('启用环境光').onChange(function(value) {
        if (value) {
            if (!ambientLight) {
                ambientLight = new THREE.AmbientLight(
                    parameters.ambientLightColor, 
                    parameters.ambientLightIntensity
                );
                scene.add(ambientLight);
            } else {
                // 如果环境光已存在但被移除，重新添加到场景
                if (!scene.children.includes(ambientLight)) {
                    scene.add(ambientLight);
                }
            }
        } else {
            if (ambientLight) {
                scene.remove(ambientLight);
            }
        }
        // 强制清除渲染器状态，确保更新生效
        renderer.clear();
        // 立即渲染一帧以刷新显示
        renderer.render(scene, camera);
    });
    
    ambientLightFolder.addColor(parameters, 'ambientLightColor').name('颜色').onChange(function(value) {
        if (ambientLight) {
            ambientLight.color.set(value);
            renderer.render(scene, camera);
        }
    });
    
    ambientLightFolder.add(parameters, 'ambientLightIntensity', 0, 3, 0.1).name('强度').onChange(function(value) {
        if (ambientLight) {
            ambientLight.intensity = value;
            renderer.render(scene, camera);
        }
    });
    
    // 定向光控制
    const directionalLightFolder = lightFolder.addFolder('定向光');
    directionalLightFolder.add(parameters, 'useDirectionalLight').name('启用定向光').onChange(function(value) {
        if (value) {
            if (!directionalLight) {
                directionalLight = new THREE.DirectionalLight(
                    parameters.directionalLightColor, 
                    parameters.directionalLightIntensity
                );
                directionalLight.position.set(
                    parameters.directionalLightPositionX, 
                    parameters.directionalLightPositionY, 
                    parameters.directionalLightPositionZ
                );
                directionalLight.castShadow = parameters.directionalLightCastShadow;
                directionalLight.shadow.mapSize.width = 1024;
                directionalLight.shadow.mapSize.height = 1024;
                scene.add(directionalLight);
            } else {
                // 如果定向光已存在但被移除，重新添加到场景
                if (!scene.children.includes(directionalLight)) {
                    scene.add(directionalLight);
                }
            }
        } else {
            if (directionalLight) {
                scene.remove(directionalLight);
            }
        }
        // 强制清除渲染器状态，确保更新生效
        renderer.clear();
        // 立即渲染一帧以刷新显示
        renderer.render(scene, camera);
    });
    
    directionalLightFolder.addColor(parameters, 'directionalLightColor').name('颜色').onChange(function(value) {
        if (directionalLight) {
            directionalLight.color.set(value);
            renderer.render(scene, camera);
        }
    });
    
    directionalLightFolder.add(parameters, 'directionalLightIntensity', 0, 3, 0.1).name('强度').onChange(function(value) {
        if (directionalLight) {
            directionalLight.intensity = value;
            renderer.render(scene, camera);
        }
    });
    
    directionalLightFolder.add(parameters, 'directionalLightPositionX', -200, 200, 10).name('X位置').onChange(function(value) {
        if (directionalLight) {
            directionalLight.position.x = value;
            renderer.render(scene, camera);
        }
    });
    
    directionalLightFolder.add(parameters, 'directionalLightPositionY', -200, 200, 10).name('Y位置').onChange(function(value) {
        if (directionalLight) {
            directionalLight.position.y = value;
            renderer.render(scene, camera);
        }
    });
    
    directionalLightFolder.add(parameters, 'directionalLightPositionZ', -200, 200, 10).name('Z位置').onChange(function(value) {
        if (directionalLight) {
            directionalLight.position.z = value;
            renderer.render(scene, camera);
        }
    });
    
    directionalLightFolder.add(parameters, 'directionalLightCastShadow').name('投射阴影').onChange(function(value) {
        if (directionalLight) {
            directionalLight.castShadow = value;
            renderer.render(scene, camera);
        }
    });
    
    // 半球光控制
    const hemisphereLightFolder = lightFolder.addFolder('半球光');
    hemisphereLightFolder.add(parameters, 'useHemisphereLight').name('启用半球光').onChange(function(value) {
        if (value) {
            if (!hemisphereLight) {
                hemisphereLight = new THREE.HemisphereLight(
                    parameters.hemisphereLightSkyColor, 
                    parameters.hemisphereLightGroundColor, 
                    parameters.hemisphereLightIntensity
                );
                scene.add(hemisphereLight);
            } else {
                // 如果半球光已存在但被移除，重新添加到场景
                if (!scene.children.includes(hemisphereLight)) {
                    scene.add(hemisphereLight);
                }
            }
        } else {
            if (hemisphereLight) {
                scene.remove(hemisphereLight);
            }
        }
        // 强制清除渲染器状态，确保更新生效
        renderer.clear();
        // 立即渲染一帧以刷新显示
        renderer.render(scene, camera);
    });
    
    hemisphereLightFolder.addColor(parameters, 'hemisphereLightSkyColor').name('天空颜色').onChange(function(value) {
        if (hemisphereLight) {
            hemisphereLight.color.set(value);
            renderer.render(scene, camera);
        }
    });
    
    hemisphereLightFolder.addColor(parameters, 'hemisphereLightGroundColor').name('地面颜色').onChange(function(value) {
        if (hemisphereLight) {
            hemisphereLight.groundColor.set(value);
            renderer.render(scene, camera);
        }
    });
    
    hemisphereLightFolder.add(parameters, 'hemisphereLightIntensity', 0, 3, 0.1).name('强度').onChange(function(value) {
        if (hemisphereLight) {
            hemisphereLight.intensity = value;
            renderer.render(scene, camera);
        }
    });
    
    // 打开灯光文件夹
    lightFolder.open();
}

// 存储模型初始位置的变量
const modelInitialPositions = {};

// 初始化场景设置
function initScene() {
    // 加载 GLB 文件
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://gcore.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    // 获取模型文件路径
    //const modelPath = 'models/戴珍珠耳环的黑人少女.glb';
    const modelPath = 'models/new一层_opt.glb';
    // 从路径中提取文件名（不含扩展名）
    const modelName = modelPath.split('/').pop().replace('.glb', '');
    
    // 将模型名称存储为全局变量，以便其他函数使用
    window.currentModelName = modelName;
    
    loader.load(
        modelPath,
        //'models/一层_opt.glb',
        function (gltf) {
            console.log('原始模型名称:', gltf.scene.name);
            gltf.scene.name = modelName;
            scene.add(gltf.scene);
            
            // 记录所有子模型的初始位置
            gltf.scene.children.forEach(child => {
                modelInitialPositions[child.uuid] = {
                    position: child.position.clone(),
                    rotation: child.rotation.clone(),
                    scale: child.scale.clone()
                };
            });
            
            console.log('GLB 文件加载成功');
            // 在模型加载成功后创建模型树
            createModelTree();
        },
        undefined,
        function (error) {
            console.error('GLB 文件加载失败:', error);
        }
    );
    // 确保useSkybox和parameters.useSkybox保持一致
    useSkybox = parameters.useSkybox;
    
    // 初始化光源
    initLights();
    
    // 强制清除渲染器状态，确保初始设置正确
    renderer.clear();
    
    // 根据useSkybox设置正确的背景
    if (useSkybox) {
        // 初始化天空盒
        initSky();
        // 使用天空盒时不需要背景色
        renderer.setClearColor(0x000000, 0);
        
        // 更新环境贴图
        if (pmremGenerator) {
            scene.environment = pmremGenerator.fromScene(scene).texture;
        }
        
        // 确保太阳控制器可用
        if (typeof updateSunControllers === 'function') {
            updateSunControllers();
        }
    } else {
        // 不使用天空盒时，设置背景色
        renderer.setClearColor(parameters.backgroundColor, 1); // 设置不透明度为1，确保完全覆盖
        
        // 确保没有环境贴图
        scene.environment = null;
        
        // 强制更新渲染器的清除状态
        renderer.clear();
        
        // 确保太阳控制器被禁用
        if (typeof updateSunControllers === 'function') {
            updateSunControllers();
        }
    }
    
    // 立即渲染一帧以应用初始设置
    renderer.render(scene, camera);
}

// 调用初始化函数
initGUI();
initScene();

/**
 * 动画循环函数
 * 负责：
 * 1. 更新水面动画
 * 2. 渲染场景
 * 3. 更新控制器
 * 4. 更新环境贴图
 */
function animate() {
    requestAnimationFrame(animate); // 请求下一帧动画
   
    //预留
    
    // 更新天空盒状态
    if (useSkybox && sky) {
        // 确保天空盒可见
        if (!scene.children.includes(sky)) {
            scene.add(sky);
            // 使用天空盒时不需要背景色
            renderer.setClearColor(0x000000, 0);
        }
        // 天空盒可能需要的动态更新
        // 这里可以添加天空盒的动态效果，如日落日出等
    } else if (sky && scene.children.includes(sky)) {
        // 如果天空盒不应该显示但仍在场景中，则移除它
        scene.remove(sky);
        // 根据背景色启用设置决定是否应用背景色
        if (parameters.useBackground) {
            renderer.setClearColor(parameters.backgroundColor, 1);
        } else {
            renderer.setClearColor(0x000000, 0); // 透明背景
        }
    }
    
    renderer.render(scene, camera); // 渲染场景
    controls.update(); // 更新轨道控制器
}
animate(); // 启动动画循环

/**
 * 窗口大小调整处理
 * 确保场景在窗口大小变化时保持正确的宽高比
 */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机宽高比
    camera.updateProjectionMatrix(); // 更新相机投影矩阵
    renderer.setSize(window.innerWidth, window.innerHeight); // 调整渲染器大小
});