// Tests for OrderedDict.

if (typeof require !== 'undefined') var pycollections = require('../dist/pycollections');
var Dict = pycollections.Dict;
var OrderedDict = pycollections.OrderedDict;
var DictKeyNotFound = pycollections.DictKeyNotFound;
var DictKeyNotHashable = pycollections.DictKeyNotHashable;


describe("OrderedDict constructed with Array of 2 unique key-value pairs: one representing the key 'a' and another for 'b'", function() {
  var dict;

  var constructorArgs = [
    ['a', 1],
    ['b', 99]
  ];

  beforeEach(function() {
    dict = new OrderedDict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has 2 items that match the constructor key-value pairs', function() {
    var items = dict.items();
    expect(items.length).toBe(2);
    constructorArgs.forEach(function(keyValue) {
      expect(items).toContain(keyValue);
    });
  });

  it("Has 2 keys: 'a' and 'b'", function() {
    var keys = dict.keys();
    expect(keys.length).toBe(2);
    expect(keys).toContain('a');
    expect(keys).toContain('b');
  });

  it('Has 2 values corresponding to those in the "value" part of the key-value pairs passed to the constructor.', function() {
    var values = dict.values();
    expect(values.length).toBe(2);
    expect(values).toContain(1);
    expect(values).toContain(99);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true,
  ];

  it('Contains only the keys "a" and "b"', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      try {
        dict.get(key);
      } catch (e) {
        expect(e instanceof DictKeyNotFound).toBe(true);
        expect(e.keyWasSupplied).toBe(true);
        expect(e.key).toBe(key);
        return;
      }
      throw new Error('should not be reached');
    });
  });

  it('Returns defaultValue from get() with any non-present key and a defaultValue', function() {
    var defaultValue = {1: 2};
    possibleKeys.forEach(function(key) {
      expect(dict.get(key, defaultValue)).toBe(defaultValue);
    });
  });

  it('Returns existing value from get() with existing key and a defaultValue', function() {
    var defaultValue = {1: 2};
    expect(dict.get('a', defaultValue)).toBe(1);
    expect(dict.get('b', defaultValue)).toBe(99);
  });
});


describe('OrderedDict constructed with non-empty non-unique Array, with one key-value pair for key "a" and 2 key-value pairs whose key part is "b"', function() {
  var dict;

  var constructorArgs = [
    ['a', 1],
    ['b', 99],
    ['b', 100]
  ];

  beforeEach(function() {
    dict = new OrderedDict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has 2 items: one for the sole key "a" key-value pair from the constructor arg, and another from the final "b" key-value pair from the constructor arg.', function() {
    var items = dict.items();
    expect(items.length).toBe(2);
    expect(items).toContain(['a', 1]);
    expect(items).toContain(['b', 100]);
  });

  it('Has 2 keys: "a" and "b"', function() {
    var keys = dict.keys();
    expect(keys.length).toBe(2);
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).not.toContain('basd');
  });

  it('Has 2 values: one corresponding to the value of the "a" key-value pair of the constructor arg, and another corresponding to the latest "b" key-value pair of the constructor arg.', function() {
    var values = dict.values();
    expect(values.length).toBe(2);
    expect(values).toContain(1);
    expect(values).toContain(100);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true
  ];

  it('Contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      try {
        dict.get(key);
      } catch (e) {
        expect(e instanceof DictKeyNotFound).toBe(true);
        expect(e.keyWasSupplied).toBe(true);
        expect(e.key).toBe(key);
        return;
      }
      throw new Error('should not be reached');
    });
  });

  it('Returns defaultValue from get() with any non-present key and a defaultValue', function() {
    var defaultValue = {1: 2};
    possibleKeys.forEach(function(key) {
      expect(dict.get(key, defaultValue)).toBe(defaultValue);
    });
  });

  it('Returns existing value from get() with existing key and a defaultValue', function() {
    var defaultValue = {1: 2};
    expect(dict.get('a', defaultValue)).toBe(1);
    expect(dict.get('b', defaultValue)).toBe(100);
  });
});


