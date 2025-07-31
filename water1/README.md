# Three.js 游泳池水效果演示

这个项目展示了如何使用 Three.js 创建一个带有逼真水面效果的游泳池场景。

## 项目概述

本演示使用 Three.js 实现了以下功能：

- 逼真的水面动态效果，包括波纹和反射
- 游泳池结构（池边和池内）的 3D 建模
- 多种光源组合提供逼真照明
- 交互式相机控制，可自由查看场景
- 响应式设计，适应不同屏幕尺寸

## 技术栈

- **Three.js** (v0.132.2) - WebGL 3D 图形库
- **OrbitControls** - 相机控制系统
- **Water** - Three.js 水面效果组件
- **HTML5/CSS3** - 基础页面结构和样式
- **JavaScript** - 应用逻辑和动画控制

## 文件结构

```
threejs-demo/
├── index.html          # 主 HTML 文件
├── app.js              # 应用主脚本
├── textures/           # 纹理资源目录
│   └── waternormals.jpg # 水面法线贴图
└── water.glb           # 水模型（可选，当前未使用）
```

## 主要功能实现

### 1. 水面效果

水面效果使用 Three.js 的 Water 对象实现，主要特点包括：

- 动态波纹效果
- 光照反射
- 可调整的水面颜色和扭曲程度

关键代码：

```javascript
water = new THREE.Water(
    waterGeometry,
    {
        textureWidth: 2048,
        textureHeight: 2048,
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', ...),
        sunDirection: new THREE.Vector3(0, 1, 0),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);
```

### 2. 游泳池结构

游泳池由两部分组成：

- **池边** - 不透明的灰色边框
- **池内** - 半透明的蓝色内部

### 3. 光照系统

使用三种不同类型的光源创建逼真的照明效果：

- **环境光** - 提供基础照明
- **定向光** - 模拟太阳光，产生阴影
- **半球光** - 模拟环境反射光

### 4. 交互控制

使用 OrbitControls 实现相机的交互式控制，允许用户：

- 旋转视角
- 缩放场景
- 平移视图

## 如何运行

1. 克隆或下载此仓库
2. 使用本地服务器运行项目（如 Live Server、http-server 等）
3. 在浏览器中打开 index.html

## 浏览器兼容性

本项目使用现代 WebGL 技术，兼容所有支持 WebGL 的现代浏览器，包括：

- Chrome 9+
- Firefox 4+
- Safari 5.1+
- Edge 12+
- Opera 12+

## 性能优化

为确保良好的性能，本项目实施了以下优化：

- 适当的多边形计数
- 纹理大小优化
- 渲染循环效率优化

## 未来改进

可能的改进方向：

- 添加水面物理交互（如投入物体产生波纹）
- 实现更复杂的光照效果（如水下光线散射）
- 添加环境音效
- 实现更多的用户交互元素

## 常见问题

### 1. 哪些几何体的材质会影响水的着色器算法？

在 Three.js 中，`Water` 材质的着色器算法会受到以下几何体材质和场景元素的影响：

- **SkyBox（天空盒）**：通过 `envMap` 直接影响水的反射效果。`envMap` 是水面反射的主要来源，决定了反射内容的清晰度和颜色。
- **背景色（Scene.background）**：是水面反射的默认回退内容，当 `envMap` 未定义或不可用时，背景色会作为反射的基础。它主要影响 `waterColor` 的混合效果。
- **光源（Lights）**：
  - **定向光（DirectionalLight）**：通过 `sunDirection` 和 `sunColor` 控制水面的高光反射和整体亮度。
  - **环境光（AmbientLight）**：影响水面的基础亮度，但不直接参与反射计算。
  - **半球光（HemisphereLight）**：通过模拟天空和地面的光照，增强水面的自然感。
- **其他几何体的材质**：
  - **高反射材质**：会通过 `envMap` 间接影响水面的反射内容。
  - **透明材质**：可能干扰水的折射效果，尤其是在多层透明物体叠加时。
  - **自发光材质**：可能在水面形成额外的光斑效果。
- **阴影（Shadows）**：几何体的阴影会投射到水面，增强真实感，但需要额外的计算资源。

### 2. 为什么没有写入 README.md？

