/**
 * A Dict is a useful interface on top of Object.
 * Corresponds to Python's built-in dict class.
 */


var Dict = (function() {

var TYPE_BOOLEAN = typeof(true);
var TYPE_NUMBER = typeof(1);
var TYPE_STRING = typeof('s');
var TYPE_UNDEFINED = typeof(undefined);
// TODO: null type.  can do GetType = fn(key) {key === null ? null : typeof(key);}
var TYPES = [
  TYPE_BOOLEAN,
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_UNDEFINED
];


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
  if (typeof(key) === 'object') throw Error('Unhashable key:' + key);
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
  delete this.dict_[typeof(key)][key];
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
  return this.dict_[typeof(key)].hasOwnProperty(key);
};

Dict.prototype.get = function(key, opt_defaultValue) {
  Dict.checkKeyIsHashable_(key);
  var hasKey = this.hasKey(key);
  if (arguments.length === 1 && !hasKey) throw Error('Missing key: ' + key);
  return hasKey ? this.dict_[typeof(key)][key] : opt_defaultValue;
};

Dict.prototype.set = function(key, value) {
  Dict.checkKeyIsHashable_(key);
  if (arguments.length < 2) throw Error('Must supply a key and a value.');
  return this.dict_[typeof(key)][key] = value;
};

Dict.prototype.keys = function() {
  var keysByType = this.dict_;
  // todo: have pairs of (typename, conversion function) and do this as loop

  var booleanKeys = Object.keys(keysByType[TYPE_BOOLEAN]);
  var booleans = booleanKeys.map(function(k){return k === 'true' ? true : false;});

  var numericKeys = Object.keys(keysByType[TYPE_NUMBER]);
  var numbers = numericKeys.map(Number);

  var stringKeys = Object.keys(keysByType[TYPE_STRING]);
  var strings = stringKeys.map(String);

  var undefinedKeys = Object.keys(keysByType[TYPE_UNDEFINED]);
  var undefineds = undefinedKeys.map(function(){return undefined;});

  var allKeys = [];
  allKeys = allKeys.concat.call(allKeys, booleans, numbers, strings, undefineds);
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
