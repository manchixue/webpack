let { SyncHook } = require('tapable');
let Compilation = require('./Compilation');
let fs = require('fs');
let path = require('path');

class Compiler {
	constructor (options) {
		this.options = options;
		this.hooks = {
			run: new SyncHook(), // 开始执行前的钩子
			emit: new SyncHook(['assets']), // 操作文件前的钩子
			done: new SyncHook() // 编译完毕后的钩子
		}
	}

	run (callback) {

		// 开始编译
		this.hooks.run.call();

		// 编译...
		this.compile((err, stats) => {
			this.hooks.emit.call(stats.assets);

			for (const filename in stats.assets) {
				let filepath = path.join(this.options.output.path, filename);
				fs.writeFileSync(filepath, stats.assets[filename], 'utf8')
			}
			callback(null, {
				toJson: () => stats
			});
		})

		this.hooks.done.call();
	}
	compile (callback) {
		// 初始化一个Compilation实例
		let compilation = new Compilation(this.options);

		compilation.build(callback);
	}
}

module.exports = Compiler;
