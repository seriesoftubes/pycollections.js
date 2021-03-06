
var DefaultDict = function(defaultFn, opt_keyValues) {
  if (typeof(defaultFn) !== 'function') throw Error('Must supply a default function.');
  this.default_ = defaultFn
  Dict.call(this, opt_keyValues);
};
DefaultDict.constructor = Dict;
DefaultDict.prototype = Object.create(Dict.prototype);


DefaultDict.prototype.get = function(key /*, defaultValue */) {
  // If .get(k, v), use super method.
  if (arguments.length > 1) {
    return Dict.prototype.get.apply(this, arguments);
  }
  return this.hasKey(key) ? Dict.prototype.get.call(this, key) : this.set(key, this.default_());
};

DefaultDict.fromKeys = function(defaultFn, keys, opt_valueForAllKeys) {
  var dict = new DefaultDict(defaultFn);
  for (var i = 0, len = keys.length; i < len; ++i) {
    dict.set(keys[i], opt_valueForAllKeys);
  }
  return dict;
};

DefaultDict.prototype.copy = function() {
  return new DefaultDict(this.default_, this);
};
