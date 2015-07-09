
/*
for most_common or least_common,
do a sort and get top n

.elements()
.subtract()
.fromKeys -- raise notImplemented
*/


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
