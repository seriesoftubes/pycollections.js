

var Dict = function() {
  this.dict_ = {};
};


Dict.prototype.contains = function(key) {
  return this.dict_.hasOwnProperty(key);
};

Dict.prototype.get = function(key, defaultValue) {
  return this.contains(key) ? this.dict_[key] : defaultValue;
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
