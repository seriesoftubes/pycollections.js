
if (!Number.isNaN) {
  // Un-break functionality of window.isNaN for browsers that need it:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
  Number.isNaN = function(v) {
    return v != v;
  };
}

if (!Array.isArray) {
  // Polyfill for isArray:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
