export default 
{
    'SceneManager':
    {
        enabled: true,
        Color: {
            enabled: true,
            value: 0x3e7070 // 默认背景颜色
        },
        fog: {
            enabled: true,
            color: 0xcccccc, // 雾颜色
            near: 10, // 近端距离
            far: 50 // 远端距离
        },
        environment: {
            enabled: false,
            path: '' // 环境光贴图路径
        },
        scenes: {
            enabled: false,
            default: 'main', // 默认场景
            list: ['main', 'secondary'] // 场景列表
        }
    },
    'CameraManager':
    {
        enabled: false,
        cameraType: 'perspective', // 相机类型
        cameraOptions: {
            fov: 75, // 视野角度
            aspect: window.innerWidth / window.innerHeight, // 宽高比
            near: 0.1, // 近端距离
            far: 1000 // 远端距离
        }
    },
    'LightManager':
    {
        enabled: true,
        ambientLight: {
            enabled: true,
            color: 0x00ff00, 
            intensity: 0.1
        },
        directionalLight: {
            enabled: true,
            color: 0xffffff, 
            intensity: 1, 
            position: [5, 2, -1]
        }, 
        hemiLight: {
            enabled: true,
            color: 0xffffff, 
            groundColor: 0xffffff, 
            intensity: 1
        },
        spotLight: {
            enabled: false,
            color: 0x709af3, 
            intensity: 1,
            position: [0, 5, 5],
            shadowmap: {
                enabled: true, 
                near: 10, 
                far: 20,
                mapwidth: 1024,
                mapheight: 1024,
                cameraangle: 35
            }
        },
        pointLight: {
            enabled: true,
            color: 0xffffff,
            intensity: 1,
            position: [0, 5, 5],
            distance: 0,
            decay: 0.01,
            castShadow: true,
            shadowMap: {
                enabled: true,
                near: 10,
                far: 20,
                mapwidth: 1024,
                mapheight: 1024,
                cameraangle: 35
            }
        },
        directionalShadow: {
            enabled: false,
            color: 0xffffff,
            intensity: 1,
            position: [0, 0, 0],
            castShadow: true,
            shadowMap: {
                enabled: true,
                near: 10,
                far: 20,
                mapwidth: 1024,
                mapheight: 1024,
                cameraangle: 35
            }
        }
    },
    'RenderManager':
    {
        enabled: false,
        postprocessing: {
            enabled: true,
            antialias: true, // 抗锯齿
            bloom: {
                enabled: false, // Bloom 效果
                strength: 1.5,
                radius: 0.4
            }
        },
        shadow: {
            enabled: true, // 启用阴影
            type: 'PCFSoftShadowMap', // 阴影类型
            resolution: 2048 // 阴影贴图分辨率
        }
    },
    'DebugUI':
    {
        enabled: false
    }
}