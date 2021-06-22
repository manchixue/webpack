let title = require('./title');
let text = require('./content.txt');
import './style/index.css';
import './style/less.less';
import './style/sass.scss';


function readonly (target, key, descriptor) {
	descriptor.writable = false;
}

function aop (target, key, descriptor) {
	let fn = descriptor.value;

	descriptor.value= function (...args) {

		console.log('原函数前执行');

		return fn.call(this, ...args);
	}
}

function dec (Ctor) {
	Ctor.prototype.getName = function () {
		return 'getname';
	}
}

@dec
class Person {
	@readonly PI = 3.14

	@aop
	fn () {
		console.log('climb');
	}
}

let p1 = new Person();
// p1.PI = 3.15;
console.log(p1);


p1.fn();


p1.getName();
