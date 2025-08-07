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
        enabled: false
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
        },
    },
    'DebugUI':
    {
        enabled: false
    }
}