import EventEmitter from './EventEmitter.js';

export default class Sizes extends EventEmitter {
  /**
   * Sizes 类的构造函数，用于初始化窗口尺寸相关属性并监听窗口大小变化事件。
   */
  constructor() {
    // 调用父类 EventEmitter 的构造函数
    super();

    // Setup
    // 初始化窗口的宽度，获取当前浏览器窗口的内部宽度
    this.width = window.innerWidth;
    // 初始化窗口的高度，获取当前浏览器窗口的内部高度
    this.height = window.innerHeight;
    // 初始化设备像素比，取设备像素比和 2 之间的较小值，避免过高的像素比导致性能问题
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Resize
    // 为窗口的 resize 事件添加监听器，当窗口大小发生变化时执行回调函数
    window.addEventListener('resize', () => {
      // 更新窗口的宽度
      this.width = window.innerWidth;
      // 更新窗口的高度
      this.height = window.innerHeight;
      // 更新设备像素比
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      // 触发父类的 'resize' 事件，通知所有监听该事件的对象窗口尺寸已改变
      // ThreeJSAssetsManager\DebugUI.js 中调用了本类Sizes中的on函数，注册了它自己的resize()方法，将 ThreeJSAssetsManager\DebugUI.js中的resize()方法注册在sizes.on('resize',()=>{})中。
      // 此处会调用ThreeJSAssetsManager\DebugUI.js 中的resize()方法，对页面的尺寸进行重新调整，重新计算所有UI的比例和大小。
      this.trigger('resize')
    });
  }
}
