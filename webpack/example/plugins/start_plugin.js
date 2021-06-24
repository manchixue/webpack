class StartPlugin {
	constructor () {

	}

	apply (compiler) {
		let { hooks } = compiler;
		hooks.run.tap('startPlugin', () => {
			console.log('开始执行startPlugin');
		})
	}
}

module.exports = StartPlugin;
