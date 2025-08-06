/**
 * 模型管理器类
 */
export class ModelsManager {
  /**
   * 静态函数示例：验证模型文件格式
   * @param {string} filePath - 模型文件路径
   * @returns {boolean} - 是否支持该格式
   */
  static validateModelFormat(filePath) {
    const supportedFormats = ['.gltf', '.glb', '.obj', '.fbx'];
    return supportedFormats.some(format => filePath.endsWith(format));
  }

  /**
   * 构造函数
   * @param {Object} THREE - Three.js 库对象
   */
  constructor(THREE) {
    this.THREE = THREE;
    this.models = new Map();
  }

  /**
   * 加载模型
   * @param {string} name - 模型名称
   * @param {Object} model - Three.js 模型对象
   */
  addModel(name, model) {
    this.models.set(name, model);
  }

  /**
   * 获取模型
   * @param {string} name - 模型名称
   * @returns {Object|undefined}
   */
  getModel(name) {
    return this.models.get(name);
  }
}

// 创建默认实例并导出
const modelsManagerInstance = new ModelsManager(THREE);
export { modelsManagerInstance as default };