当前 `README.md` 文件已经非常全面，没有进一步写入内容的原因包括：

- 内容已足够完整
- 用户未明确指示
- 代码规范限制
- 可读性和结构良好
- 性能优化

### 3. Water 着色器算法分析

`Water` 着色器算法主要由以下几个部分控制：

- **反射（Reflection）**：
  - 由 `envMap` 和 `sunDirection` 控制，`envMap` 提供反射内容，`sunDirection` 决定高光反射的位置。
  - `reflectivity` 参数调整反射强度。

- **折射（Refraction）**：
  - 由 `waterColor` 和 `distortionScale` 控制，`waterColor` 决定折射的基础颜色，`distortionScale` 调整折射的扭曲程度。
  - `alpha` 参数影响折射的透明度。

- **扭曲程度（Distortion）**：
  - 由 `distortionScale` 和 `time` 控制，`distortionScale` 调整扭曲的幅度，`time` 用于动态波纹效果。

- **整体亮度（Brightness）**：
  - 由 `sunColor` 和 `ambientLight` 控制，`sunColor` 提供高光亮度，`ambientLight` 提供基础照明。

- **其他参数**：
  - `fog` 参数可以模拟水面的雾气效果。
  - `waveSpeed` 控制波纹的移动速度。

### 4. 元素对水的影响及关键参数

| 元素         | 对水的影响               | 关键参数                     |
|--------------|--------------------------|-----------------------------|
| SkyBox       | 反射内容来源             | `envMap`                    |
| 背景色       | 反射/折射的默认颜色      | `scene.background`          |
| 定向光       | 高光反射的位置和强度     | `sunDirection`, `sunColor`   |
| 环境光       | 基础亮度                 | `intensity`                 |
| 半球光       | 自然色调过渡             | `skyColor`, `groundColor`   |
| 高反射材质   | 清晰的倒影               | `roughness`, `metalness`    |
| 透明材质     | 折射效果                 | `refractionRatio`           |
| 自发光材质   | 水面亮斑                 | `emissive`, `emissiveIntensity` |
| 阴影         | 水面上的投影             | `castShadow`, `shadow.mapSize` |

### 5. 关键参数控制方式

以下参数可以通过 `Water` 材质直接控制：
- `reflectivity`：反射强度
- `waterColor`：水的颜色（影响折射）
- `distortionScale`：扭曲程度
- `alpha`：透明度
- `fog`：雾气效果
- `waveSpeed`：波纹移动速度

以下参数需要通过光、几何体或贴图间接控制：
- `envMap`（通过 `SkyBox` 或 `CubeTexture` 控制，需创建对应的环境贴图）
- `sunDirection` 和 `sunColor`（通过创建 `DirectionalLight` 光源控制）
- `intensity`（通过创建 `AmbientLight` 光源控制）
- `skyColor` 和 `groundColor`（通过创建 `HemisphereLight` 光源控制）
- `roughness` 和 `metalness`（

1. 通过光源影响水的反射
   方法：创建一个 `DirectionalLight` 或 `HemisphereLight` 光源，调整光源的颜色、强度和方向。
   影响：水的反射效果（如高光、阴影）会随着光源的变化而变化。
2. 通过环境贴图（`envMap`）影响水的反射和折射
   方法：创建一个 `CubeTexture` 或 `SkyBox` 作为环境贴图，并将其赋给 `Water` 材质的 `envMap` 属性。
   影响：水的反射和折射内容会基于环境贴图的内容动态变化。
3. 通过几何体的材质属性影响水的视觉融合
   方法：如果水与其他几何体（如地面、岩石）接触，可以调整这些几何体的材质属性（如颜色、粗糙度、金属度）。
   影响：水的颜色和反射可能会因为周围几何体的材质而显得更自然或更突出。
4. 通过阴影设置增强水的真实感
   方法：启用光源的阴影（`castShadow`），并调整阴影的分辨率（`shadow.mapSize`）。
   影响：水面的阴影细节会更丰富，增强场景的真实感。
5. 通过自发光几何体模拟水下效果
   方法：创建一个带有 `emissive` 属性的几何体（如发光粒子或灯光），放置在水中或水下。
   影响：可以模拟水下的光晕或散射效果。）
