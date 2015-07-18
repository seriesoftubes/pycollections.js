
var GET_ZERO = function() {return 0};

var Counter = function(opt_keyValues) {
  DefaultDict.call(this, GET_ZERO, opt_keyValues);
};
Counter.constructor = DefaultDict;
Counter.prototype = Object.create(DefaultDict.prototype);

Counter.getIncrementor = function(incrementBy) {
  return function(v) {
    return v + incrementBy;
  };
};

Counter.fromKeys = function() {
  throw Error('Not implemented on Counter.');
};

Counter.prototype.update = function(keyValues) {
  var isDict = keyValues instanceof Dict;
  var isArray = Array.isArray(keyValues);
  var isObject = !isArray && !isDict && typeof keyValues === 'object';
  if (this.isEmpty() && (isDict || isObject)) {
    // If it's empty, copy the key-value pairs from the obj/dict as normal.
    return DefaultDict.prototype.update.call(this, keyValues);
  }

  if (isDict) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    var self = this;
    keyValues.iteritems(function(key, value) {
      self.setOneNewValue(key, Counter.getIncrementor(value));
    });
  } else if (isArray) {
    // if given an Array of anything, counts each array element
    // as a key to increment by 1.
    this.setSomeNewValues(keyValues, Counter.getIncrementor(1));
  } else if (isObject) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    var keys = Object.keys(keyValues);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      this.setOneNewValue(key, Counter.getIncrementor(keyValues[key]));
    }
  } else {
    DefaultDict.prototype.update.call(this, keyValues);
  }
};

Counter.prototype.iterelements = function(callback) {
  this.iteritems(function(key, numberOfElementsWithKey, self) {
    for (var i = 0; i < numberOfElementsWithKey; i++) {
      callback(key, i, numberOfElementsWithKey, self);
    }
  });
};

Counter.prototype.elements = function() {
  var elements = [];
  this.iterelements(function(key) {
    elements.push(key);
  });
  return elements;
};

Counter.prototype.subtract = function(keyValues) {
  if (keyValues instanceof Dict) {
    // Given an Object/Dict, decrements current count
    // of each key in the Dict/Object by its corresponding value.
    var self = this;
    keyValues.iteritems(function(key, value) {
      self.setOneNewValue(key, Counter.getIncrementor(-value));
    });
  } else if (Array.isArray(keyValues)) {
    // if given an Array of anything, counts each array element
    // as a key to decrement by 1.
    this.setSomeNewValues(keyValues, Counter.getIncrementor(-1));
  } else if (typeof keyValues === 'object') {
    // Given an Object/Dict, decrements current count
    // of each key in the Dict/Object by its corresponding value.
    var keys = Object.keys(keyValues);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      this.setOneNewValue(key, Counter.getIncrementor(-keyValues[key]));
    }
  } else {
    throw Error('Must subtract Dict, Array, or Object.');
  }
};

Counter.prototype.mostCommon = function(opt_n) {
  var items = this.items().sort(function(a, b) {
    return b[1] - a[1];
  });
  return arguments.length ? items.slice(0, opt_n) : items;
};

Counter.prototype.leastCommon = function(opt_n) {
  var items = this.items().sort(function(a, b) {
    return a[1] - b[1];
  });
  return arguments.length ? items.slice(0, opt_n) : items;
};
