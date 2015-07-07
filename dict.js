
var Dict = function(opt_keyValues) {
  this.dict_ = {};
  opt_keyValues && this.update(opt_keyValues);
};

Dict.prototype.update = function(keyValues) {
  var setKey = this.set.bind(this);
  if (keyValues instanceof Dict) {
    keyValues.iteritems(setKey);
  }
  else if (keyValues instanceof Array) {
    keyValues.forEach(function(keyValue) {
      setKey(keyValue[0], keyValue[1]);
    });
  }
  else if (typeof keyValues === 'object') {
    Object.keys(keyValues).forEach(function(key) {
      setKey(key, keyValues[key]);
    });
  }
};

Dict.fromKeys = function(keys, valueForAllKeys) {
  var keyValues = [];
  keys.forEach(function(key) {
    keyValues.push([key, valueForAllKeys]);
  });
  return new Dict(keyValues);
};

Dict.checkKeyIsHashable_ = function(key) {
  if (typeof(key) === 'object') throw Error('Unhashable key:' + key);
};

Dict.prototype.clear = function() {
  this.dict_ = {};
};

Dict.prototype.copy = function() {
  return new Dict(this);
};

Dict.prototype.del = function(key) {
  delete this.dict_[key];
};

Dict.prototype.pop = function(key, opt_defaultValue) {
  if (arguments.length === 1 && !this.hasKey(key)) throw Error('Missing key: ' + key);
  var value = this.get(key, opt_defaultValue);
  this.del(key);
  return value;
};

Dict.prototype.popitem = function() {
  if (this.isEmpty()) throw Error('Cannot pop item from empty dict.');
  return this.pop(this.keys()[0]);
};

Dict.prototype.length = function() {
  return this.keys().length;
};

Dict.prototype.isEmpty = function() {
  return !this.length();
};

Dict.prototype.hasKey = function(key) {
  return this.dict_.hasOwnProperty(key);
};

Dict.prototype.get = function(key, opt_defaultValue) {
  Dict.checkKeyIsHashable_(key);
  return this.hasKey(key) ? this.dict_[key] : opt_defaultValue;
};

// TODO: support non-string keys like true, 1.23.
Dict.prototype.set = function(key, value) {
  Dict.checkKeyIsHashable_(key);
  return this.dict_[key] = value;
};

Dict.prototype.keys = function() {
  return Object.keys(this.dict_);
};

Dict.prototype.items = function() {
  var pairs = [];
  this.keys().forEach(function(key) {
    pairs.push([key, this.dict_[key]]);
  }, this);
  return pairs;
};

Dict.prototype.iteritems = function(cb) {
  this.keys().forEach(function(key) {
    cb(key, this.dict_[key]);
  }, this);
};

Dict.prototype.values = function() {
  var values = [];
  this.keys().forEach(function(key) {
    values.push(this.dict_[key]);
  }, this);
  return values;
};

Dict.prototype.modify = function(key, fn) {
  var value = this.get(key);
  return this.set(key, fn(value));
};

Dict.prototype.modifySome = function(keys, fn) {
  keys.forEach(function(key) {
    this.modify(key, fn);
  }, this);
};

Dict.prototype.modifyAll = function(fn) {
  this.modifySome(this.keys(), fn);
};
