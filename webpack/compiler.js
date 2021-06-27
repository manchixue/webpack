let { SyncHook } = require('tapable');
let Compilation = require('./Compilation');

class Compiler {
	constructor (options) {
		this.options = options;
		this.hooks = {
			run: new SyncHook(), // 开始执行前的钩子
			emit: new SyncHook(), // 操作文件前的钩子
			done: new SyncHook() // 编译完毕后的钩子
		}
	}

	run (callback) {

		// 开始编译
		this.hooks.run.call();

		// 编译...
		// 初始化一个Compilation实例
		let compilation = new Compilation(this.options);

		compilation.build(callback);

		this.hooks.done.call();

		callback(null, {
			toJSON () {
				return {
					chunks: []
				}
			}
		});

	}
}

module.exports = Compiler;
