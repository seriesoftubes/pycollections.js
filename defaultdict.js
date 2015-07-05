

// TODO: dist file that has all classes.
var DefaultDict = function(defaultFn) {
  Dict.call(this);
  this.default_ = defaultFn;
};
DefaultDict.prototype.constructor = Dict;
DefaultDict.prototype = Object.create(Dict.prototype);


DefaultDict.prototype.get = function(key /*, defaultValue */) {
  // If .get(k, v), use super method.
  if (arguments.length === 2) {
    return this.constructor.prototype.get.call(this, key, arguments[1]);
  }
  return this.contains(key) ? this.dict_[key] : this.set(key, this.default_());
};
