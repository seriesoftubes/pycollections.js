/**
 * pycollections
 * collections.py for JavaScript.
 * License: MIT
 * Docs: https://github.com/seriesoftubes/pycollections.js
*/

!(function(root) {
'use strict';


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


var DictKeyNotFound = function(opt_key) {
  if (arguments.length) {
    this.keyWasSupplied = true;
    this.key = opt_key;
  } else {
    this.keyWasSupplied = false;
  }
};

var DictKeyNotHashable = function(key) {
  this.key = key;
};


var TYPE_BOOLEAN = typeof(true);
var TYPE_NAN = String(NaN);  // special fake type just for the purpose of dict.
var TYPE_NULL = String(null);  // special fake type just for the purpose of dict.
var TYPE_NUMBER = typeof(1);
var TYPE_STRING = typeof('s');
var TYPE_UNDEFINED = typeof(undefined);

var TYPES = {};
TYPES[TYPE_BOOLEAN] = true;
TYPES[TYPE_NAN] = true;
TYPES[TYPE_NULL] = true;
TYPES[TYPE_NUMBER] = true;
TYPES[TYPE_STRING] = true;
TYPES[TYPE_UNDEFINED] = true;


var GET_TYPE = function(v) {
  return v === null ? TYPE_NULL : (Number.isNaN(v) ? TYPE_NAN : typeof(v));
};


var Dict = function(opt_keyValues) {
  this.clear();
  opt_keyValues !== undefined && this.update(opt_keyValues);
};

Dict.fromKeys = function(keys, opt_valueForAllKeys) {
  var dict = new Dict();
  for (var i = 0, len = keys.length; i < len; ++i) {
    dict.set(keys[i], opt_valueForAllKeys);
  }
  return dict;
};

Dict.checkKeyIsHashable_ = function(key) {
  if (!TYPES[GET_TYPE(key)]) throw new DictKeyNotHashable(key);
};

Dict.prototype.clear = function() {
  var typeToKeyValues = {};
  for (var type in TYPES) typeToKeyValues[type] = {};
  this.dict_ = typeToKeyValues;
};

Dict.prototype.copy = function() {
  return new Dict(this);
};

Dict.prototype.set = function(key, value) {
  Dict.checkKeyIsHashable_(key);
  if (arguments.length < 2) throw Error('Must supply a key and a value.');

  return this.dict_[GET_TYPE(key)][key] = value;
};

Dict.prototype.update = function(keyValues) {
  var setKey = this.set.bind(this);
  if (keyValues instanceof Dict) {
    keyValues.iteritems(setKey);
  } else if (Array.isArray(keyValues)) {
    for (var i = 0, len = keyValues.length; i < len; ++i) {
      var keyValue = keyValues[i];
      setKey(keyValue[0], keyValue[1]);
    }
  } else if (typeof keyValues === 'object') {
    var keys = Object.keys(keyValues);
    for (i = 0, len = keys.length; i < len; ++i) {
      var key = keys[i];
      setKey(key, keyValues[key]);
    }
  } else {
    throw Error('Cannot update dict from type: ' + typeof(keyValues));
  }
};

Dict.prototype.hasKey = function(key) {
  Dict.checkKeyIsHashable_(key);
  return this.dict_[GET_TYPE(key)].hasOwnProperty(key);
};

Dict.prototype.get = function(key, opt_defaultValue) {
  var numArgs = arguments.length;
  if (!numArgs) throw Error('Must supply a key');

  var hasKey = this.hasKey(key);
  if (numArgs === 1 && !hasKey) throw new DictKeyNotFound(key);

  return hasKey ? this.dict_[GET_TYPE(key)][key] : opt_defaultValue;
};

Dict.prototype.del = function(key) {
  if (!this.hasKey(key)) throw new DictKeyNotFound(key);

  delete this.dict_[GET_TYPE(key)][key];
};

Dict.prototype.pop = function(key, opt_defaultValue) {
  var hasKey = this.hasKey(key);
  if (arguments.length === 1 && !hasKey) throw new DictKeyNotFound(key);

  var value = this.get(key, opt_defaultValue);
  hasKey && this.del(key);
  return value;
};

Dict.prototype.iterkeys = function(cb) {
  this.iteritems(function(key, value, self) {
    cb(key, self);
  });
};

Dict.prototype.keys = function() {
  var results = [];
  this.iteritems(function(key) {
    results.push(key);
  });
  return results;
};

Dict.prototype.getFirstKey = function() {
  var firstKey;
  var keyWasFound = false;
  this.iteritems(function(key) {
    if (!keyWasFound) {
      firstKey = key;
      keyWasFound = true;
    }
  });
  // important that this throws an exception because the first key can be literal undefined.
  if (!keyWasFound) throw new DictKeyNotFound();
  return firstKey;
};

Dict.prototype.getFirstMatchingKey = function(predicate) {
  var firstKey;
  var keyWasFound = false;
  this.iteritems(function(key, value, self) {
    if (!keyWasFound && predicate(key, self)) {
      firstKey = key;
      keyWasFound = true;
    }
  });
  // important that this throws an exception because the first key can be literal undefined.
  if (!keyWasFound) throw new DictKeyNotFound();
  return firstKey;
};

Dict.prototype.popitem = function() {
  var keyToPop = this.getFirstKey();
  return [keyToPop, this.pop(keyToPop)];
};

Dict.prototype.length = function() {
  var count = 0;
  this.iteritems(function(){++count});
  return count;
};

Dict.prototype.isEmpty = function() {
  return !this.length();
};

Dict.prototype.iteritems = function(cb) {
  var keys = this.dict_;
  var key;

  for (key in keys[TYPE_BOOLEAN]) {
    cb(key === 'true' ? true : false, keys[TYPE_BOOLEAN][key], this);
  }

  for (key in keys[TYPE_NUMBER]) {
    cb(Number(key), keys[TYPE_NUMBER][key], this);
  }

  for (key in keys[TYPE_STRING]) {
    cb(key, keys[TYPE_STRING][key], this);
  }

  for (key in keys[TYPE_NAN]) {
    cb(NaN, keys[TYPE_NAN][key], this);
  }

  for (key in keys[TYPE_NULL]) {
    cb(null, keys[TYPE_NULL][key], this);
  }

  for (key in keys[TYPE_UNDEFINED]) {
    cb(undefined, keys[TYPE_UNDEFINED][key], this);
  }
};

Dict.prototype.items = function() {
  var results = [];
  this.iteritems(function(key, value) {
    results.push([key, value]);
  });
  return results;
};

Dict.prototype.itervalues = function(cb) {
  this.iteritems(function(key, value, self) {
    cb(value, self);
  });
};

Dict.prototype.values = function() {
  var results = [];
  this.iteritems(function(key, value) {
    results.push(value);
  });
  return results;
};

Dict.prototype.setOneNewValue = function(key, fn) {
  return this.set(key, fn(this.get(key), key, this));
};

Dict.prototype.setSomeNewValues = function(keys, fn) {
  for (var i = 0, len = keys.length; i < len; ++i) {
    this.setOneNewValue(keys[i], fn);
  }
};

Dict.prototype.setAllNewValues = function(fn) {
  this.iteritems(function(key, value, self) {
    self.setOneNewValue(key, fn);
  });
};


var DefaultDict = function(defaultFn, opt_keyValues) {
  if (typeof(defaultFn) !== 'function') throw Error('Must supply a default function.');
  this.default_ = defaultFn
  Dict.call(this, opt_keyValues);
};
DefaultDict.constructor = Dict;
DefaultDict.prototype = Object.create(Dict.prototype);


DefaultDict.prototype.get = function(key /*, defaultValue */) {
  // If .get(k, v), use super method.
  if (arguments.length > 1) {
    return Dict.prototype.get.apply(this, arguments);
  }
  return this.hasKey(key) ? Dict.prototype.get.call(this, key) : this.set(key, this.default_());
};

DefaultDict.fromKeys = function(defaultFn, keys, opt_valueForAllKeys) {
  var dict = new DefaultDict(defaultFn);
  for (var i = 0, len = keys.length; i < len; ++i) {
    dict.set(keys[i], opt_valueForAllKeys);
  }
  return dict;
};

DefaultDict.prototype.copy = function() {
  return new DefaultDict(this.default_, this);
};


var GET_ZERO = function() {return 0};

var Counter = function(opt_keyValues) {
  DefaultDict.call(this, GET_ZERO, opt_keyValues);
};
Counter.constructor = DefaultDict;
Counter.prototype = Object.create(DefaultDict.prototype);

Counter.getIncrementor = function(incrementBy) {
  return function(v) {
    return v + incrementBy;
  };
};

Counter.fromKeys = function() {
  throw Error('Not implemented on Counter.');
};

Counter.prototype.copy = function() {
  return new Counter(this);
};

Counter.prototype.update = function(keyValues) {
  var isDict = keyValues instanceof Dict;
  var isArray = Array.isArray(keyValues);
  var isObject = !isArray && !isDict && typeof keyValues === 'object';
  if (this.isEmpty() && (isDict || isObject)) {
    // If it's empty, copy the key-value pairs from the obj/dict as normal.
    return DefaultDict.prototype.update.call(this, keyValues);
  }

  if (isDict) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    var self = this;
    keyValues.iteritems(function(key, value) {
      self.setOneNewValue(key, Counter.getIncrementor(value));
    });
  } else if (isArray) {
    // if given an Array of anything, counts each array element
    // as a key to increment by 1.
    this.setSomeNewValues(keyValues, Counter.getIncrementor(1));
  } else if (isObject) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    var keys = Object.keys(keyValues);
    for (var i = 0, len = keys.length; i < len; ++i) {
      var key = keys[i];
      this.setOneNewValue(key, Counter.getIncrementor(keyValues[key]));
    }
  } else {
    DefaultDict.prototype.update.call(this, keyValues);
  }
};

