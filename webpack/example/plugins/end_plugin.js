class EndPlugin {
	constructor (compiler) {

	}

	apply (compiler) {
		let { hooks } = compiler;
		hooks.done.tap('endPlugin', () => {
			console.log('开始执行endPlugin');
		})
	}
}

module.exports = EndPlugin;