describe('OrderedDict constructed with non-empty object containing "a" and "b" keys as the arg', function() {
  var dict;

  var constructorArgs = {
    'a': true,
    'b': [1, 2, 3]
  };

  beforeEach(function() {
    dict = new OrderedDict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has 2 items matching the key-value pairs of the constructor arg.', function() {
    var items = dict.items();
    expect(items.length).toBe(2);
    expect(items).toContain(['a', true]);
    expect(items).toContain(['b', [1, 2, 3]]);
  });

  it('Has 2 keys: "a" and "b"', function() {
    var keys = dict.keys();
    expect(keys.length).toBe(2);
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).not.toContain('basd');
  });

  it('Has 2 values matching those of the constructor arg Object.', function() {
    var values = dict.values();
    expect(values.length).toBe(2);
    expect(values).toContain(true);
    expect(values).toContain([1, 2 ,3]);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true
  ];

  it('Contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws an error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      try {
        dict.get(key);
      } catch (e) {
        expect(e instanceof DictKeyNotFound).toBe(true);
        expect(e.keyWasSupplied).toBe(true);
        expect(e.key).toBe(key);
        return;
      }
      throw new Error('should not be reached');
    });
  });

  it('Returns defaultValue from get() with any non-present key and a defaultValue', function() {
    var defaultValue = {1: 2};
    possibleKeys.forEach(function(key) {
      expect(dict.get(key, defaultValue)).toBe(defaultValue);
    });
  });

  it('Returns existing value from get() with existing key and a defaultValue', function() {
    var defaultValue = {1: 2};
    expect(dict.get('a', defaultValue)).toBe(true);
    expect(dict.get('b', defaultValue)).toEqual([1, 2, 3]);
  });
});


describe('OrderedDict constructed with non-empty Dict containing keys "a" and "b" as the arg', function() {
  var dict;

  var constructorArgs = new OrderedDict({
    'a': true,
    'b': [1, 2, 3]
  });

  beforeEach(function() {
    dict = new OrderedDict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has 2 items', function() {
    var items = dict.items();
    expect(items.length).toBe(2);
    expect(items).toContain(['a', true]);
    expect(items).toContain(['b', [1, 2, 3]]);
  });

  it('Has 2 keys', function() {
    var keys = dict.keys();
    expect(keys.length).toBe(2);
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).not.toContain('basd');
  });

  it('Has 2 values', function() {
    var values = dict.values();
    expect(values.length).toBe(2);
    expect(values).toContain(true);
    expect(values).toContain([1, 2 ,3]);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true
  ];

  it('Contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws an error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      try {
        dict.get(key);
      } catch (e) {
        expect(e instanceof DictKeyNotFound).toBe(true);
        expect(e.keyWasSupplied).toBe(true);
        expect(e.key).toBe(key);
        return;
      }
      throw new Error('should not be reached');
    });
  });

  it('Returns defaultValue from get() with any non-present key and a defaultValue', function() {
    var defaultValue = {1: 2};
    possibleKeys.forEach(function(key) {
      expect(dict.get(key, defaultValue)).toBe(defaultValue);
    });
  });

  it('Returns existing value from get() with existing key and a defaultValue', function() {
    var defaultValue = {1: 2};
    expect(dict.get('a', defaultValue)).toBe(true);
    expect(dict.get('b', defaultValue)).toEqual([1, 2, 3]);
  });
});


describe('OrderedDict.length', function() {
  it('Should be 0 for a dict that has no keys set', function() {
    var dict = new OrderedDict();
    expect(dict.length()).toBe(0);
  });

  it('Should match the number of unique keys in a non-empty OrderedDict', function() {
    var dict = new OrderedDict({'a': 1});
    expect(dict.length()).toBe(1);

    var dict = new OrderedDict();
    dict.set('a', 1);
    expect(dict.length()).toBe(1);
    dict.set('a', 123);
    expect(dict.length()).toBe(1);
    dict.set(987, 123);
    expect(dict.length()).toBe(2);
    dict.clear();
    expect(dict.length()).toBe(0);

    var dict = new OrderedDict();
    dict.update([['a', 1]]);
    expect(dict.length()).toBe(1);
  });
});


