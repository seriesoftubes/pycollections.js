/**
 * A DefaultDict automatically sets a default value for missing keys when running .get(key).
 * Corresponds to Python's collections.DefaultDict class.
 */
'use strict';


// TODO: dist file that has all classes.
window.DefaultDict = (function() {
var DefaultDict = function(defaultFn, opt_keyValues) {
  if (typeof(defaultFn) !== 'function') throw Error('Must supply a default function.');
  this.default_ = defaultFn
  Dict.call(this, opt_keyValues);
};
DefaultDict.prototype.constructor = Dict;
DefaultDict.prototype = Object.create(Dict.prototype);


DefaultDict.prototype.get = function(key /*, defaultValue */) {
  // If .get(k, v), use super method.
  if (arguments.length > 1) {
    return Dict.prototype.get.apply(this, arguments);
  }
  Dict.checkKeyIsHashable_(key);
  return this.hasKey(key) ? Dict.prototype.get.call(this, key) : this.set(key, this.default_());
};

return DefaultDict;
})();
