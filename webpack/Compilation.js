let fs = require('fs');
let path = require('path');
let types = require('babel-types');
let parser = require('@babel/parser');
let traverse = require('@babel/traverse').default;
let generator = require('@babel/generator').default;
const baseDir = toUnixPath(process.cwd());
function toUnixPath (filePath) {
	return filePath.replace(/\\/g, '/');
}
class Compilation {
	constructor (options) {
		this.options = options;
		this.modules = [];
		this.chunks = [];
		this.files = [];
		this.dependencies = [];
	}
	build (callback) {

		//  获取所有的入口
		let { entry } = this.options;
		for (const entryName in entry) {

			// 获取entry的绝对路径
			let entryFilePath = toUnixPath(path.join(this.options.context, entry[entryName]))
			let entryModule = this.buildModule(entryName, entryFilePath);
			console.log(entryModule);
		}
	}

	buildModule (name, modulePath) {
		// 获取loaders
		let { rules = [] } = this.options.module || {};
		let loaders = [];
		for (let i = 0; i < rules.length; i++) {
			if (rules[i].test.test(modulePath)) {
				loaders = [...loaders, ...rules[i].use];
			}
		}

		// 获取源码
		let sourceCode = fs.readFileSync(modulePath, 'utf8');

		// 调用loaders
		sourceCode = loaders.reduceRight((sourceCode, loaderPath) => {
			return require(loaderPath)(sourceCode)
		}, sourceCode);

		// 转成ast
		let ast = parser.parse(sourceCode, {sourceType: 'module'});

		let moduleId = './' + path.posix.relative(baseDir, modulePath);
		let module = {
			id: moduleId,
			name,
			dependencies: []
		};


		// 遍历ast进行处理
		traverse(ast, {
			CallExpression: ({ node }) => {
				if (node.callee.name === 'require') {
					let moduleName = node.arguments[0].value; // 拿到require的路径

					// 获取当前文件的目录
					let dirname = path.posix.dirname(modulePath);

					// 将相对路径变成moduleId路径
					// ./title -> ./src/title
					let depModulePath = path.posix.join(dirname, moduleName)
					let { extensions } = this.options.resolve;

					// 解析文件格式  ./title -> ./src/title.js
					depModulePath = tryExtensions(depModulePath, extensions);

					// depModuleId = ./src/title.js
					let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
					node.arguments = [types.stringLiteral(depModuleId)];

					// 将依赖的模块绝对路径放到当前模块的依赖数组里
					module.dependencies.push({
						depModuleId,
						depModulePath
					})
				}
			}
		})

		// 生成代码
		let { code } = generator(ast);
		module._source = code;

		module.dependencies.forEach((dependency) => {
			let { depModuleId, depModulePath } = dependency;
			let dependencyModule = this.buildModule(name, depModulePath)
			this.modules.push(dependencyModule)
		})


		return module;
	}
}

function tryExtensions (depModulePath, extensions = []) {
	extensions = ['', ...extensions];

	for (let i = 0; i < extensions.length; i++) {
		let filePath = depModulePath + extensions[i];
		if (fs.existsSync(filePath)) {
			return filePath
		}
	}

	throw new Error('Module not found');
}

module.exports = Compilation;
