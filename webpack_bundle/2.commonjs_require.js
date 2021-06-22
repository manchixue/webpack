/**
 * commonjs方式导入
 * webpack生成的代码效果
 **/


/*
* 步骤:
* 1. 定义全局模块modules, 模块上存着每个模块的内部实现
* 2. 定义require函数, 创建一个模块初始化对象{exports: {}}, 根据传入的moduleId 在modules中找到对应的模块函数执行并传入初始化模块对象
* 3. 入口调用require函数
* */

var modules = {
	'./src/module/title.js': (module) => {
		module.exports = 'title'; // 模块里面的代码内容  commonjs相当于直接复制过来
	}
};
var cache = {};
function require (moduleId) {
	var cacheModule = cache[moduleId];
	if (cacheModule !== undefined) {
		return cacheModule.exports
	}

	var module = cache[moduleId] = {
		exports : {}
	};
	modules[moduleId](module, module.exports, require);
	return module.exports;
}
var exports = {};

let title = require('./src/module/title.js');
console.log(title);
