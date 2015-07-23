
var OrderedDict = function (opt_keyValues) {
  Dict.call(this, opt_keyValues);
};
OrderedDict.constructor = Dict;
OrderedDict.prototype = Object.create(Dict.prototype);

OrderedDict.fromKeys = function(keys) {
  var dict = new OrderedDict();
  for (var i = 0, len = keys.length; i < len; i++) {
    dict.set(keys[i], arguments[1]);
  }
  return dict;
};

OrderedDict.prototype.clear = function() {
  this._orderedKeys = []
  this._keyIndices = new Dict();
  Dict.prototype.clear.call(this);
};

OrderedDict.prototype.copy = function() {
  return new OrderedDict(this);
};

OrderedDict.prototype.set = function(key, value) {
  // If the key is new, index its order.
  if (!this.hasKey(key)) {
    var index = this._orderedKeys.push(key) - 1;
    this._keyIndices.set(key, index);
  }
  return Dict.prototype.set.apply(this, arguments);
};

var DECREMENT_VALUE = function(v) {return v - 1};

OrderedDict.prototype.del = function(key) {
  // Shift indexed keys to the right of the key.
  var orderedIndex = this._keyIndices.pop(key);
  for (var i = orderedIndex+1, len = this.length(); i < len; i++) {
    this._keyIndices.setOneNewValue(this._orderedKeys[i], DECREMENT_VALUE);
  }
  this._orderedKeys.splice(orderedIndex, 1);

  return Dict.prototype.del.call(this, key);
};

OrderedDict.prototype.iterkeys = function(cb) {
  for (var i = 0, len = this.length(); i < len; i++) {
    cb(this._orderedKeys[i], this);
  }
};

OrderedDict.prototype.length = function() {
  return this._orderedKeys.length;
};

OrderedDict.prototype.getFirstKey = function() {
  // important that this throws an exception because the first key can be literal undefined.
  if (!this.length()) throw new DictKeyNotFound();
  return this._orderedKeys[0];
};
