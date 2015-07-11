/**
 * A Dict is a useful interface on top of Object.
 * Corresponds to Python's built-in dict class.
 */


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

Dict.prototype.update = function(keyValues) {
  var setKey = this.set.bind(this);
  if (keyValues instanceof Dict) {
    keyValues.iteritems(setKey);
  } else if (keyValues instanceof Array) {
    keyValues.forEach(function(keyValue) {
      setKey(keyValue[0], keyValue[1]);
    });
  } else if (typeof keyValues === 'object') {
    Object.keys(keyValues).forEach(function(key) {
      setKey(key, keyValues[key]);
    });
  } else {
    throw Error('Cannot update dict from type: ' + typeof(keyValues));
  }
};

Dict.fromKeys = function(keys, valueForAllKeys) {
  var keyValues = keys.map(function(key) {
    return [key, valueForAllKeys];
  });
  return new Dict(keyValues);
};

Dict.checkKeyIsHashable_ = function(key) {
  if (GET_TYPE(key) === 'object') throw Error('Unhashable key:' + key);
};

Dict.prototype.clear = function() {
  var typeToKeyValues = {};
  TYPES.forEach(function(type) {
    typeToKeyValues[type] = {};
  });
  this.dict_ = typeToKeyValues;
};

Dict.prototype.copy = function() {
  return new Dict(this);
};

Dict.prototype.del = function(key) {
  Dict.checkKeyIsHashable_(key);
  if (!this.hasKey(key)) throw Error('Missing key: ' + key);
  delete this.dict_[GET_TYPE(key)][key];
};

Dict.prototype.pop = function(key, opt_defaultValue) {
  Dict.checkKeyIsHashable_(key);
  if (arguments.length === 1 && !this.hasKey(key)) throw Error('Missing key: ' + key);
  var value = this.get(key, opt_defaultValue);
  this.del(key);
  return value;
};

Dict.prototype.popitem = function() {
  if (this.isEmpty()) throw Error('Cannot pop item from empty dict.');
  var keyToPop = this.keys()[0];
  return [keyToPop, this.pop(keyToPop)];
};

Dict.prototype.length = function() {
  return this.keys().length;
};

Dict.prototype.isEmpty = function() {
  return !this.length();
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

Dict.prototype.set = function(key, value) {
  Dict.checkKeyIsHashable_(key);
  if (arguments.length < 2) throw Error('Must supply a key and a value.');
  return this.dict_[GET_TYPE(key)][key] = value;
};

Dict.prototype.keys = function() {
  var keysByType = this.dict_;
  var allKeys = [];
  var keys = [];
  var i = 0;

  keys = Object.keys(keysByType[TYPE_BOOLEAN]);
  // Boolean('false') === true.  Detect if it's one or the other.
  for (i = 0; i < keys.length; i++) allKeys.push(keys[i] === 'true' ? true : false);

  keys = Object.keys(keysByType[TYPE_NUMBER]);
  for (i = 0; i < keys.length; i++) allKeys.push(Number(keys[i]));

  keys = Object.keys(keysByType[TYPE_STRING]);
  for (i = 0; i < keys.length; i++) allKeys.push(String(keys[i]));

  // there can be only 1 key in the null/undefined dicts.
  Object.keys(keysByType[TYPE_NULL]).length && allKeys.push(null);
  Object.keys(keysByType[TYPE_UNDEFINED]).length && allKeys.push(undefined);

  return allKeys;
};

Dict.prototype.items = function() {
  return this.keys().map(function(key) {
    return [key, this.get(key)];
  }, this);
};

Dict.prototype.iteritems = function(cb) {
  this.keys().forEach(function(key) {
    cb(key, this.get(key), this);
  }, this);
};

Dict.prototype.values = function() {
  return this.keys().map(this.get.bind(this));
};

Dict.prototype.modify = function(key, fn) {
  var value = this.get(key);
  return this.set(key, fn(value, key, this));
};

Dict.prototype.modifySome = function(keys, fn) {
  keys.forEach(function(key) {
    this.modify(key, fn);
  }, this);
};

Dict.prototype.modifyAll = function(fn) {
  this.modifySome(this.keys(), fn);
};

return Dict;
})();
