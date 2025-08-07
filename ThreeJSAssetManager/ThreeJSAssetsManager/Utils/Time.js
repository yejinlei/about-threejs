// 从 './Utils/EventEmitter' 模块导入 EventEmitter 类
import EventEmitter from './EventEmitter.js';

/**
 * Time 类用于管理时间相关的功能，继承自 EventEmitter 类，
 * 可以触发时间相关的事件，如每帧更新事件。
 */
export default class Time extends EventEmitter {
  /**
   * Time 类的构造函数，初始化时间相关属性并启动动画循环。
   */
  constructor() {
    // 调用父类 EventEmitter 的构造函数
    super();

    // Setup
    // 记录程序开始运行的时间戳（毫秒）
    this.start = Date.now();
    // 当前帧的时间戳，初始值为程序开始运行的时间戳
    this.current = this.start;
    // 从程序开始到当前帧所经过的时间（毫秒）
    this.elapsed = 0;
    // 帧间隔时间 - 当前帧与上一帧之间的时间差（毫秒）
    // 默认设置为 16，因为 60 帧每秒时，两帧之间大约间隔 16 毫秒
    this.delta = 16;

    // 请求浏览器在下一次重绘之前调用 this.tick 方法，启动动画循环
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  /**
   * tick 方法，每帧被调用一次，用于更新时间相关属性并触发 'tick' 事件。
   */
  tick() {
    // 获取当前时间戳
    const currentTime = Date.now();
    // 计算当前帧与上一帧之间的时间差
    this.delta = currentTime - this.current;
    // 更新当前帧的时间戳
    this.current = currentTime;
    // 更新从程序开始到当前帧所经过的时间
    this.elapsed = this.current - this.start;

    // 触发 'tick' 事件，通知所有监听该事件的对象时间已更新，这里会调用ThreeJSAssetsManager类中的tick()方法，
    // ThreeJSAssetsManager类中调用了本类Time中的on函数，注册了它自己的tick方法，并将ThreeJSAssetsManager类中的tick()方法注册在time.on('tick',()=>{})中。
    this.trigger('tick')

    // 请求浏览器在下一次重绘之前再次调用 this.tick 方法，保持动画循环
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
