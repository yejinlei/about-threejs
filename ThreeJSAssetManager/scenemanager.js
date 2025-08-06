/**
 * 场景管理器类
 */
class SceneManager {
  /**
   * 构造函数
   * @param {Object} THREE - Three.js 库对象
   * @param {Object} [options] - 场景配置选项
   */
  constructor(THREE, options = {}) {
    this.THREE = THREE;
    this.scene = new THREE.Scene();
    this.modelVisibility = {}; // 模型可见性状态
    
    // 应用配置选项
    if (options.background) {
      this.scene.background = new THREE.Color(options.background);
    }
  }
  
  /**
   * 获取场景对象
   * @returns {THREE.Scene}
   */
  getScene() {
    return this.scene;
  }

  /**
   * 设置模型可见性
   * @param {string} uuid - 模型唯一标识
   * @param {boolean} visible - 是否可见
   */
  setModelVisibility(uuid, visible) {
    this.modelVisibility[uuid] = visible;
  }

  /**
   * 获取模型可见性状态
   * @param {string} uuid - 模型唯一标识
   * @returns {boolean} - 是否可见
   */
  getModelVisibility(uuid) {
    return this.modelVisibility[uuid] !== false;
  }
}

// 创建实例
const sceneManagerInstance = new SceneManager(THREE);

// 同时导出类和实例
export { SceneManager, sceneManagerInstance, sceneManagerInstance as default };