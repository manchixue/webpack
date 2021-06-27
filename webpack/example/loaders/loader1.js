function loader1 (sourceCode) {
	console.log('loader1');
	return sourceCode + '//1'
}

module.exports = loader1;
