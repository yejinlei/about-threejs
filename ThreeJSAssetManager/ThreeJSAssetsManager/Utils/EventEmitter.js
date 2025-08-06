export default class EventEmitter {
    /**
     * EventEmitter 类的构造函数，用于初始化事件回调存储结构。
     */
    constructor() {
      // 初始化一个空对象，用于存储所有事件的回调函数
      // 该对象的结构为：{ 命名空间: { 事件名: [回调函数1, 回调函数2, ...] } }
      this.callbacks = {};
      // 初始化一个名为 'base' 的默认命名空间，用于存储未指定命名空间的事件回调
      this.callbacks.base = {};
    }
  
    /**
     * 为指定的事件名称绑定回调函数。支持同时绑定多个事件，可指定命名空间。
     * @param {string} _names - 要绑定回调的事件名称，多个事件名可用逗号、斜杠或空格分隔，可指定命名空间（如 'eventName.namespace'）。
     * @param {function} callback - 当事件触发时要执行的回调函数。
     * @returns {EventEmitter|boolean} - 若参数有效，返回 EventEmitter 实例以支持链式调用；若参数无效，返回 false。
     */
    on(_names, callback) {
      // 错误处理：检查事件名称是否为空或未定义
      if (typeof _names === 'undefined' || _names === '') {
        console.warn('wrong names');
        return false;
      }
  
      // 错误处理：检查回调函数是否未定义
      if (typeof callback === 'undefined') {
        console.warn('wrong callback');
        return false;
      }
  
      // 解析事件名称，将输入的字符串转换为事件名称数组
      const names = this.resolveNames(_names);
  
      // 遍历每个事件名称
      names.forEach((_name) => {
        // 解析单个事件名称，提取事件名和命名空间
        const name = this.resolveName(_name);
  
        // 若命名空间不存在，则创建该命名空间
        if (!(this.callbacks[name.namespace] instanceof Object))
          this.callbacks[name.namespace] = {};
  
        // 若该事件的回调函数数组不存在，则创建该数组
        if (!(this.callbacks[name.namespace][name.value] instanceof Array))
          this.callbacks[name.namespace][name.value] = [];
  
        // 将回调函数添加到对应事件的回调数组中
        this.callbacks[name.namespace][name.value].push(callback);
      });
  
      // 返回当前实例，支持链式调用
      return this;
    }
  
    /**
     * 移除指定事件或命名空间的回调函数。支持移除多个事件，可指定命名空间。
     * @param {string} _names - 要移除回调的事件名称，多个事件名可用逗号、斜杠或空格分隔，可指定命名空间（如 'eventName.namespace'）。
     * @returns {EventEmitter|boolean} - 若参数有效，返回 EventEmitter 实例以支持链式调用；若参数无效，返回 false。
     */
    off(_names) {
      // 错误处理：检查传入的事件名称是否为空或未定义，若为空则打印警告信息并返回 false
      if (typeof _names === 'undefined' || _names === '') {
        console.warn('wrong name');
        return false;
      }
  
      // 调用 resolveNames 方法解析传入的事件名称字符串，将其转换为事件名称数组
      const names = this.resolveNames(_names);
  
      // 遍历事件名称数组中的每个事件名称
      names.forEach((_name) => {
        // 调用 resolveName 方法解析单个事件名称，提取出事件名和命名空间
        const name = this.resolveName(_name);
  
        // 移除整个命名空间
        // 当指定的命名空间不是默认的 'base' 命名空间，且事件名为空时，删除该命名空间
        if (name.namespace !== 'base' && name.value === '') {
          delete this.callbacks[name.namespace];
        }
  
        // 移除命名空间内特定事件的回调
        else {
          // 处理默认命名空间 'base' 的情况
          if (name.namespace === 'base') {
            // 遍历 callbacks 对象中的每个命名空间
            for (const namespace in this.callbacks) {
              // 检查当前命名空间是否存在，且该命名空间下指定事件的回调函数数组存在
              if (
                this.callbacks[namespace] instanceof Object &&
                this.callbacks[namespace][name.value] instanceof Array
              ) {
                // 删除该命名空间下指定事件的回调函数数组
                delete this.callbacks[namespace][name.value];
  
                // 检查该命名空间是否为空，若为空则删除该命名空间
                if (Object.keys(this.callbacks[namespace]).length === 0)
                  delete this.callbacks[namespace];
              }
            }
          }
  
          // 处理指定的非默认命名空间的情况
          else if (
            this.callbacks[name.namespace] instanceof Object &&
            this.callbacks[name.namespace][name.value] instanceof Array
          ) {
            // 删除该命名空间下指定事件的回调函数数组
            delete this.callbacks[name.namespace][name.value];
  
            // 检查该命名空间是否为空，若为空则删除该命名空间
            if (Object.keys(this.callbacks[name.namespace]).length === 0)
              delete this.callbacks[name.namespace];
          }
        }
      });
  
      // 返回当前 EventEmitter 实例，支持链式调用
      return this;
    }
  
    /**
     * 触发指定名称的事件，并将参数传递给绑定的回调函数。
     * @param {string} _name - 要触发的事件名称，可指定命名空间（如 'eventName.namespace'）。
     * @param {Array} _args - 传递给回调函数的参数数组，可选。
     * @returns {*|boolean|EventEmitter} - 若参数无效，返回 false；若触发成功，返回最后一个回调函数的返回值；若未找到回调函数，返回 null。
     */
    trigger(_name, _args) {
      // 错误处理：检查事件名称是否为空或未定义
      if (typeof _name === 'undefined' || _name === '') {
        console.warn('wrong name');
        return false;
      }
  
      // 用于存储最终的返回结果
      let finalResult = null;
      // 用于存储每个回调函数的返回结果
      let result = null;
  
      // 处理默认参数，若 _args 不是数组，则初始化为空数组
      const args = !(_args instanceof Array) ? [] : _args;
  
      // 解析事件名称，将输入的字符串转换为事件名称数组（理论上应该只有一个事件）
      let name = this.resolveNames(_name);
  
      // 解析单个事件名称，提取事件名和命名空间
      name = this.resolveName(name[0]);
  
      // 处理默认命名空间 'base' 的情况
      if (name.namespace === 'base') {
        // 尝试在每个命名空间中查找该事件的回调函数
        for (const namespace in this.callbacks) {
          // 检查当前命名空间是否存在，且该命名空间下指定事件的回调函数数组存在
          if (
            this.callbacks[namespace] instanceof Object &&
            this.callbacks[namespace][name.value] instanceof Array
          ) {
            // 遍历该命名空间下指定事件的所有回调函数并执行
            this.callbacks[namespace][name.value].forEach(function (callback) {
              // 调用回调函数并传入参数，记录返回结果
              result = callback.apply(this, args);
  
              // 若 finalResult 还未被赋值，则将当前回调函数的返回结果赋值给它
              if (typeof finalResult === 'undefined') {
                finalResult = result;
              }
            }.bind(this)); // 绑定 this 上下文，确保回调函数内的 this 指向 EventEmitter 实例
          }
        }
      }
  
      // 处理指定的非默认命名空间的情况
      else if (this.callbacks[name.namespace] instanceof Object) {
        // 若事件名为空，则打印警告信息并返回当前实例
        if (name.value === '') {
          console.warn('wrong name');
          return this;
        }
  
        // 遍历该命名空间下指定事件的所有回调函数并执行
        this.callbacks[name.namespace][name.value].forEach(function (callback) {
          // 调用回调函数并传入参数，记录返回结果
          result = callback.apply(this, args);
  
          // 若 finalResult 还未被赋值，则将当前回调函数的返回结果赋值给它
          if (typeof finalResult === 'undefined') finalResult = result;
        }.bind(this)); // 绑定 this 上下文，确保回调函数内的 this 指向 EventEmitter 实例
      }
  
      // 返回最终的返回结果
      return finalResult;
    }
  
    /**
     * 解析包含多个事件名称的字符串，将其转换为事件名称数组。
     * 支持使用逗号、斜杠或空格分隔多个事件名称，同时会过滤掉非法字符。
     * @param {string} _names - 包含多个事件名称的字符串，事件名之间可用逗号、斜杠或空格分隔。
     * @returns {Array} - 解析后的事件名称数组。
     */
    resolveNames(_names) {
      // 复制传入的事件名称字符串，避免修改原始参数
      let names = _names;
      // 使用正则表达式替换掉所有非字母、数字、逗号、斜杠、空格的字符
      // 确保只保留合法的事件名称字符
      names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
      // 将所有逗号和斜杠替换为空格，统一分隔符
      names = names.replace(/[,/]+/g, ' ');
      // 按空格分割字符串，将其转换为事件名称数组
      names = names.split(' ');
  
      // 过滤掉数组中的空字符串，返回最终的事件名称数组
      return names.filter(name => name.trim() !== '');
    }
  
    /**
     * 解析单个事件名称，提取事件名和命名空间。
     * 支持从类似 'eventName.namespace' 的字符串中分离出事件名和命名空间，若未指定命名空间则使用默认的 'base' 命名空间。
     * @param {string} name - 要解析的事件名称字符串，可包含命名空间，格式为 'eventName.namespace'。
     * @returns {Object} - 包含原始事件名、事件名和命名空间的对象。
     */
    resolveName(name) {
      // 初始化一个空对象，用于存储解析后的事件名称信息
      const newName = {};
      // 使用点号 '.' 分割传入的事件名称字符串，得到一个数组
      const parts = name.split('.');
  
      // 存储原始的事件名称字符串
      newName.original = name;
      // 数组的第一个元素作为事件名
      newName.value = parts[0];
      // 默认使用 'base' 作为命名空间
      newName.namespace = 'base'; // Base namespace
  
      // 检查是否指定了命名空间
      // 当分割后的数组长度大于 1 且第二个元素不为空字符串时，认为指定了命名空间
      if (parts.length > 1 && parts[1] !== '') {
        // 将第二个元素作为命名空间
        newName.namespace = parts[1];
      }
  
      // 返回包含解析后信息的对象
      return newName;
    }
  }