Counter.prototype.iterelements = function(callback) {
  this.iteritems(function(key, numberOfElementsWithKey, self) {
    for (var i = 0; i < numberOfElementsWithKey; ++i) {
      callback(key, i, numberOfElementsWithKey, self);
    }
  });
};

Counter.prototype.elements = function() {
  var elements = [];
  this.iterelements(function(key) {
    elements.push(key);
  });
  return elements;
};

Counter.prototype.subtract = function(keyValues) {
  if (keyValues instanceof Dict) {
    // Given an Object/Dict, decrements current count
    // of each key in the Dict/Object by its corresponding value.
    var self = this;
    keyValues.iteritems(function(key, value) {
      self.setOneNewValue(key, Counter.getIncrementor(-value));
    });
  } else if (Array.isArray(keyValues)) {
    // if given an Array of anything, counts each array element
    // as a key to decrement by 1.
    this.setSomeNewValues(keyValues, Counter.getIncrementor(-1));
  } else if (typeof keyValues === 'object') {
    // Given an Object/Dict, decrements current count
    // of each key in the Dict/Object by its corresponding value.
    var keys = Object.keys(keyValues);
    for (var i = 0, len = keys.length; i < len; ++i) {
      var key = keys[i];
      this.setOneNewValue(key, Counter.getIncrementor(-keyValues[key]));
    }
  } else {
    throw Error('Must subtract Dict, Array, or Object.');
  }
};

