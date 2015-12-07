
var TYPE_BOOLEAN = typeof(true);
var TYPE_NAN = String(NaN);  // special fake type just for the purpose of dict.
var TYPE_NULL = String(null);  // special fake type just for the purpose of dict.
var TYPE_NUMBER = typeof(1);
var TYPE_STRING = typeof('s');
var TYPE_UNDEFINED = typeof(undefined);

var TYPES = {};
TYPES[TYPE_BOOLEAN] = true;
TYPES[TYPE_NAN] = true;
TYPES[TYPE_NULL] = true;
TYPES[TYPE_NUMBER] = true;
TYPES[TYPE_STRING] = true;
TYPES[TYPE_UNDEFINED] = true;


var GET_TYPE = function(v) {
  return v === null ? TYPE_NULL : (Number.isNaN(v) ? TYPE_NAN : typeof(v));
};


var Dict = function(opt_keyValues) {
  this.clear();
  opt_keyValues !== undefined && this.update(opt_keyValues);
};

Dict.fromKeys = function(keys, opt_valueForAllKeys) {
  var dict = new Dict();
  for (var i = 0, len = keys.length; i < len; ++i) {
    dict.set(keys[i], opt_valueForAllKeys);
  }
  return dict;
};

Dict.checkKeyIsHashable_ = function(key) {
  if (!TYPES[GET_TYPE(key)]) throw new DictKeyNotHashable(key);
};

Dict.prototype.clear = function() {
  var typeToKeyValues = {};
  for (var type in TYPES) typeToKeyValues[type] = {};
  this.dict_ = typeToKeyValues;
};

Dict.prototype.copy = function() {
  return new Dict(this);
};

Dict.prototype.set = function(key, value) {
  Dict.checkKeyIsHashable_(key);
  if (arguments.length < 2) throw Error('Must supply a key and a value.');

  return this.dict_[GET_TYPE(key)][key] = value;
};

Dict.prototype.update = function(keyValues) {
  var setKey = this.set.bind(this);
  if (keyValues instanceof Dict) {
    keyValues.iteritems(setKey);
  } else if (Array.isArray(keyValues)) {
    for (var i = 0, len = keyValues.length; i < len; ++i) {
      var keyValue = keyValues[i];
      setKey(keyValue[0], keyValue[1]);
    }
  } else if (typeof keyValues === 'object') {
    var keys = Object.keys(keyValues);
    for (i = 0, len = keys.length; i < len; ++i) {
      var key = keys[i];
      setKey(key, keyValues[key]);
    }
  } else {
    throw Error('Cannot update dict from type: ' + typeof(keyValues));
  }
};

Dict.prototype.hasKey = function(key) {
  Dict.checkKeyIsHashable_(key);
  return this.dict_[GET_TYPE(key)].hasOwnProperty(key);
};

Dict.prototype.get = function(key, opt_defaultValue) {
  var numArgs = arguments.length;
  if (!numArgs) throw Error('Must supply a key');

  var hasKey = this.hasKey(key);
  if (numArgs === 1 && !hasKey) throw new DictKeyNotFound(key);

  return hasKey ? this.dict_[GET_TYPE(key)][key] : opt_defaultValue;
};

Dict.prototype.del = function(key) {
  if (!this.hasKey(key)) throw new DictKeyNotFound(key);

  delete this.dict_[GET_TYPE(key)][key];
};

Dict.prototype.pop = function(key, opt_defaultValue) {
  var hasKey = this.hasKey(key);
  if (arguments.length === 1 && !hasKey) throw new DictKeyNotFound(key);

  var value = this.get(key, opt_defaultValue);
  hasKey && this.del(key);
  return value;
};

Dict.prototype.iterkeys = function(cb) {
  this.iteritems(function(key, value, self) {
    cb(key, self);
  });
};

Dict.prototype.keys = function() {
  var results = [];
  this.iteritems(function(key) {
    results.push(key);
  });
  return results;
};

Dict.prototype.getFirstKey = function() {
  var firstKey;
  var keyWasFound = false;
  this.iteritems(function(key) {
    if (!keyWasFound) {
      firstKey = key;
      keyWasFound = true;
    }
  });
  // important that this throws an exception because the first key can be literal undefined.
  if (!keyWasFound) throw new DictKeyNotFound();
  return firstKey;
};

Dict.prototype.getFirstMatchingKey = function(predicate) {
  var firstKey;
  var keyWasFound = false;
  this.iteritems(function(key, value, self) {
    if (!keyWasFound && predicate(key, self)) {
      firstKey = key;
      keyWasFound = true;
    }
  });
  // important that this throws an exception because the first key can be literal undefined.
  if (!keyWasFound) throw new DictKeyNotFound();
  return firstKey;
};

Dict.prototype.popitem = function() {
  var keyToPop = this.getFirstKey();
  return [keyToPop, this.pop(keyToPop)];
};

Dict.prototype.length = function() {
  var count = 0;
  this.iteritems(function(){++count});
  return count;
};

Dict.prototype.isEmpty = function() {
  return !this.length();
};

Dict.prototype.iteritems = function(cb) {
  var keys = this.dict_;
  var key;

  for (key in keys[TYPE_BOOLEAN]) {
    cb(key === 'true' ? true : false, keys[TYPE_BOOLEAN][key], this);
  }

  for (key in keys[TYPE_NUMBER]) {
    cb(Number(key), keys[TYPE_NUMBER][key], this);
  }

  for (key in keys[TYPE_STRING]) {
    cb(key, keys[TYPE_STRING][key], this);
  }

  for (key in keys[TYPE_NAN]) {
    cb(NaN, keys[TYPE_NAN][key], this);
  }

  for (key in keys[TYPE_NULL]) {
    cb(null, keys[TYPE_NULL][key], this);
  }

  for (key in keys[TYPE_UNDEFINED]) {
    cb(undefined, keys[TYPE_UNDEFINED][key], this);
  }
};

Dict.prototype.items = function() {
  var results = [];
  this.iteritems(function(key, value) {
    results.push([key, value]);
  });
  return results;
};

Dict.prototype.itervalues = function(cb) {
  this.iteritems(function(key, value, self) {
    cb(value, self);
  });
};

Dict.prototype.values = function() {
  var results = [];
  this.iteritems(function(key, value) {
    results.push(value);
  });
  return results;
};

Dict.prototype.setOneNewValue = function(key, fn) {
  return this.set(key, fn(this.get(key), key, this));
};

Dict.prototype.setSomeNewValues = function(keys, fn) {
  for (var i = 0, len = keys.length; i < len; ++i) {
    this.setOneNewValue(keys[i], fn);
  }
};

Dict.prototype.setAllNewValues = function(fn) {
  this.iteritems(function(key, value, self) {
    self.setOneNewValue(key, fn);
  });
};
