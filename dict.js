
var Dict = function(opt_keyValues) {
  this.dict_ = {};
  opt_keyValues && this.update(opt_keyValues);
};

Dict.prototype.update = function(keyValues) {
  if (keyValues instanceof Dict) {
    keyValues.iteritems(this.set.bind(this));
  }
  else if (keyValues instanceof Array) {
    keyValues.forEach(function(keyValue) {
      this.set(keyValue[0], keyValue[1]);
    }, this);
  }
  else if (typeof keyValues === 'object') {
    Object.keys(keyValues).forEach(function(key) {
      this.set(key, keyValues[key]);
    }, this);
  }
};

Dict.fromKeys = function(keys, valueForAllKeys) {
  var keyValues = [];
  keys.forEach(function(key) {
    keyValues.push([key, valueForAllKeys]);
  });
  return new Dict(keyValues);
};

Dict.prototype.length = function() {
  return this.keys().length;
};

Dict.prototype.hasKey = function(key) {
  return this.dict_.hasOwnProperty(key);
};

Dict.prototype.get = function(key, opt_defaultValue) {
  return this.hasKey(key) ? this.dict_[key] : opt_defaultValue;
};

Dict.prototype.set = function(key, value) {
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
