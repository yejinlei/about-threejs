// Three.js 应用配置文件 - 恢复为官方默认参数
// 参考: Three.js官方构造函数默认值及核心组件规范

export default {
    'SceneManager': {
        enabled: true,
        Color: {
            enabled: true,
            value: 0x000000 // 默认背景色：黑色 <mcreference link="https://blog.csdn.net/w131552/article/details/144246281" index="4"></mcreference>
        },
        fog: {
            enabled: false, // 默认禁用雾效
            color: 0xcccccc,
            near: 10,
            far: 50
        },
        environment: {
            enabled: false,
            path: ''
        },
        scenes: {
            enabled: false,
            default: 'main',
            list: ['main', 'secondary']
        }
    },
    'CameraManager': {
        enabled: true, // 默认启用相机
        cameraType: 'perspective',
        cameraOptions: {
            fov: 75, // 透视相机默认视野角度
            aspect: window.innerWidth / window.innerHeight, // 默认宽高比
            near: 0.1, // 默认近裁剪面
            far: 2000 // 默认远裁剪面 <mcreference link="https://blog.csdn.net/w131552/article/details/144246281" index="4"></mcreference>
        }
    },
    'LightManager': {
        enabled: true,
        ambientLight: {
            enabled: true,
            color: 0xffffff, // 默认环境光颜色：白色
            intensity: 1 // 默认环境光强度 <mcreference link="https://blog.csdn.net/weixin_47970498/article/details/146376269" index="1"></mcreference>
        },
        directionalLight: {
            enabled: false,
            color: 0xffffff, // 默认方向光颜色：白色
            intensity: 1, // 默认方向光强度
            position: {x: 0, y: 1, z: 0} // 默认方向光位置
        }, 
        // 新增矩形区域光源配置
        rectAreaLight: {
            enabled: false, // 默认禁用
            color: 0xffffff, // 光源颜色（白色）
            intensity: 1.0, // 光照强度
            width: 10, // 光源宽度
            height: 10, // 光源高度
            position: {x: 0, y: 1, z: 0} // 光源位置
        },
        hemiLight: {
            enabled: false, // 半球光默认不启用
            color: 0xffffff,
            groundColor: 0xffffff,
            intensity: 1,
            position: {
                x: 0,
                y: 5,
                z: 0
            }
        },
        spotLight: {
            enabled: false,
            color: 0x709af3,  // 聚光灯颜色（淡蓝色）
            intensity: 1,    // 聚光灯强度
            distance: 0,     // 光照距离（0表示无限远）
            angle: 45,       // 聚光灯角度
            penumbra: 0.3,      // 聚光灯半影宽度
            decay: 2,        // 聚光灯衰减率
            position: {x: 0, y: 5, z: 5}, // 聚光灯位置,
            target: [0, 0, 0],  // 聚光灯目标位置
            shadowmap: {
                enabled: true,  // 是否启用聚光灯阴影
                near: 10,      // 阴影近裁剪面
                far: 20,       // 阴影远裁剪面
                mapwidth: 1024,  // 阴影贴图宽度
                mapheight: 1024, // 阴影贴图高度
                cameraangle: 35  // 聚光灯光照角度
            }
        },
        pointLight: {
            enabled: false, // 点光源默认不启用
            color: 0xffffff,  // 点光源颜色（白色）
            intensity: 1,    // 点光源强度
            position: {x: 0, y: 5, z: 5}, // 点光源位置,
            distance: 0,     // 光照距离（0表示无限远）
            decay: 2,     // 光照衰减率
            castShadow: false,  // 是否投射阴影
            shadowMap: {
                enabled: true,  // 是否启用阴影贴图
                near: 10,      // 阴影近裁剪面
                far: 20,       // 阴影远裁剪面
                mapwidth: 1024,  // 阴影贴图宽度
                mapheight: 1024, // 阴影贴图高度
                cameraangle: 35  // 点光源视角
            }
        },
        directionalShadow: {
            enabled: false
        }
    },
    'RenderManager': {
        enabled: true,
        postprocessing: {
            enabled: false, // 后处理默认禁用
            antialias: false, // 抗锯齿默认关闭 <mcreference link="https://blog.csdn.net/weixin_34085658/article/details/88838650" index="3"></mcreference>
            bloom: {
                enabled: false,
                strength: 1.5,  // 发光强度
                radius: 0.4     // 发光半径
            }
        },
        shadow: {
            enabled: false, // 阴影默认禁用
            type: 'PCFSoftShadowMap',  // 阴影类型（PCF软阴影）
            resolution: 2048  // 阴影贴图分辨率
        }
    },
    'DebugUI': {
        enabled: false
    }
}