describe('OrderedDict.setOneNewValue', function() {
  var dict;

  beforeEach(function() {
    dict = new OrderedDict();
  });

  it('Should throw an error if not given a function as its second arg.', function() {
    expect(dict.setOneNewValue.bind(dict)).toThrow();
    expect(dict.setOneNewValue.bind(dict, 123)).toThrow();
  });

  it('Should not affect any keys given an identity function', function() {
    var keyA = 'a';
    var keyB = 'B';
    var valueA = 1;
    var valueB = 2;
    dict.set(keyA, valueA);
    dict.set(keyB, valueB);

    var identity = function(v) {
      return v;
    };
    dict.setOneNewValue(keyA, identity);
    dict.setOneNewValue(keyB, identity);

    expect(dict.get(keyA)).toBe(valueA);
    expect(dict.get(keyB)).toBe(valueB);
  });

  it('Should always set a key to the value returned by a function that always returns the same value', function() {
    var keyA = 'a';
    var keyB = 'B';
    var valueA = 123;
    var valueB = 987;
    dict.set(keyA, valueA);
    dict.set(keyB, valueB);

    var getOne = function() { return 1; };
    dict.setOneNewValue(keyA, getOne);
    dict.setOneNewValue(keyB, getOne);

    expect(dict.get(keyA)).toBe(1);
    expect(dict.get(keyB)).toBe(1);
  });

  it('Should modify the value of a key based on a function that operates on the current value, key, and the dict itself', function() {
    var multiplier = 2;
    var yeaKey = 'yea!';
    var modifier = function(value, key, theDict) {
      expect(theDict).toBe(dict);
      expect(theDict.hasKey(key)).toBe(true);
      expect(theDict.get(key)).toBe(value);

      var result = {};
      result[yeaKey] = value * multiplier;
      return result;
    };

    var originalValueOfA = 1;
    var keyA = 'a';
    dict.set(keyA, originalValueOfA);
    dict.setOneNewValue(keyA, modifier);
    var newA = dict.get(keyA);
    expect(newA[yeaKey]).toBe(originalValueOfA * multiplier)
  });
});


describe('OrderedDict.values', function() {
  it('Should return the values corresponding to each unique key, regardless of uniqueness', function() {
    var dict = new OrderedDict({'a': 1, 'b': 1, 'c': 1});
    expect(dict.length()).toBe(3);
    expect(dict.values()).toEqual([1, 1, 1]);
  });

  it('Should return the values corresponding to the order in which their keys were inserted', function() {
    var firstKey = 'oadfj';
    var firstVal = {};

    var secondKey = 0;
    var secondVal = [];

    var thirdKey = null;
    var thirdVal = 123;

    var dict = new OrderedDict();
    dict.set(firstKey, firstVal);
    dict.set(secondKey, secondVal);
    dict.set(thirdKey, thirdVal);
    var expectedKeys = [firstKey, secondKey, thirdKey];
    var expectedVals = [firstVal, secondVal, thirdVal];

    expect(dict.keys()).toEqual(expectedKeys);
    expect(dict.values()).toEqual(expectedVals);

    // setting an old key doesn't matter
    var newValue = 'new value!';
    dict.set(firstKey, newValue);
    expectedVals[0] = newValue;
    expect(dict.keys()).toEqual(expectedKeys);
    expect(dict.values()).toEqual(expectedVals);

    // after adding a new key, order should be updated
    var lastKey = 'last';
    var lastVal = 'woohoo!';
    dict.set(lastKey, lastVal);
    expectedKeys.push(lastKey);
    expectedVals.push(lastVal);
    expect(dict.keys()).toEqual(expectedKeys);
    expect(dict.values()).toEqual(expectedVals);

    // after deleting a key, order should be updated
    dict.del(firstKey);
    expectedKeys.shift();
    expectedVals.shift();
    expect(dict.keys()).toEqual(expectedKeys);
    expect(dict.values()).toEqual(expectedVals);
  });
});


