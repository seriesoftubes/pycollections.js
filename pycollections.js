/**
 * pycollections
 * Bringing collections.py to JavaScript.
 * License: MIT
 * Docs: https://github.com/seriesoftubes/pycollections.js
*/

!(function(root) { 
'use strict';


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

var GET_TYPE = function(v) {
  return v === null ? TYPE_NULL : (Number.isNaN(v) ? TYPE_NAN : typeof(v));
};


var Dict = function(opt_keyValues) {
  this.clear();
  opt_keyValues !== undefined && this.update(opt_keyValues);
};

Dict.fromKeys = function(keys, opt_valueForAllKeys) {
  var dict = new Dict();
  for (var i = 0, len = keys.length; i < len; i++) {
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
    for (var i = 0, len = keyValues.length; i < len; i++) {
      var keyValue = keyValues[i];
      setKey(keyValue[0], keyValue[1]);
    }
  } else if (typeof keyValues === 'object') {
    var keys = Object.keys(keyValues);
    for (i = 0, len = keys.length; i < len; i++) {
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

  Dict.checkKeyIsHashable_(key);

  var hasKey = this.hasKey(key);
  if (numArgs === 1 && !hasKey) throw new DictKeyNotFound(key);

  return hasKey ? this.dict_[GET_TYPE(key)][key] : opt_defaultValue;
};

Dict.prototype.del = function(key) {
  Dict.checkKeyIsHashable_(key);
  if (!this.hasKey(key)) throw new DictKeyNotFound(key);

  delete this.dict_[GET_TYPE(key)][key];
};

Dict.prototype.pop = function(key, opt_defaultValue) {
  Dict.checkKeyIsHashable_(key);
  var hasKey = this.hasKey(key);
  if (arguments.length === 1 && !hasKey) throw new DictKeyNotFound(key);

  var value = this.get(key, opt_defaultValue);
  hasKey && this.del(key);
  return value;
};

Dict.prototype.iterkeys = function(cb) {
  var keysByType = this.dict_;
  var key;
  for (key in keysByType[TYPE_BOOLEAN]) cb(key === 'true' ? true : false, this);
  for (key in keysByType[TYPE_NUMBER]) cb(Number(key), this);
  for (key in keysByType[TYPE_STRING]) cb(key, this);
  Object.keys(keysByType[TYPE_NAN]).length && cb(NaN, this);
  Object.keys(keysByType[TYPE_NULL]).length && cb(null, this);
  Object.keys(keysByType[TYPE_UNDEFINED]).length && cb(undefined, this);
};

Dict.prototype.keys = function() {
  var results = [];
  this.iterkeys(function(key) {
    results.push(key);
  });
  return results;
};

Dict.prototype.getFirstKey = function() {
  var firstKey;
  var keyWasFound = false;
  this.iterkeys(function(key) {
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
  this.iterkeys(function(key, self) {
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
  this.iterkeys(function(){count++});
  return count;
};

Dict.prototype.isEmpty = function() {
  return !this.length();
};

Dict.prototype.iteritems = function(cb) {
  this.iterkeys(function(key, self) {
    cb(key, self.get(key), self);
  });
};

Dict.prototype.items = function() {
  var results = [];
  this.iteritems(function(key, value) {
    results.push([key, value]);
  });
  return results;
};

Dict.prototype.itervalues = function(cb) {
  this.iterkeys(function(key, self) {
    cb(self.get(key), self);
  });
};

Dict.prototype.values = function() {
  var results = [];
  this.itervalues(function(value) {
    results.push(value);
  });
  return results;
};

Dict.prototype.setOneNewValue = function(key, fn) {
  return this.set(key, fn(this.get(key), key, this));
};

Dict.prototype.setSomeNewValues = function(keys, fn) {
  for (var i = 0, len = keys.length; i < len; i++) {
    this.setOneNewValue(keys[i], fn);
  }
};

Dict.prototype.setAllNewValues = function(fn) {
  this.iterkeys(function(key, self) {
    self.setOneNewValue(key, fn);
  });
};


var DefaultDict = function(defaultFn, opt_keyValues) {
  if (typeof(defaultFn) !== 'function') throw Error('Must supply a default function.');
  this.default_ = defaultFn
  Dict.call(this, opt_keyValues);
};
DefaultDict.prototype.constructor = Dict;
DefaultDict.prototype = Object.create(Dict.prototype);


DefaultDict.prototype.get = function(key /*, defaultValue */) {
  // If .get(k, v), use super method.
  if (arguments.length > 1) {
    return Dict.prototype.get.apply(this, arguments);
  }
  Dict.checkKeyIsHashable_(key);
  return this.hasKey(key) ? Dict.prototype.get.call(this, key) : this.set(key, this.default_());
};


var Counter = function(opt_keyValues) {
  DefaultDict.call(this, function(){return 0}, opt_keyValues);
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
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      this.setOneNewValue(key, Counter.getIncrementor(keyValues[key]));
    }
  } else {
    DefaultDict.prototype.update.call(this, keyValues);
  }
};

Counter.prototype.iterelements = function(callback) {
  this.iteritems(function(key, numberOfElementsWithKey, self) {
    for (var i = 0; i < numberOfElementsWithKey; i++) {
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
    for (var i = 0, len = keys.length; i < len; i++) {
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


// Exporting
var pycollections = {
  'DictKeyNotFound': DictKeyNotFound,
  'DictKeyNotHashable': DictKeyNotHashable,
  'Dict': Dict,
  'DefaultDict': DefaultDict,
  'Counter': Counter
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