Counter.prototype.mostCommon = function(opt_n) {
  var items = this.items().sort(function(a, b) {
    return b[1] - a[1];
  });
  return arguments.length ? items.slice(0, opt_n) : items;
};

Counter.prototype.leastCommon = function(opt_n) {
  var items = this.items().sort(function(a, b) {
    return a[1] - b[1];
  });
  return arguments.length ? items.slice(0, opt_n) : items;
};


var OrderedDict = function (opt_keyValues) {
  Dict.call(this, opt_keyValues);
};
OrderedDict.constructor = Dict;
OrderedDict.prototype = Object.create(Dict.prototype);

OrderedDict.fromKeys = function(keys, opt_valueForAllKeys) {
  var dict = new OrderedDict();
  for (var i = 0, len = keys.length; i < len; ++i) {
    dict.set(keys[i], opt_valueForAllKeys);
  }
  return dict;
};

OrderedDict.prototype.clear = function() {
  this._orderedKeys = []
  this._keyIndices = new Dict();
  Dict.prototype.clear.call(this);
};

OrderedDict.prototype.copy = function() {
  return new OrderedDict(this);
};

OrderedDict.prototype.set = function(key, value) {
  var hadKey = this.hasKey(key);
  var result = Dict.prototype.set.apply(this, arguments);

  // If the key is new, index its order.
  !hadKey && this._keyIndices.set(key, this._orderedKeys.push(key) - 1);

  return result;
};

var DECREMENT_VALUE = function(v) {return v - 1};

OrderedDict.prototype.del = function(key) {
  var result = Dict.prototype.del.call(this, key);

  // Shift indexed keys to the right of the key.
  var orderedIndex = this._keyIndices.pop(key);
  for (var i = orderedIndex+1, len = this.length(); i < len; ++i) {
    this._keyIndices.setOneNewValue(this._orderedKeys[i], DECREMENT_VALUE);
  }
  this._orderedKeys.splice(orderedIndex, 1);

  return result;
};

OrderedDict.prototype.iteritems = function(cb) {
  for (var i = 0, len = this.length(); i < len; ++i) {
    var key = this._orderedKeys[i];
    cb(key, this.get(key), this);
  }
};

OrderedDict.prototype.length = function() {
  return this._orderedKeys.length;
};

OrderedDict.prototype.getFirstKey = function() {
  // important that this throws an exception because the first key can be literal undefined.
  if (!this.length()) throw new DictKeyNotFound();
  return this._orderedKeys[0];
};


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


// Exporting
var pycollections = {
  'DictKeyNotFound': DictKeyNotFound,
  'DictKeyNotHashable': DictKeyNotHashable,
  'Dict': Dict,
  'DefaultDict': DefaultDict,
  'Counter': Counter,
  'OrderedDict': OrderedDict,
  'NamedTuple': NamedTuple,
  'RESERVED_WORDS': RESERVED_WORDS
};

if (typeof exports !== 'undefined') { // CommonJS module is defined
  if (typeof module !== 'undefined' && module.exports) { // Export module
    module.exports = pycollections;
  }
  exports.pycollections = pycollections;
} else if (typeof define === 'function' && define.amd) { // Register as a named module with AMD.
  define('pycollections', [], function(){return pycollections});
} else { // Create our own pycollections namespace.
  root.pycollections = pycollections;
}
})(this);