describe('OrderedDict.keys', function() {
  it('Should return the most recent set of unique keys', function() {
    var dict = new OrderedDict();
    var letterA = 'a';
    var secondValue = 2;
    dict.update([
      [letterA, 1],
      [letterA, secondValue]
    ]);
    expect(dict.keys()).toEqual([letterA]);
    expect(dict.hasKey(letterA)).toBe(true);
    expect(dict.get(letterA)).toBe(secondValue);
  });

  it('Should return keys of boolean, NaN, null, number, string, and undefined types.', function() {
    var keysOfAllTypes = [
      false, true,
      0, 1,
      '', 'a',
      NaN,
      null,
      undefined
    ];
    var dict = OrderedDict.fromKeys(keysOfAllTypes, 1);
    var keys = dict.keys();
    expect(keys.length).toBe(keysOfAllTypes.length);

    var keysNotCovered = keysOfAllTypes.slice();

    keysOfAllTypes.forEach(function(key, index) {
      if (!Number.isNaN(key)) {
        expect(key).toBe(keysOfAllTypes[index]);
        expect(keys.indexOf(key)).toBeGreaterThan(-1);

        keysNotCovered.splice(keysNotCovered.indexOf(key), 1);
      }
    });

    expect(keysNotCovered.length).toBe(1);
    expect(Number.isNaN(keysNotCovered[0])).toBe(true);
  });
});


describe('OrderedDict.getFirstKey', function() {
  it('Should throw a KeyNotFound error when called on an empty dict.', function() {
    var dict = new OrderedDict();
    try {
      dict.getFirstKey();
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      return;
    }
    throw Error('Should not be reached because a key should not be found.');
  });

  it('Should not throw a KeyNotFound error when called on a non-empty dict', function() {
    var firstKey = 'a';
    var dict = new OrderedDict([[firstKey, 123]]);
    expect(dict.getFirstKey()).toBe(firstKey);

    dict.set(firstKey, 91832);
    expect(dict.getFirstKey()).toBe(firstKey);

    dict.set('new key', 12);
    expect(dict.getFirstKey()).toBe(firstKey);
  });

  it('Should return the first key supplied to an OrderedDict from fromKeys', function() {
    var firstKey = 0;
    var keys = [firstKey, 1, false, true, '', 'a', undefined, null];
    var dict = OrderedDict.fromKeys(keys, 123);
    expect(dict.getFirstKey()).toBe(firstKey);

    dict.set(firstKey, 91832);
    expect(dict.getFirstKey()).toBe(firstKey);

    dict.set('new key', 12);
    expect(dict.getFirstKey()).toBe(firstKey);
  });

  it('Should return the first key in a keyValue Array supplied to an OrderedDict', function() {
    var firstKey = true;
    var keyValues = [
      [firstKey, 1],
      [false, true],
      ['', 'a'],
      [undefined, null]
    ];
    var dict = new OrderedDict(keyValues);
    expect(dict.getFirstKey()).toBe(firstKey);
  });
});


describe('OrderedDict.fromKeys', function() {
  it('Should set all supplied keys to the same value.', function() {
    var theValue = {1: 2, 3: {4: 5}};
    var keys = ['a', 'b', 'c'];
    var dict = OrderedDict.fromKeys(keys, theValue);
    expect(dict.keys()).toEqual(keys);
    dict.values().forEach(function(value) {
      expect(value).toBe(theValue);
    });
    dict.iteritems(function(key, value) {
      expect(keys).toContain(key);
      expect(value).toBe(theValue);
    });
  });
});


