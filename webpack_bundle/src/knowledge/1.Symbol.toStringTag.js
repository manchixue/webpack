// Symbol.toStringTag的作用   可以通过toString来区分不同的对象

console.log(Object.prototype.toString.call('foo'));
console.log(Object.prototype.toString.call(0));
console.log(Object.prototype.toString.call([]));
console.log(Object.prototype.toString.call({}));
console.log(Object.prototype.toString.call(true));
console.log(Object.prototype.toString.call(null));
console.log(Object.prototype.toString.call(undefined));

let obj = {};
Object.defineProperty(obj, Symbol.toStringTag, {value: 'obj1'});

console.log(Object.prototype.toString.call(obj));
