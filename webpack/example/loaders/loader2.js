function loader2 (sourceCode) {
	console.log('loader2');
	return sourceCode + '//2'
}

module.exports = loader2;
