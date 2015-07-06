

// TODO: dist file that has all classes.
var DefaultDict = function(defaultFn, opt_keyValues) {
  if (typeof(defaultFn) !== 'function') throw Error('Must supply a default function.');
  Dict.call(this, opt_keyValues);
  this.default_ = defaultFn
};
DefaultDict.prototype.constructor = Dict;
DefaultDict.prototype = Object.create(Dict.prototype);


DefaultDict.prototype.get = function(key /*, defaultValue */) {
  // If .get(k, v), use super method.
  if (arguments.length === 2) {
    return this.constructor.prototype.get.apply(this, arguments);
  }
  return this.contains(key) ? this.dict_[key] : this.set(key, this.default_());
};
