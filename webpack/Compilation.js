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
		this.chunks = []; // 代码块
		this.files = []; // 入口文件名集合
		this.assets = {}; // 入口文件名为key, 值为带有commonjs引入的代码
		this.entries = []; // name, entryModule, modules
		this.dependencies = [];
	}
	build (callback) {

		//  获取所有的入口
		let { entry } = this.options;
		for (const entryName in entry) {

			// 获取entry的绝对路径
			let entryFilePath = toUnixPath(path.join(this.options.context, entry[entryName]))
			let entryModule = this.buildModule(entryName, entryFilePath);
			let chunk = {
				name: entryName,
				entryModule,
				modules: this.modules.filter(item => item.name === entryName || item.extraName.includes(entryName))
			};

			this.entries.push(chunk);
			this.chunks.push(chunk);
		}

		this.chunks.forEach(chunk => {
			let filename = this.options.output.filename.replace('[name]', chunk.name);
			this.assets[filename] = getSource(chunk);
		});

		callback(null, {
			entries: this.entries,
			chunks: this.chunks,
			modules: this.modules,
			files: this.files,
			assets: this.assets
		})
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

					// 解析文件格式  ./title -> src/title.js
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
			let depModule = this.modules.find(item => item.name === depModuleId);
			if (depModule) {
				(depModule.extraName = depModule.extraName ||[]).push(name)
			} else {
				let dependencyModule = this.buildModule(name, depModulePath)
				this.modules.push(dependencyModule)
			}
		})

		return module;
	}
}

function getSource (chunk) {
	return `
		(() => {
  var modules = ({
    ${chunk.modules.map(module => `
        "${module.id}": (module, exports, require)=> {
            ${module._source}
        }
    `).join(',')}
  });
  var cache = {};
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  var exports = {};
  (() => {
    ${chunk.entryModule._source}
  })();
})()
  ;
	`;
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
