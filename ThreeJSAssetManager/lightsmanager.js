/**
 * 灯光管理器类
 */
export class LightsManager {
  /**
   * 构造函数
   * @param {Object} THREE - Three.js 库对象
   */
  constructor(THREE) {
    this.THREE = THREE;
    this.ambientLight = null; // 环境光
    this.directionalLight = null; // 定向光
    this.hemisphereLight = null; // 半球光
  }

  /**
   * 初始化环境光
   * @param {number} color - 光的颜色
   * @param {number} intensity - 光的强度
   */
  initAmbientLight(color, intensity) {
    this.ambientLight = new this.THREE.AmbientLight(color, intensity);
    return this.ambientLight;
  }

  /**
   * 初始化定向光
   * @param {number} color - 光的颜色
   * @param {number} intensity - 光的强度
   * @param {Object} position - 光的位置 {x, y, z}
   */
  initDirectionalLight(color, intensity, position) {
    this.directionalLight = new this.THREE.DirectionalLight(color, intensity);
    this.directionalLight.position.set(position.x, position.y, position.z);
    return this.directionalLight;
  }

  /**
   * 初始化半球光
   * @param {number} skyColor - 天空颜色
   * @param {number} groundColor - 地面颜色
   * @param {number} intensity - 光的强度
   */
  initHemisphereLight(skyColor, groundColor, intensity) {
    this.hemisphereLight = new this.THREE.HemisphereLight(skyColor, groundColor, intensity);
    return this.hemisphereLight;
  }
}