describe('OrderedDict.set', function() {
  var dict;

  beforeEach(function() {
    dict = new OrderedDict();
  });

  it('Should throw an error unless called with 2 args.', function() {
    expect(dict.set.bind(dict, 1)).toThrow();
    expect(dict.set.bind(dict, 1, 2)).not.toThrow();
  });

  it('Should set a string type key to a value and get it.', function() {
    var key = 'yea';
    var value = {1: 2};
    dict.set(key, value);
    expect(dict.get(key)).toBe(value);
  });

  it('Should set a number type key (but not its corresponding string key) to a value and get it.', function() {
    var numericKey = 1;
    var stringKey = String(numericKey);
    expect(stringKey).toBe('1');
    var numericValue = {1: 2};
    dict.set(numericKey, numericValue);
    expect(dict.get(numericKey)).toBe(numericValue);
    var threw = false;
    try {
      dict.get(stringKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.key).toBe(stringKey);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown during dict.get');

    var stringValue = {3: 4};
    dict.set(stringKey, stringValue);
    expect(dict.get(numericKey)).toBe(numericValue);
    expect(dict.get(stringKey)).toBe(stringValue);
  });

  it('Should set a boolean type key (but not its corresponding string key) to a value and get it.', function() {
    var boolValue = {1: 2};
    var boolKey = false;
    var stringKey = String(boolKey);
    expect(stringKey).toBe('false');
    dict.set(boolKey, boolValue);
    expect(dict.get(boolKey)).toBe(boolValue);
    var threw = false;
    try {
      dict.get(stringKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.key).toBe(stringKey);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown during dict.get');

    var stringValue = {3: 4};
    dict.set(stringKey, stringValue);
    expect(dict.get(boolKey)).toBe(boolValue);
    expect(dict.get(stringKey)).toBe(stringValue);
  });

  it('Should set null key (but not its corresponding string key) to a value and get it.', function() {
    var nullValue = {1: 2};
    var nullKey = null;
    var stringKey = String(nullKey);
    expect(stringKey).toBe('null');
    dict.set(nullKey, nullValue);
    expect(dict.get(nullKey)).toBe(nullValue);
    var threw = false;
    try {
      dict.get(stringKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.key).toBe(stringKey);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown during dict.get');

    var stringValue = {3: 4};
    dict.set(stringKey, stringValue);
    expect(dict.get(nullKey)).toBe(nullValue);
    expect(dict.get(stringKey)).toBe(stringValue);
  });

  it('Should set undefined key (but not its corresponding string key) to a value and get it.', function() {
    var undefinedValue = {1: 2};
    var undefinedKey = undefined;
    var stringKey = String(undefinedKey);
    expect(stringKey).toBe('undefined');
    dict.set(undefinedKey, undefinedValue);
    expect(dict.get(undefinedKey)).toBe(undefinedValue);
    var threw = false;
    try {
      dict.get(stringKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.key).toBe(stringKey);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown during dict.get');

    var stringValue = {3: 4};
    dict.set(stringKey, stringValue);
    expect(dict.get(undefinedKey)).toBe(undefinedValue);
    expect(dict.get(stringKey)).toBe(stringValue);
  });

  it('Should set NaN key (but not its corresponding string key) to a value and get it.', function() {
    var nanValue = {1: 2};
    var nanKey = NaN;
    var stringKey = String(nanKey);
    expect(stringKey).toBe('NaN');
    dict.set(nanKey, nanValue);
    expect(dict.get(nanKey)).toBe(nanValue);
    var threw = false;
    try {
      dict.get(stringKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.key).toBe(stringKey);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown during dict.get');

    var stringValue = {3: 4};
    dict.set(stringKey, stringValue);
    expect(dict.get(nanKey)).toBe(nanValue);
    expect(dict.get(stringKey)).toBe(stringValue);
  });

  it('Should not allow setting a key of type object, array, function, class instance, Dict, or Error.', function() {
    var MyClass = function () {};
    var fn = function(v) { return 123};
    var badKeys = [
      [1, 2],
      {3: 'asdf'},
      fn,
      Error(123),
      new MyClass(),
      new Dict()
    ];
    badKeys.forEach(function(key) {
      try {
        dict.set(key, 987);
      } catch (e) {
        expect(e instanceof DictKeyNotHashable).toBe(true);
        expect(e.key).toBe(key);
        return;
      }
      throw new Error('should not be reached');
    });
  });

  it('Should update an existing key value pair after re-setting a key.', function() {
    expect(dict.length()).toBe(0);

    var theKey = 'key';
    var oldValue = 1;
    dict.set(theKey, oldValue);
    var oldKeys = dict.keys();

    expect(dict.length()).toBe(1);
    expect(dict.get(theKey)).toBe(oldValue);

    var newValue = 8765;
    dict.set(theKey, newValue);
    var newKeys = dict.keys();

    expect(dict.length()).toBe(1);
    expect(dict.get(theKey)).not.toBe(oldValue);
    expect(dict.get(theKey)).toBe(newValue);

    expect(oldKeys).toEqual(newKeys);
  });
});


describe('OrderedDict.clear', function() {
  var dict;

  beforeEach(function() {
    dict = new OrderedDict();
  });

  it('should not affect keys, values, or items of an empty dict.', function() {
    var oldValues = dict.values();
    var oldKeys = dict.keys();
    var oldItems = dict.items();

    dict.clear();

    var newValues = dict.values();
    var newKeys = dict.keys();
    var newItems = dict.items();

    expect(newValues).toEqual(oldValues);
    expect(newKeys).toEqual(oldKeys);
    expect(newItems).toEqual(oldItems);
  });

  it('should remove all items from a dict but not references to those items.', function() {
    dict.set('key', 123);
    var oldValues = dict.values();
    var oldKeys = dict.keys();
    var oldItems = dict.items();

    expect(oldValues).toEqual([123]);
    expect(oldKeys).toEqual(['key']);
    expect(oldItems).toEqual([['key', 123]]);

    expect(dict.length()).toBe(1);

    dict.clear();

    expect(dict.length()).toBe(0);

    var newValues = dict.values();
    var newKeys = dict.keys();
    var newItems = dict.items();

    expect(newValues).toEqual([]);
    expect(newKeys).toEqual([]);
    expect(newItems).toEqual([]);

    expect(oldValues).toEqual([123]);
    expect(oldKeys).toEqual(['key']);
    expect(oldItems).toEqual([['key', 123]]);
  });
});


describe('OrderedDict.copy', function() {
  var original;

  beforeEach(function() {
    original = new OrderedDict();
  });

  it('should create an OrderedDict', function() {
    // TODO: make sure DefaultDict does the same, with fromkeys too.
    var copied = original.copy();
    expect(copied instanceof OrderedDict).toBe(true);
  });

  it('should create an exact copy of, but not a reference to, an empty dict.', function() {
    var copied = original.copy();

    expect(copied).not.toBe(original);

    expect(copied.values()).toEqual(original.values());
    expect(copied.keys()).toEqual(original.keys());
    expect(copied.items()).toEqual(original.items());

    // setting a key on either copy should not affect the other.
    var keyToSet = 'key';
    copied.set(keyToSet, 123);

    var threw = false;
    try {
      original.get(keyToSet);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(keyToSet);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown');
    expect(original.get(keyToSet, 'default')).toBe('default');

    var anotherKeyToSet = 'yea';
    original.set(anotherKeyToSet, 987);
    expect(copied.get(anotherKeyToSet, 'default')).toBe('default');

    try {
      copied.get(anotherKeyToSet);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(anotherKeyToSet);
      return;
    }
    throw new Error('should not be reached');
  });

  it('should create an exact copy of, but not a reference to, a non-empty dict.', function() {
    original.set('previouslySetKey', 'previouslySetValue');

    var copied = original.copy();

    expect(copied).not.toBe(original);

    expect(copied.values()).toEqual(original.values());
    expect(copied.keys()).toEqual(original.keys());
    expect(copied.items()).toEqual(original.items());

    // setting a key on either copy should not affect the other.
    var keyToSet = 'key';
    copied.set(keyToSet, 123);
    var threw = false;
    try {
      original.get(keyToSet);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(keyToSet);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown');
    expect(original.get(keyToSet, 'default')).toBe('default');
    expect(original.get(keyToSet, 'default')).toBe('default');

    var anotherKeyToSet = 'yea';
    original.set(anotherKeyToSet, 987);
    var threw = false;
    try {
      copied.get(anotherKeyToSet);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(anotherKeyToSet);
      threw = true;
    }
    if (!threw) throw new Error('should have thrown');
    expect(original.get(keyToSet, 'default')).toBe('default');
    expect(copied.get(anotherKeyToSet, 'default')).toBe('default');
  });
});


describe('OrderedDict.del', function() {
  var dict;
  var existingKey = 'key';

  beforeEach(function() {
    dict = new OrderedDict();
    dict.set(existingKey, 123);
  });

  it('Should remove an existing key successfully', function() {
    var getExistingKey = dict.get.bind(dict, existingKey);
    expect(dict.length()).toBe(1);
    expect(getExistingKey).not.toThrow();

    dict.del(existingKey);

    expect(dict.length()).toBe(0);
    try {
      getExistingKey();
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(existingKey);
      return;
    }
    throw new Error('should not be reached');
  });

  it('Should raise an error removing a non-existing key', function() {
    var nonExistingKey = 'non existing key';
    try {
      dict.del(nonExistingKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(nonExistingKey);
      return;
    }
    throw new Error('should not be reached');
  });
});


describe('OrderedDict.pop', function() {
  var dict;
  var existingKey = 'key';
  var existingValue = {'a': 123};

  beforeEach(function() {
    dict = new OrderedDict();
    dict.set(existingKey, existingValue);
  });

  it('Should remove and return an existing key successfully', function() {
    var getExistingKey = dict.get.bind(dict, existingKey);
    expect(dict.length()).toBe(1);
    expect(getExistingKey).not.toThrow();

    var popped = dict.pop(existingKey);
    expect(popped).toBe(existingValue);

    expect(dict.length()).toBe(0);
    try {
      getExistingKey();
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(existingKey);
      return;
    }
    throw new Error('should not be reached');
  });

  it('Should raise an error removing a non-existing key', function() {
    var nonExistingKey = 'nope';
    try {
      dict.pop(nonExistingKey);
    } catch (e) {
      expect(e instanceof DictKeyNotFound).toBe(true);
      expect(e.keyWasSupplied).toBe(true);
      expect(e.key).toBe(nonExistingKey);
    }
  });

  it('Should not raise an error removing a non-existing key with an optional default value specified', function() {
    expect(function() {
      dict.pop('non existing key', 'defaultValue');
    }).not.toThrow();
  });
});


describe('OrderedDict.popitem', function() {
  var dict;

  beforeEach(function() {
    dict = new OrderedDict();
  });

  it('Should raise an error when executed on an empty dict.', function() {
    expect(dict.popitem.bind(dict)).toThrow();
  });

  it('Should return and delete the sole key-value pair from a dict with 1 key.', function() {
    var key = 'key';
    var value = 123;
    dict.set(key, value);
    var item = dict.items()[0];

    var popped = dict.popitem();
    expect(popped).toEqual(item);
    expect(dict.isEmpty()).toBe(true);
    expect(dict.length()).toBe(0);
  });
});


describe('OrderedDict.hasKey', function() {
  var dict;

  beforeEach(function() {
    dict = new OrderedDict();
  });

  it('Should return false for empty dict on all keys', function() {
    expect(dict.length()).toBe(0);
    expect(dict.isEmpty()).toBe(true);
    ['', 'a', 0, 1, true, false].forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
  });

  it('Should return true for an existing string key.', function() {
    var key = 'string';
    dict.set(key, 123);
    expect(dict.hasKey(key)).toBe(true);
    expect(dict.hasKey('not existing')).toBe(false);

    dict.del(key);
    expect(dict.hasKey(key)).toBe(false);
  });

  it('Should return true for an existing numeric key and not its string counterpart', function() {
    var key = 100;
    dict.set(key, 123);
    expect(dict.hasKey(key)).toBe(true);
    expect(dict.hasKey(String(key))).toBe(false);

    expect(dict.hasKey(9999999)).toBe(false);
    expect(dict.hasKey('9999999')).toBe(false);

    dict.del(key);
    expect(dict.hasKey(key)).toBe(false);
  });

  it('Should return true for an existing boolean key and not its string counterpart', function() {
    var key = true;
    dict.set(key, 123);
    expect(dict.hasKey(key)).toBe(true);
    expect(dict.hasKey(String(key))).toBe(false);

    expect(dict.hasKey(false)).toBe(false);
    expect(dict.hasKey('false')).toBe(false);

    dict.del(key);
    expect(dict.hasKey(key)).toBe(false);
  });

  it('Should return true for an existing null key and not its string counterpart', function() {
    var key = null;
    dict.set(key, 123);
    expect(dict.hasKey(key)).toBe(true);
    expect(dict.hasKey(String(key))).toBe(false);

    dict.del(key);
    expect(dict.hasKey(key)).toBe(false);
  });

  it('Should return true for an existing undefined key and not its string counterpart', function() {
    var key = undefined;
    dict.set(key, 123);
    expect(dict.hasKey(key)).toBe(true);
    expect(dict.hasKey(String(key))).toBe(false);

    dict.del(key);
    expect(dict.hasKey(key)).toBe(false);
  });
});
