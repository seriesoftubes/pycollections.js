
var VALID_NAME = /^[a-zA-Z\_]+[a-zA-Z0-9\_]*$/;

// Reserved words in JS as of ES6:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords
var RESERVED_WORDS = {
  'break': 1,
  'case': 1,
  'class': 1,
  'catch': 1,
  'const': 1,
  'continue': 1,
  'debugger': 1,
  'default': 1,
  'delete': 1,
  'do': 1,
  'else': 1,
  'export': 1,
  'extends': 1,
  'finally': 1,
  'for': 1,
  'function': 1,
  'if': 1,
  'import': 1,
  'in': 1,
  'instanceof': 1,
  'let': 1,
  'new': 1,
  'return': 1,
  'super': 1,
  'switch': 1,
  'this': 1,
  'throw': 1,
  'try': 1,
  'typeof': 1,
  'var': 1,
  'void': 1,
  'while': 1,
  'with': 1,
  'yield': 1,
  'enum': 1,
  'await': 1
};
Object.freeze(RESERVED_WORDS);


var NamedTupleToString = function() {
  var fields = this.fields;
  var parts = [name, '('];
  for (var i = 0, len = this.length; i < len; i++) {
    parts.push(fields[i] + '=' + String(this[i]));
    i < len - 1 && parts.push(', ');
  }
  parts.push(')');
  return parts.join('');
};

var NamedTupleAsDict = function() {
  var dict = new Dict();
  for (var i = 0; i < this.length; i++) dict.set(this.fields[i], this[i]);
  return dict;
};


var NamedTuple = function(name, props) {
  if (typeof name !== 'string' || !props) throw Error('must include name and properties');
  if (!Array.isArray(props)) throw TypeError('props must be an array');
  if (!VALID_NAME.test(name)) throw Error('invalid name');
  if (RESERVED_WORDS[name]) throw Error('cannot use reserved word as name');

  var nargs = props.length;
  var container = {};
  var code = [
    'container.myClass = function ' + name + '() {',
      'if (arguments.length !== nargs) throw Error(nargs + " args required");',

      'for (var i = 0; i < nargs; i++) this[props[i]] = this[i] = arguments[i];',

      'Object.defineProperty(this, "length", {"enumerable": false, "value": nargs});',
      'Object.defineProperty(this, "fields", {"enumerable": false, "value": props});',
      'Object.defineProperty(this, "asDict", {"enumerable": false, "value": NamedTupleAsDict});',
      'Object.defineProperty(this, "asArray", {"enumerable": false, "value": Array.prototype.slice});',
      'Object.defineProperty(this, "toString", {"enumerable": false, "value": NamedTupleToString});',

      'Object.freeze(this);',
      'Object.seal(this);',
    '};'
  ].join('\n');
  eval(code);
  var myClass = container.myClass;
  myClass.constructor = Array;
  myClass.prototype = Object.create(Array.prototype);
  return myClass;
};
