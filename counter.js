/**
 * A Counter can count distinct hashable elements.
 * Corresponds to Python's collections.Counter class.
 */
'use strict';


var Counter = (function() {
var Counter = function(opt_keyValues) {
  DefaultDict.call(this, Number, opt_keyValues);
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
  var isArray = keyValues instanceof Array;
  var isObject = typeof keyValues === 'object' && !isArray && !isDict;
  if (this.isEmpty() && (isDict || isObject)) {
    // If it's empty, copy the key-value pairs from the obj/dict as normal.
    return DefaultDict.prototype.update.call(this, keyValues);
  }

  var modify = this.modify.bind(this);
  if (isDict) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    keyValues.iteritems(function(key, value) {
      modify(key, Counter.getIncrementor(value));
    });
  } else if (isArray) {
    // if given an Array of anything, counts each array element
    // as a key to increment by 1.
    var incrementByOne = Counter.getIncrementor(1);
    keyValues.forEach(function(key) {
       modify(key, incrementByOne);
    });
  } else if (isObject) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    Object.keys(keyValues).forEach(function(key) {
      modify(key, Counter.getIncrementor(keyValues[key]));
    });
  } else {
    DefaultDict.prototype.update.call(this, keyValues);
  }
};

Counter.prototype.elements = function() {
  var elements = [];
  this.iteritems(function(key, numberOfElementsWithKey) {
    for (var i = 0; i < numberOfElementsWithKey; i++) {
      elements.push(key);
    }
  });
  return elements;
};

Counter.prototype.iterelements = function(callback) {
  var self = this;
  this.iteritems(function(key, numberOfElementsWithKey) {
    for (var i = 0; i < numberOfElementsWithKey; i++) {
      callback(key, i, numberOfElementsWithKey, self);
    }
  });
};

Counter.prototype.subtract = function(keyValues) {
  var modify = this.modify.bind(this);
  if (keyValues instanceof Dict) {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    keyValues.iteritems(function(key, value) {
      modify(key, Counter.getIncrementor(-value));
    });
  } else if (keyValues instanceof Array) {
    // if given an Array of anything, counts each array element
    // as a key to increment by 1.
    var decrement = Counter.getIncrementor(-1);
    keyValues.forEach(function(key) {
       modify(key, decrement);
    });
  } else if (typeof keyValues === 'object') {
    // Given an Object/Dict, increments current count
    // of each key in the Dict/Object by its corresponding value.
    Object.keys(keyValues).forEach(function(key) {
      modify(key, Counter.getIncrementor(-keyValues[key]));
    });
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

return Counter;
})();
