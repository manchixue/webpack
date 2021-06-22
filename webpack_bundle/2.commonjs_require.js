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
	'./src/module/title.js': (module, exports) => {
		require.r(exports);
		require.d(exports, {
			"default": () => defaultExport,
			'age': () => age
		})

		const defaultExport = 'name';
		const age = '12';
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

// require defineProperty  给对象的每个字段定义getter属性描述器
require.d = (exports, definition) => {
	for (const key in definition) {
		if (require.o(definition, key) && !require.o(exports, key)) {
			Object.defineProperty(exports, key, {
				enumerable: true,
				get: definition[key]
			})
		}
	}
}

// require hasOwnProperty  判断是否拥有该属性
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

// require 声明是esModule模块   声明是一个es6 module
require.r = (exports) => {
	Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	Object.defineProperty(exports, '__esModule', { value: true });
}

var exports = {};
require.r(exports)
let title = require('./src/module/title.js');
console.log(title.default);
console.log(title.age);
