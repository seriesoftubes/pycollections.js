/**
 * A Dict is a useful interface on top of Object.
 * Corresponds to Python's built-in dict class.
 */
'use strict';

var DictKeyNotFound = function() {};


var Dict = (function() {

var TYPE_BOOLEAN = typeof(true);
var TYPE_NULL = 'null'; // special fake type just for the purpose of dict.
var TYPE_NUMBER = typeof(1);
var TYPE_STRING = typeof('s');
var TYPE_UNDEFINED = typeof(undefined);

var TYPES = [
  TYPE_BOOLEAN,
  TYPE_NULL,
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_UNDEFINED
];

// TODO: maybe memoize this (would req json.dump or a indexOf on array) - test d.get()
var GET_TYPE = function(v) {
  return v === null ? TYPE_NULL : typeof(v);
};


var Dict = function(opt_keyValues) {
  this.clear();
  opt_keyValues !== undefined && this.update(opt_keyValues);
};

Dict.fromKeys = function(keys, valueForAllKeys) {
  var dict = new Dict();
  for (var i = 0, len=keys.length; i < len; i++) {
    dict.set(keys[i], valueForAllKeys);
  }
  return dict;
};

Dict.checkKeyIsHashable_ = function(key) {
  if (GET_TYPE(key) === 'object') throw Error('Unhashable key:' + key);
};

Dict.prototype.clear = function() {
  var typeToKeyValues = {};
  for (var i = 0, len = TYPES.length; i < len; i++) {
    typeToKeyValues[TYPES[i]] = {};
  }
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
  } else if (keyValues instanceof Array) {
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
  if (numArgs === 1 && !hasKey) throw Error('Missing key: ' + key);
  return hasKey ? this.dict_[GET_TYPE(key)][key] : opt_defaultValue;
};

Dict.prototype.del = function(key) {
  Dict.checkKeyIsHashable_(key);
  if (!this.hasKey(key)) throw Error('Missing key: ' + key);
  delete this.dict_[GET_TYPE(key)][key];
};

Dict.prototype.pop = function(key, opt_defaultValue) {
  Dict.checkKeyIsHashable_(key);
  var hasKey = this.hasKey(key);
  if (arguments.length === 1 && !hasKey) throw Error('Missing key: ' + key);
  var value = this.get(key, opt_defaultValue);
  hasKey && this.del(key);
  return value;
};

Dict.prototype.popitem = function() {
  var keyToPop = this.getFirstKey();
  return [keyToPop, this.pop(keyToPop)];
};

Dict.prototype.iterkeys = function(cb) {
  var keysByType = this.dict_;
  var key;
  for (key in keysByType[TYPE_BOOLEAN]) cb(key === 'true' ? true : false, this);
  for (key in keysByType[TYPE_NUMBER]) cb(Number(key), this);
  for (key in keysByType[TYPE_STRING]) cb(key, this);
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

Dict.prototype.modify = function(key, fn) {
  var value = this.get(key);
  return this.set(key, fn(value, key, this));
};

Dict.prototype.modifySome = function(keys, fn) {
  for (var i = 0, len = keys.length; i < len; i++) {
    this.modify(keys[i], fn);
  }
};

Dict.prototype.modifyAll = function(fn) {
  this.iterkeys(function(key, self) {
    self.modify(key, fn);
  });
};

return Dict;
})();
