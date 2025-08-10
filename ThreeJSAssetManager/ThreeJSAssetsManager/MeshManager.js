// 从 three 库中导入所需的几何体、材质和网格类
import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Mesh, PlaneGeometry, SphereGeometry, CylinderGeometry, ConeGeometry, TorusGeometry, IcosahedronGeometry, CircleGeometry, DodecahedronGeometry, EdgesGeometry, ExtrudeGeometry, LatheGeometry, OctahedronGeometry, PolyhedronGeometry, RingGeometry, ShapeGeometry, TetrahedronGeometry, TorusKnotGeometry, TubeGeometry, WireframeGeometry, MeshPhongMaterial } from 'three';

// 导入 ThreeJSAssetsManager 类
import ThreeJSAssetsManager from "./ThreeJSAssetsManager.js";

// 导入 Horse 类，注意这里文件名大小写可能存在问题
import Horse from "./World/horse.js";

/**
 * MeshManager 类用于管理场景中的网格对象，包括加载资源和创建几何体。
 */
export default class MeshManager
{
    /**
     * 构造函数，初始化 MeshManager 实例。
     */
    constructor()
    {
        // 获取 ThreeJSAssetsManager 的单例实例
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        // 从管理器实例中获取场景对象
        this.scene = this.threejsassetsmanagerInstance.scene;
        // 从管理器实例中获取资源对象
        this.resources = this.threejsassetsmanagerInstance.resources;
        // 从管理器实例中获取调试模式标志
        this.debug = this.threejsassetsmanagerInstance.debug;
        // 从管理器实例中获取 GUI 对象
        this.gui = this.threejsassetsmanagerInstance.gui;
        // 从管理器实例中获取几何体对象
        this.geometries = this.threejsassetsmanagerInstance.geometries;
        // 初始化一个数组，用于存储 Horse 实例
        this.horses = [];

        // 如果处于调试模式且 GUI 对象存在
        if(this.debug && this.gui)
        {
            // 在 GUI 中添加一个名为 'MeshManager(网格管理)' 的文件夹
            this.gui.meshFolder = this.gui.addFolder('MeshManager(网格管理)');
        }

        // 等待资源加载完成后执行回调函数
        this.resources.on('ready', () => {
            // 遍历所有资源
            this.resources.sources.forEach(object =>
            {
                // 如果资源类型为 'glbModel'
                if (object.type === 'glbModel')
                {
                    // 创建一个新的 Horse 实例并添加到 horses 数组中
                    this.horses.push(new Horse(object.name));
                }
            })
        });
        
        // 测试用代码，创建一个立方体并添加到场景中
        // if (!this.geometries['box1']) {
        //     const geometry1 = new BoxGeometry( 1, 1, 1 ); 
        //     const material = new MeshBasicMaterial( {color: 0xffff00} ); 
        //     const cube = new Mesh( geometry1, material ); 
        //     this.scene.add(cube);
        //     this.geometries['box1'] = cube;
        // }
        
        // 以下注释代码用于添加不同类型的几何体到场景中
        // // 添加平面几何体
        // const planeGeometry = new PlaneGeometry(50, 50);
        // const planeMaterial = new MeshStandardMaterial({ color: 0x777777 });
        // const plane = new Mesh(planeGeometry, planeMaterial);
        // plane.rotation.x = -Math.PI / 2;
        // plane.position.y = -1;
        // this.scene.add(plane);

        // // 添加球体
        // const sphereGeometry = new SphereGeometry(0.5, 32, 32);
        // const sphereMaterial = new MeshStandardMaterial({ color: 0xff0000 });
        // const sphere = new Mesh(sphereGeometry, sphereMaterial);
        // sphere.position.set(2, 0, 0);
        // this.scene.add(sphere);

        // // 添加圆柱体
        // const cylinderGeometry = new CylinderGeometry(0.5, 0.5, 1, 32);
        // const cylinderMaterial = new MeshStandardMaterial({ color: 0x00ff00 });
        // const cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
        // cylinder.position.set(-2, 0, 0);
        // this.scene.add(cylinder);

        // // 添加圆锥体
        // const coneGeometry = new ConeGeometry(0.5, 1, 32);
        // const coneMaterial = new MeshStandardMaterial({ color: 0x0000ff });
        // const cone = new Mesh(coneGeometry, coneMaterial);
        // cone.position.set(0, 0, 2);
        // this.scene.add(cone);

        // // 添加圆环体
        // const torusGeometry = new TorusGeometry(0.5, 0.2, 16, 100);
        // const torusMaterial = new MeshStandardMaterial({ color: 0xffff00 });
        // const torus = new Mesh(torusGeometry, torusMaterial);
        // torus.position.set(0, 0, -2);
        // this.scene.add(torus);

        // // 添加二十面体
        // const icosahedronGeometry = new IcosahedronGeometry(0.5, 0);
        // const icosahedronMaterial = new MeshStandardMaterial({ color: 0xff00ff });
        // const icosahedron = new Mesh(icosahedronGeometry, icosahedronMaterial);
        // icosahedron.position.set(2, 0, 2);
        // this.scene.add(icosahedron);
    }

