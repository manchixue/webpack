let Compiler = require('./compiler');

function webpack (config) {
	let shellConfig = process.argv.slice(2).reduce((shellConfig, arg) => {
		let [name, value] = arg.split('=');

		shellConfig[name.slice(2)] = value;
	}, {});

	let resultConfig = {
		...config,
		...shellConfig
	}

	let compiler = new Compiler(resultConfig);

	// 初始化插件
	let { plugins = [] } = resultConfig
	plugins.forEach(plugin => plugin.apply(compiler));

	return compiler;
}

module.exports = webpack;
