
var VALID_NAME = /^[a-zA-Z\_]+[a-zA-Z0-9\_]*$/;

// Reserved words in JS as of ES6:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords
var RESERVED_WORDS = {
  'break': true,
  'case': true,
  'class': true,
  'catch': true,
  'const': true,
  'continue': true,
  'debugger': true,
  'default': true,
  'delete': true,
  'do': true,
  'else': true,
  'export': true,
  'extends': true,
  'finally': true,
  'for': true,
  'function': true,
  'if': true,
  'import': true,
  'in': true,
  'instanceof': true,
  'let': true,
  'new': true,
  'return': true,
  'super': true,
  'switch': true,
  'this': true,
  'throw': true,
  'try': true,
  'typeof': true,
  'var': true,
  'void': true,
  'while': true,
  'with': true,
  'yield': true,
  'enum': true,
  'await': true
};
Object.freeze(RESERVED_WORDS);


var NamedTupleToString = function() {
  var fields = this.fields;
  var parts = [name, '('];
  for (var i = 0, len = this.length; i < len; ++i) {
    parts.push(fields[i] + '=' + String(this[i]));
    i < len - 1 && parts.push(', ');
  }
  parts.push(')');
  return parts.join('');
};

var NamedTupleAsDict = function() {
  var dict = new OrderedDict();
  for (var i = 0; i < this.length; ++i) dict.set(this.fields[i], this[i]);
  return dict;
};


var NamedTuple = function(name, props) {
  if (typeof name !== 'string') throw Error('must include a string name');
  if (!Array.isArray(props)) throw TypeError('props must be an array');
  if (!VALID_NAME.test(name)) throw Error('invalid name');
  if (RESERVED_WORDS[name]) throw Error('cannot use reserved word as name');

  var nargs = props.length;
  var container = {};
  var code = [
    'container.myClass = function ' + name + '() {',
      'if (arguments.length !== nargs) throw Error(nargs + " args required");',

      'for (var i = 0; i < nargs; ++i) this[props[i]] = this[i] = arguments[i];',

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