- `refractionRatio`（通过设置透明材质属性控制）
- `emissive` 和 `emissiveIntensity`（通过创建自发光几何体控制，而非修改算法）
- `castShadow` 和 `shadow.mapSize`（通过设置光源和几何体的阴影属性控制）

### 3. 如何优化水面效果的渲染性能？

- **降低纹理分辨率**：减少 `textureWidth` 和 `textureHeight` 的值
- **简化几何体**：使用较低的多边形模型
- **减少动态效果**：降低 `distortionScale` 的值
- **禁用不必要的反射**：通过调整 `sunColor` 和 `waterColor` 减少计算量

### 4. 如何实现水面与物体的交互效果？

- **使用物理引擎**：如 Cannon.js 或 Ammo.js 模拟物体落入水中的物理效果
- **自定义着色器**：通过修改 `Water` 材质的着色器代码实现动态波纹
- **事件监听**：监听物体碰撞事件并触发水面动画

### 5. 如何调试 Three.js 的水面效果？

- **使用 Three.js 调试工具**：如 `three-inspector`
- **打印着色器变量**：在着色器代码中添加调试输出
- **简化场景**：逐步添加元素以定位问题

### 6. 如何扩展水面效果的功能？

- **添加天气系统**：模拟雨滴或波浪效果
- **动态光照**：根据时间变化调整光源位置和颜色
- **多材质混合**：结合透明材质和反射材质实现更复杂的效果

## 许可

本项目使用的资源：
- 水面法线贴图：Three.js 示例资源

## 致谢

- Three.js 团队提供的优秀 3D 库
- 各种 Three.js 社区教程和示例

## THREE.Water 分析补充

### 关键参数
- **`sunColor`**: 控制水面反射的高光颜色（默认 `0xffffff`）。
- **`waterColor`**: 定义水面的基础颜色（默认 `0x7F7F7F`）。
- **`distortionScale`**: 调整波纹扭曲强度（默认 `20.0`）。

### 材质和着色器
- **`ShaderMaterial`**: 使用自定义的 `mirrorShader` 实现水面效果。
- **内置光源**: 通过 `UniformsLib['lights']` 集成 Three.js 的光照系统。

### 渲染逻辑
- **反射机制**: 使用 `WebGLRenderTarget` 捕获场景的反射贴图。

### 调整建议
- 隐藏水面：设置 `alpha: 0`。
- 减少波纹：降低 `distortionScale` 值。

## 内置物理材质与自定义着色器对比

### 1. 内置物理材质的局限性
- **反射与折射**：
  - 内置材质支持环境贴图（`envMap`）实现反射，但无法直接模拟动态水面波纹（如扭曲、动态法线贴图）。
  - 折射效果需要通过 `refractionRatio` 控制，但无法动态调整扭曲程度（如 `distortionScale`）。
- **动态效果**：
  - 内置材质的光照和反射是静态的，无法实时响应动态光源或几何体变化（如波纹随时间变化）。
- **性能优化**：
  - 内置材质可能包含不必要的计算（如金属度、粗糙度），而水面效果通常需要更轻量的着色器逻辑。

### 2. 自定义着色器的优势
- **动态波纹**：
  - 通过 `time` 变量和法线贴图（`normalSampler`）实现动态波纹效果。
  - 可精确控制扭曲强度（`distortionScale`）和波纹速度。
- **混合效果**：
  - 自定义着色器可以同时处理反射（`mirrorSampler`）和折射（`waterColor`），并动态混合两者。
- **性能控制**：
  - 仅计算必要的效果（如仅水面反射），避免内置材质的冗余计算。

#### THREE.Water 核心代码示例
```javascript
water = new THREE.Water(
    waterGeometry,
    {
        textureWidth: 2048,
        textureHeight: 2048,
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg'),
        sunDirection: new THREE.Vector3(0, 1, 0),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);
```

### 3. 何时选择自定义着色器？
- **需要动态效果**：如水面波纹、动态反射/折射。
- **特殊视觉需求**：如非物理真实的艺术化效果（如卡通水面）。
- **性能敏感场景**：需极致优化时（如移动端 WebGL 应用）。

