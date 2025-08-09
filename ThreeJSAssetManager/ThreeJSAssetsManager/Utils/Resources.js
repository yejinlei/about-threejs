import { TextureLoader, CubeTextureLoader }from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import ThreeJSAssetsManager from '../ThreeJSAssetsManager.js'

import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.threeJSAssetsManagerInstance = new ThreeJSAssetsManager();
    this.scene = this.threeJSAssetsManagerInstance.scene;
    this.mainGroup = this.threeJSAssetsManagerInstance.mainGroup;
    console.log(this.mainGroup);

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();

    this.loaders.glbLoader = new GLTFLoader();
    this.loaders.glbLoader.setDRACOLoader(new DRACOLoader().setDecoderPath('./js/libs/'));  
    this.loaders.textureLoader = new TextureLoader();
    this.loaders.cubeTextureLoader = new CubeTextureLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        console.log('尝试加载 gltf 文件路径:', source.path);
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'glbModel') {

          // 此处不加入scene，直接渲染到渲染器中
          // this.loaders.gltfLoader.load(
          //     path,
          //     (gltf) => {
          //         gltf.scene.name = name;
                  
          //         // 将GLB模型添加到主组中
          //         this.mainGroup.add(gltf.scene);
          //     },
          //     undefined,
          //     function (error) {
          //         console.error(`GLB 文件 ${index + 1} 加载失败:`, error);
          //         console.error(`文件路径: ${path}`);
          //         console.error(`模型名称: ${name}`);
          // });

          this.loaders.gltfLoader.load(
            source.file.path,
              (gltf) => { 
                  this.sourceLoaded(source, gltf);  
              });       
      } else if (source.type === 'texture') {
        console.log('尝试加载纹理文件路径:', source.path);
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'cubeTexture') {
        console.log('尝试加载立方体贴图文件路径:', source.path);
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }

    this.scene.traverse((node) => {
      console.log(node.name);
    }); 
  }


  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    // test if all sources have been loaded, then we know we are ready to start the experience
    if (this.loaded === this.toLoad) {
      console.log('所有的资源加载完成:', this.loaded);
      this.trigger('ready');
    }
  }
}