    /**
     * 更新方法，遍历所有 Horse 实例并调用其 update 方法。
     */
    update() {
        // 如果存在单个 horse 实例，调用其 update 方法
        // if (this.horse)
        //     this.horse.update();
        // 遍历所有 Horse 实例并调用其 update 方法
        this.horses.forEach(horse => horse.update());
    }

    /**
     * 创建并添加所有几何体到场景中。
     */
    createGeometries() {
        // 胶囊体
        // 如果 geometries 对象中不存在 'capsule' 属性
        if (!this.geometries['capsule']) {
            // 创建一个胶囊体几何体
            const capsuleGeometry = new CapsuleGeometry(0.5, 1, 4, 8);
            // 创建一个 MeshPhongMaterial 材质
            const capsuleMaterial = new MeshPhongMaterial({ color: 0xff8800 });
            // 创建一个网格对象
            const capsule = new Mesh(capsuleGeometry, capsuleMaterial);
            // 设置网格对象的位置
            capsule.position.set(-4, 0, 0);
            // 将网格对象添加到场景中
            this.scene.add(capsule);
            // 将网格对象存储到 geometries 对象中
            this.geometries['capsule'] = capsule;
        }

        // 圆形
        // 创建一个圆形几何体
        const circleGeometry = new CircleGeometry(0.5, 32);
        // 创建一个 MeshPhongMaterial 材质
        const circleMaterial = new MeshPhongMaterial({ color: 0x8800ff });
        // 创建一个网格对象
        const circle = new Mesh(circleGeometry, circleMaterial);
        // 设置网格对象的位置
        circle.position.set(-4, 0, 2);
        // 将网格对象添加到场景中
        this.scene.add(circle);

        // 十二面体
        // 创建一个十二面体几何体
        const dodecahedronGeometry = new DodecahedronGeometry(0.5);
        // 创建一个 MeshPhongMaterial 材质
        const dodecahedronMaterial = new MeshPhongMaterial({ color: 0x00ffff });
        // 创建一个网格对象
        const dodecahedron = new Mesh(dodecahedronGeometry, dodecahedronMaterial);
        // 设置网格对象的位置
        dodecahedron.position.set(-4, 0, -2);
        // 将网格对象添加到场景中
        this.scene.add(dodecahedron);

        // 边缘几何体
        // 创建一个边缘几何体，基于立方体几何体
        const edgesGeometry = new EdgesGeometry(new BoxGeometry(0.5, 0.5, 0.5));
        // 创建一个 MeshPhongMaterial 材质，设置为线框模式
        const edgesMaterial = new MeshPhongMaterial({ color: 0xffffff, wireframe: true });
        // 创建一个网格对象
        const edges = new Mesh(edgesGeometry, edgesMaterial);
        // 设置网格对象的位置
        edges.position.set(-2, 0, 4);
        // 将网格对象添加到场景中
        this.scene.add(edges);

        // 挤压几何体
        // 定义挤压设置
        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        // 创建一个形状对象
        const extrudeGeometry = new ExtrudeGeometry(new Shape([new Vector2(0,0), new Vector2(0.5,0), new Vector2(0.5,0.5), new Vector2(0,0.5)]), extrudeSettings);
        // 创建一个 MeshPhongMaterial 材质
        const extrudeMaterial = new MeshPhongMaterial({ color: 0xff00ff });
        // 创建一个网格对象
        const extrude = new Mesh(extrudeGeometry, extrudeMaterial);
        // 设置网格对象的位置
        extrude.position.set(-2, 0, -4);
        // 将网格对象添加到场景中
        this.scene.add(extrude);

        // 旋转几何体
        // 定义旋转点数组
        const lathePoints = [new Vector2(0,0), new Vector2(0.5,0.2), new Vector2(0.3,0.5), new Vector2(0,0.5)];
        // 创建一个旋转几何体
        const latheGeometry = new LatheGeometry(lathePoints, 12);
        // 创建一个 MeshPhongMaterial 材质
        const latheMaterial = new MeshPhongMaterial({ color: 0xffff00 });
        // 创建一个网格对象
        const lathe = new Mesh(latheGeometry, latheMaterial);
        // 设置网格对象的位置
        lathe.position.set(0, 0, 4);
        // 将网格对象添加到场景中
        this.scene.add(lathe);

        // 八面体
        // 创建一个八面体几何体
        const octahedronGeometry = new OctahedronGeometry(0.5);
        // 创建一个 MeshPhongMaterial 材质
        const octahedronMaterial = new MeshPhongMaterial({ color: 0x00ff88 });
        // 创建一个网格对象
        const octahedron = new Mesh(octahedronGeometry, octahedronMaterial);
        // 设置网格对象的位置
        octahedron.position.set(0, 0, -4);
        // 将网格对象添加到场景中
        this.scene.add(octahedron);

        // 多面体
        // 定义多面体的顶点数组
        const polyhedronVertices = [1,1,1, -1,-1,1, -1,1,-1, 1,-1,-1];
        // 定义多面体的索引数组
        const polyhedronIndices = [2,1,0, 0,3,2, 1,3,0, 2,3,1];
        // 创建一个多面体几何体
        const polyhedronGeometry = new PolyhedronGeometry(polyhedronVertices, polyhedronIndices, 0.5);
        // 创建一个 MeshPhongMaterial 材质
        const polyhedronMaterial = new MeshPhongMaterial({ color: 0x880088 });
        // 创建一个网格对象
        const polyhedron = new Mesh(polyhedronGeometry, polyhedronMaterial);
        // 设置网格对象的位置
        polyhedron.position.set(2, 0, 4);
        // 将网格对象添加到场景中
        this.scene.add(polyhedron);

        // 环形几何体
        // 创建一个环形几何体
        const ringGeometry = new RingGeometry(0.3, 0.5, 32);
        // 创建一个 MeshPhongMaterial 材质
        const ringMaterial = new MeshPhongMaterial({ color: 0x0088ff });
        // 创建一个网格对象
        const ring = new Mesh(ringGeometry, ringMaterial);
        // 设置网格对象的位置
        ring.position.set(2, 0, -4);
        // 将网格对象添加到场景中
        this.scene.add(ring);

        // 形状几何体
        // 创建一个形状对象
        const shape = new Shape();
        // 移动到起始点
        shape.moveTo(0,0);
        // 绘制线段
        shape.lineTo(0.5,0);
        shape.lineTo(0.5,0.5);
        shape.lineTo(0,0.5);
        // 创建一个形状几何体
        const shapeGeometry = new ShapeGeometry(shape);
        // 创建一个 MeshPhongMaterial 材质
        const shapeMaterial = new MeshPhongMaterial({ color: 0xff8800 });
        // 创建一个网格对象
        const shapeMesh = new Mesh(shapeGeometry, shapeMaterial);
        // 设置网格对象的位置
        shapeMesh.position.set(4, 0, 0);
        // 将网格对象添加到场景中
        this.scene.add(shapeMesh);

        // 四面体
        // 创建一个四面体几何体
        const tetrahedronGeometry = new TetrahedronGeometry(0.5);
        // 创建一个 MeshPhongMaterial 材质
        const tetrahedronMaterial = new MeshPhongMaterial({ color: 0x88ff00 });
        // 创建一个网格对象
        const tetrahedron = new Mesh(tetrahedronGeometry, tetrahedronMaterial);
        // 设置网格对象的位置
        tetrahedron.position.set(4, 0, 2);
        // 将网格对象添加到场景中
        this.scene.add(tetrahedron);

        // 环面纽结
        // 创建一个环面纽结几何体
        const torusKnotGeometry = new TorusKnotGeometry(0.5, 0.2, 100, 16);
        // 创建一个 MeshPhongMaterial 材质
        const torusKnotMaterial = new MeshPhongMaterial({ color: 0x00ffff });
        // 创建一个网格对象
        const torusKnot = new Mesh(torusKnotGeometry, torusKnotMaterial);
        // 设置网格对象的位置
        torusKnot.position.set(4, 0, -2);
        // 将网格对象添加到场景中
        this.scene.add(torusKnot);

        // 管状几何体
        // 创建一个曲线对象
        const tubePath = new Curve();
        // 定义曲线的点获取函数
        tubePath.getPoint = function(t) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;
            return new Vector3(tx, ty, tz);
        };
        // 创建一个管状几何体
        const tubeGeometry = new TubeGeometry(tubePath, 20, 0.1, 8, false);
        // 创建一个 MeshPhongMaterial 材质
        const tubeMaterial = new MeshPhongMaterial({ color: 0xff0088 });
        // 创建一个网格对象
        const tube = new Mesh(tubeGeometry, tubeMaterial);
        // 设置网格对象的位置
        tube.position.set(4, 0, 4);
        // 将网格对象添加到场景中
        this.scene.add(tube);

        // 线框几何体
        // 创建一个线框几何体，基于立方体几何体
        const wireframeGeometry = new WireframeGeometry(new BoxGeometry(0.5, 0.5, 0.5));
        // 创建一个 MeshPhongMaterial 材质，设置为线框模式
        const wireframeMaterial = new MeshPhongMaterial({ color: 0xffffff, wireframe: true });
        // 创建一个网格对象
        const wireframe = new Mesh(wireframeGeometry, wireframeMaterial);
        // 设置网格对象的位置
        wireframe.position.set(4, 0, -4);
        // 将网格对象添加到场景中
        this.scene.add(wireframe);
    }
}