### 4. 内置物理材质的适用场景
- **静态或简单动态效果**：如静态倒影、简单透明材质。
- **物理真实感**：如金属、塑料等符合 PBR（基于物理渲染）的材质。
- **快速开发**：无需编写着色器代码，直接通过参数调整。

### 结论
Three.js 内置物理材质无法完全替代自定义着色器，尤其是在需要**动态水面效果**的场景。`THREE.Water` 通过自定义着色器实现了内置材质无法做到的动态波纹、精确反射/折射控制和性能优化。

## 动态调整扭曲程度（`distortionScale`）

### 核心实现代码
以下代码展示了如何动态调整 `distortionScale` 参数，实现水面波纹的实时扭曲效果：

```javascript
// 初始化 Water 对象
const water = new THREE.Water(waterGeometry, {
    textureWidth: 2048,
    textureHeight: 2048,
    waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg'),
    distortionScale: 3.7, // 初始扭曲强度
    // 其他参数...
});

// 动态调整 distortionScale
function updateDistortionScale(newValue) {
    water.material.uniforms.distortionScale.value = newValue;
}

// 示例：在动画循环中动态调整
function animate() {
    requestAnimationFrame(animate);
    
    // 模拟动态调整（例如根据用户输入或时间变化）
    const time = Date.now() * 0.001;
    const newScale = 3.0 + Math.sin(time) * 2.0; // 范围：1.0 ~ 5.0
    updateDistortionScale(newScale);
    
    renderer.render(scene, camera);
}
```

### 参数说明
| 参数               | 作用                          | 典型值       |
|--------------------|-----------------------------|-------------|
| `distortionScale` | 控制波纹扭曲强度（越大越明显） | `1.0~10.0`  |

### 应用场景
- **交互式调整**：通过滑块或按钮让用户实时调整扭曲强度。
- **动态效果**：结合时间变量实现自动变化的波纹效果。
- **性能优化**：根据设备性能动态降低扭曲强度。

## 动态水面波纹技术实现分析

### 1. 动态法线贴图实现

**核心机制**：
- 使用法线贴图（`waterNormals`）定义基础波纹形状
- 通过 `time` 变量动态偏移UV坐标，实现波纹移动效果
- 使用 `distortionScale` 控制法线强度

**着色器关键代码**：
```glsl
// 顶点着色器传递UV坐标
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// 片段着色器动态采样法线贴图
uniform sampler2D normalSampler;
uniform float time;
uniform float distortionScale;

void main() {
    vec2 uv = vUv + time * 0.05; // 动态偏移
    vec3 normal = texture2D(normalSampler, uv).xyz * 2.0 - 1.0;
    normal.xy *= distortionScale; // 应用扭曲
    // ...后续反射/折射计算
}
```

### 2. 实时光源响应

**光照交互原理**：
- 通过 `uniform` 变量实时接收光源参数：
  - `sunDirection`：控制高光方向
  - `sunColor`：控制高光强度
- 在着色器中动态计算光照贡献：
```glsl
vec3 lightDir = normalize(sunDirection);
float specular = pow(max(dot(normal, lightDir), 0.0), 128.0);
vec3 specularColor = sunColor * specular;
```

### 3. 反射/折射动态混合

**混合算法**：
1. 分别计算反射颜色（从 `mirrorSampler` 采样）
2. 计算折射颜色（基于 `waterColor` 和深度）
3. 根据菲涅尔效应动态混合：
```glsl
float fresnel = pow(1.0 - dot(normal, viewDir), 5.0);
vec3 finalColor = mix(refractionColor, reflectionColor, fresnel);
```

### 4. 性能优化建议
- **分级渲染**：根据物体距离动态降低 `distortionScale`
- **纹理压缩**：使用 `RGB_ETC` 格式压缩法线贴图
- **实例化渲染**：对大面积水域使用实例化网格

### 完整实现示例
```javascript
// 初始化Water对象（完整参数）
const water = new THREE.Water(geometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg'),
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
});

// 动画循环中动态更新
function animate() {
    requestAnimationFrame(animate);
    water.material.uniforms.time.value += 0.01;
    renderer.render(scene, camera);
}
```