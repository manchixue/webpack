// let webpack = require('webpack');
let webpack = require('../index');
let config = require('./webpack.config');



let compiler = webpack(config);

compiler.run((err, stat) => {
	console.log(err);
	console.log(stat.toJson());
})
