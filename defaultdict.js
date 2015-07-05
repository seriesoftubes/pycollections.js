

// TODO: maybe allow defaultFn to be a nonfn
var DefaultDict = function(defaultFn) {
  this.createDefaultValue_ = defaultFn;
  this.dict_ = {};
};

DefaultDict.prototype.contains = function(key) {
  return this.dict_.hasOwnProperty(key);
};

// Todo: maybe have 2nd arg for optional default value
DefaultDict.prototype.get = function(key) {
  if (this.contains(key)) return this.dict_[key];
  return this.set(key, this.createDefaultValue_());
};

DefaultDict.prototype.set = function(key, value) {
  return this.dict_[key] = value;
};

DefaultDict.prototype.keys = function() {
  return Object.keys(this.dict_);
};

DefaultDict.prototype.items = function() {
  var pairs = [];
  this.keys().forEach(function(key) {
    pairs.push([key, this.dict_[key]]);
  }, this);
  return pairs;
};

DefaultDict.prototype.values = function() {
  var values = [];
  this.keys().forEach(function(key) {
    values.push(this.dict_[key]);
  }, this);
  return values;
};

DefaultDict.prototype.modify = function(key, fn) {
  var value = this.get(key);
  return this.set(key, fn(value));
};

DefaultDict.prototype.modifySome = function(keys, fn) {
  keys.forEach(function(key) {
    this.modify(key, fn);
  }, this);
};

DefaultDict.prototype.modifyAll = function(fn) {
  this.modifySome(this.keys(), fn);
};


var counter = new DefaultDict(Number);
var letters = 'aaabbc'.split('');
counter.modifySome(letters, function(v) {
  return v + 1;
});
console.log(counter.items().join('\n'));