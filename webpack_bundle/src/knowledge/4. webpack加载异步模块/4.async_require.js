/**
 * commonjs方式导入
 * webpack生成的代码效果
 **/


/*
* 步骤:
* 1. require.e开始加载异步模块, 初始化promise, 并通过jsonp加载异步模块
* 2. 异步模块缓存判断, 没有缓存则初始化promise, 并放入require.e生成的promises数组里
* 3. 解析异步模块url
* 4. 动态创建script标签jsonp获取异步模块
* 5. 获取异步模块后  会调用全局定义好的一个webpack全局变量上面的push方法, 出发jsonp回调
* 6. 在jsonp回调中, 根据chunkIds数组, 将每个异步请求resolve, 并将每个异步模块装在到全局modules下
* */

var modules = {

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

require.p = '';

require.u = (chunkId) => chunkId + '.main.js';

var exports = {};

// require 查找模块方式
require.f = {};

var installedChunkData = {
	'main': 0
}
require.f.jsonp = (chunkId, promises) => {
	var installedChunkedData = installedChunkData[chunkId];
	if (installedChunkedData !== 0) {
		if (installedChunkedData) {

		} else {

			// 初始化一个promise对象
			var promise = new Promise((resolve, reject) => {

				// 将resolve,reject保存到装在的chunkData里
				installedChunkedData = installedChunkData[chunkId] = [resolve, reject];
			})

			// 并将promise实例也装载进去
			// deferred
			installedChunkedData[2] = promise;
			promises.push(promise);

			var url = require.p + require.u(chunkId);

			require.l(url)
		}
	}
}

require.l = (url) => {
	var script = document.createElement('script');
	script.src = url;
	document.head.appendChild(script); // 开始通过jsonp加载
}
require.m = modules;
var chunkLoadingGlobal = self["webpackChunkwebpack_bundle"] = self["webpackChunkwebpack_bundle"] || [];
var webpackJsonpCallback = (data) => { // 定义全局chunkLoadingGlobal的push方法, 异步模块加载完时调用
	var [chunkIds, moreModules] = data;
	var chunk;
	for (const moduleId in moreModules) {
		if (require.o(moreModules, moduleId)) {
			require.m[moduleId] = moreModules[moduleId];
		}
	}
	for (var i = 0; i < chunkIds.length; i++) {
		chunk = chunkIds[i];
		if (require.o(installedChunkData, chunk) && installedChunkData[chunk]) {
			installedChunkData[chunk][0](); // 调用resolve
		}
		installedChunkData[chunk] = 0 // 完成加载
	}

}
chunkLoadingGlobal.push = webpackJsonpCallback

require.r(exports)

require.e = (chunkId) => {
	let promises = [];

	// jsonp异步加载模块
	require.f.jsonp(chunkId, promises);

	return Promise.all(promises); // 返回所有的promise
}

require.e("src_module_title_js")
	.then(require.bind(require, "./src/module/title.js"))
	.then(result => {
		console.log(result);
	});
