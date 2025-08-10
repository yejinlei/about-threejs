import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Mesh, PlaneGeometry, SphereGeometry, CylinderGeometry, ConeGeometry, TorusGeometry, IcosahedronGeometry, CircleGeometry, DodecahedronGeometry, EdgesGeometry, ExtrudeGeometry, LatheGeometry, OctahedronGeometry, PolyhedronGeometry, RingGeometry, ShapeGeometry, TetrahedronGeometry, TorusKnotGeometry, TubeGeometry, WireframeGeometry, MeshPhongMaterial } from 'three';

import ThreeJSAssetsManager from "./ThreeJSAssetsManager.js";

import Horse from "./World/horse.js";
export default class MeshManager
{
    constructor()
    {
        this.threejsassetsmanagerInstance = new ThreeJSAssetsManager();
        this.scene = this.threejsassetsmanagerInstance.scene;
        this.resources = this.threejsassetsmanagerInstance.resources;
        this.debug = this.threejsassetsmanagerInstance.debug;
        this.gui = this.threejsassetsmanagerInstance.gui;
        this.geometries = this.threejsassetsmanagerInstance.geometries;
        this.horses = [];

        if(this.debug && this.gui)
        {
            this.gui.meshFolder = this.gui.addFolder('MeshManager(网格管理)');
        }

        // 等待资源加载完成后再创建Horse实例
        this.resources.on('ready', () => {
            this.resources.sources.forEach(object =>
            {
                if (object.type === 'glbModel')
                {
                    this.horses.push(new Horse(object.name));
                }
            })
        });
        
        // 测试用
        // if (!this.geometries['box1']) {
        //     const geometry1 = new BoxGeometry( 1, 1, 1 ); 
        //     const material = new MeshBasicMaterial( {color: 0xffff00} ); 
        //     const cube = new Mesh( geometry1, material ); 
        //     this.scene.add(cube);
        //     this.geometries['box1'] = cube;
        // }
        
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

    update() {
        // if (this.horse)
        //     this.horse.update();
        this.horses.forEach(horse => horse.update());
    }

    // 创建并添加所有几何体
    createGeometries() {
        // 胶囊体
        if (!this.geometries['capsule']) {
            const capsuleGeometry = new CapsuleGeometry(0.5, 1, 4, 8);
            const capsuleMaterial = new MeshPhongMaterial({ color: 0xff8800 });
            const capsule = new Mesh(capsuleGeometry, capsuleMaterial);
            capsule.position.set(-4, 0, 0);
            this.scene.add(capsule);
            this.geometries['capsule'] = capsule;
        }

        // 圆形
        const circleGeometry = new CircleGeometry(0.5, 32);
        const circleMaterial = new MeshPhongMaterial({ color: 0x8800ff });
        const circle = new Mesh(circleGeometry, circleMaterial);
        circle.position.set(-4, 0, 2);
        this.scene.add(circle);

        // 十二面体
        const dodecahedronGeometry = new DodecahedronGeometry(0.5);
        const dodecahedronMaterial = new MeshPhongMaterial({ color: 0x00ffff });
        const dodecahedron = new Mesh(dodecahedronGeometry, dodecahedronMaterial);
        dodecahedron.position.set(-4, 0, -2);
        this.scene.add(dodecahedron);

        // 边缘几何体
        const edgesGeometry = new EdgesGeometry(new BoxGeometry(0.5, 0.5, 0.5));
        const edgesMaterial = new MeshPhongMaterial({ color: 0xffffff, wireframe: true });
        const edges = new Mesh(edgesGeometry, edgesMaterial);
        edges.position.set(-2, 0, 4);
        this.scene.add(edges);

        // 挤压几何体
        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const extrudeGeometry = new ExtrudeGeometry(new Shape([new Vector2(0,0), new Vector2(0.5,0), new Vector2(0.5,0.5), new Vector2(0,0.5)]), extrudeSettings);
        const extrudeMaterial = new MeshPhongMaterial({ color: 0xff00ff });
        const extrude = new Mesh(extrudeGeometry, extrudeMaterial);
        extrude.position.set(-2, 0, -4);
        this.scene.add(extrude);

        // 旋转几何体
        const lathePoints = [new Vector2(0,0), new Vector2(0.5,0.2), new Vector2(0.3,0.5), new Vector2(0,0.5)];
        const latheGeometry = new LatheGeometry(lathePoints, 12);
        const latheMaterial = new MeshPhongMaterial({ color: 0xffff00 });
        const lathe = new Mesh(latheGeometry, latheMaterial);
        lathe.position.set(0, 0, 4);
        this.scene.add(lathe);

        // 八面体
        const octahedronGeometry = new OctahedronGeometry(0.5);
        const octahedronMaterial = new MeshPhongMaterial({ color: 0x00ff88 });
        const octahedron = new Mesh(octahedronGeometry, octahedronMaterial);
        octahedron.position.set(0, 0, -4);
        this.scene.add(octahedron);

        // 多面体
        const polyhedronVertices = [1,1,1, -1,-1,1, -1,1,-1, 1,-1,-1];
        const polyhedronIndices = [2,1,0, 0,3,2, 1,3,0, 2,3,1];
        const polyhedronGeometry = new PolyhedronGeometry(polyhedronVertices, polyhedronIndices, 0.5);
        const polyhedronMaterial = new MeshPhongMaterial({ color: 0x880088 });
        const polyhedron = new Mesh(polyhedronGeometry, polyhedronMaterial);
        polyhedron.position.set(2, 0, 4);
        this.scene.add(polyhedron);

        // 环形几何体
        const ringGeometry = new RingGeometry(0.3, 0.5, 32);
        const ringMaterial = new MeshPhongMaterial({ color: 0x0088ff });
        const ring = new Mesh(ringGeometry, ringMaterial);
        ring.position.set(2, 0, -4);
        this.scene.add(ring);

        // 形状几何体
        const shape = new Shape();
        shape.moveTo(0,0);
        shape.lineTo(0.5,0);
        shape.lineTo(0.5,0.5);
        shape.lineTo(0,0.5);
        const shapeGeometry = new ShapeGeometry(shape);
        const shapeMaterial = new MeshPhongMaterial({ color: 0xff8800 });
        const shapeMesh = new Mesh(shapeGeometry, shapeMaterial);
        shapeMesh.position.set(4, 0, 0);
        this.scene.add(shapeMesh);

        // 四面体
        const tetrahedronGeometry = new TetrahedronGeometry(0.5);
        const tetrahedronMaterial = new MeshPhongMaterial({ color: 0x88ff00 });
        const tetrahedron = new Mesh(tetrahedronGeometry, tetrahedronMaterial);
        tetrahedron.position.set(4, 0, 2);
        this.scene.add(tetrahedron);

        // 环面纽结
        const torusKnotGeometry = new TorusKnotGeometry(0.5, 0.2, 100, 16);
        const torusKnotMaterial = new MeshPhongMaterial({ color: 0x00ffff });
        const torusKnot = new Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnot.position.set(4, 0, -2);
        this.scene.add(torusKnot);

        // 管状几何体
        const tubePath = new Curve();
        tubePath.getPoint = function(t) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;
            return new Vector3(tx, ty, tz);
        };
        const tubeGeometry = new TubeGeometry(tubePath, 20, 0.1, 8, false);
        const tubeMaterial = new MeshPhongMaterial({ color: 0xff0088 });
        const tube = new Mesh(tubeGeometry, tubeMaterial);
        tube.position.set(4, 0, 4);
        this.scene.add(tube);

        // 线框几何体
        const wireframeGeometry = new WireframeGeometry(new BoxGeometry(0.5, 0.5, 0.5));
        const wireframeMaterial = new MeshPhongMaterial({ color: 0xffffff, wireframe: true });
        const wireframe = new Mesh(wireframeGeometry, wireframeMaterial);
        wireframe.position.set(4, 0, -4);
        this.scene.add(wireframe);
    }
}