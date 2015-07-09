
describe('Dict after initialization with no args', function() {
  var dict;

  beforeEach(function() {
    dict = new Dict();
  });

  it('Has length of 0', function() {
    expect(dict.length()).toBe(0);
  });

  it('Has no items', function() {
    expect(dict.items()).toEqual([]);
  });

  it('Has no keys', function() {
    expect(dict.keys()).toEqual([]);
  });

  it('Has no values', function() {
    expect(dict.values()).toEqual([]);
  });

  var possibleKeys = [
      0, 1,
      '', 'a',
      false, true
  ];

  it('Does not contain anything', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
  });

  it('Throws an error from get() with any key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get.bind(dict, key)).toThrow();
    });
  });

  it('Returns defaultValue from get() with any key and a defaultValue', function() {
    var defaultValue = {1: 2};
    possibleKeys.forEach(function(key) {
      expect(dict.get(key, defaultValue)).toBe(defaultValue);
    });
  });
});


describe('Dict after initialization with empty array as the arg', function() {
  var dict;

  beforeEach(function() {
    dict = new Dict([]);
  });

  it('Has length of 0', function() {
    expect(dict.length()).toBe(0);
  });

  it('Has no items', function() {
    expect(dict.items()).toEqual([]);
  });

  it('Has no keys', function() {
    expect(dict.keys()).toEqual([]);
  });

  it('Has no values', function() {
    expect(dict.values()).toEqual([]);
  });

  var possibleKeys = [
      0, 1,
      '', 'a',
      false, true
  ];

  it('Does not contain anything', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
  });

  it('Throws an error from get() with any key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get.bind(dict, key)).toThrow();
    });
  });

  it('Returns defaultValue from get() with any key and a defaultValue', function() {
    var defaultValue = {1: 2};
    possibleKeys.forEach(function(key) {
      expect(dict.get(key, defaultValue)).toBe(defaultValue);
    });
  });
});


describe('Dict after initialization with non-empty array as the arg', function() {
  var dict;

  var constructorArgs = [
    ['a', 1],
    ['b', 99]
  ];

  beforeEach(function() {
    dict = new Dict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has some items', function() {
    var items = dict.items();
    constructorArgs.forEach(function(keyValue) {
      expect(items).toContain(keyValue);
    });
  });

  it('Has some keys', function() {
    var keys = dict.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
  });

  it('Has some values', function() {
    var values = dict.values();
    expect(values).toContain(1);
    expect(values).toContain(99);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true,
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get.bind(dict, key)).toThrow();
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

describe('Dict after initialization with non-empty non-unique array as the arg', function() {
  var dict;

  var constructorArgs = [
    ['a', 1],
    ['b', 99],
    ['b', 100]
  ];

  beforeEach(function() {
    dict = new Dict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has some items', function() {
    var items = dict.items();
    expect(items).toContain(['a', 1]);
    expect(items).toContain(['b', 100]);
  });

  it('Has some keys', function() {
    var keys = dict.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).not.toContain('basd');
  });

  it('Has some values', function() {
    var values = dict.values();
    expect(values).toContain(1);
    expect(values).toContain(100);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get.bind(dict, key)).toThrow();
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


describe('Dict after initialization with empty object as the arg', function() {
  var dict;

  beforeEach(function() {
    dict = new Dict({});
  });

  it('Has length of 0', function() {
    expect(dict.length()).toBe(0);
  });

  it('Has no items', function() {
    expect(dict.items()).toEqual([]);
  });

  it('Has no keys', function() {
    expect(dict.keys()).toEqual([]);
  });

  it('Has no values', function() {
    expect(dict.values()).toEqual([]);
  });
});


describe('Dict after initialization with non-empty object as the arg', function() {
  var dict;

  var constructorArgs = {
    'a': true,
    'b': [1, 2, 3]
  };

  beforeEach(function() {
    dict = new Dict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has some items', function() {
    var items = dict.items();
    expect(items).toContain(['a', true]);
    expect(items).toContain(['b', [1, 2, 3]]);
  });

  it('Has some keys', function() {
    var keys = dict.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).not.toContain('basd');
  });

  it('Has some values', function() {
    var values = dict.values();
    expect(values).toContain(true);
    expect(values).toContain([1, 2 ,3]);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws an error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get.bind(dict, key)).toThrow();
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


describe('Dict after initialization with empty Dict as the arg', function() {
  var dict;

  beforeEach(function() {
    dict = new Dict(new Dict({}));
  });

  it('Has length of 0', function() {
    expect(dict.length()).toBe(0);
  });

  it('Has no items', function() {
    expect(dict.items()).toEqual([]);
  });

  it('Has no keys', function() {
    expect(dict.keys()).toEqual([]);
  });

  it('Has no values', function() {
    expect(dict.values()).toEqual([]);
  });
});


describe('Dict after initialization with non-empty Dict as the arg', function() {
  var dict;

  var constructorArgs = new Dict({
    'a': true,
    'b': [1, 2, 3]
  });

  beforeEach(function() {
    dict = new Dict(constructorArgs);
  });

  it('Has length of 2', function() {
    expect(dict.length()).toBe(2);
  });

  it('Has some items', function() {
    var items = dict.items();
    expect(items).toContain(['a', true]);
    expect(items).toContain(['b', [1, 2, 3]]);
  });

  it('Has some keys', function() {
    var keys = dict.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).not.toContain('basd');
  });

  it('Has some values', function() {
    var values = dict.values();
    expect(values).toContain(true);
    expect(values).toContain([1, 2 ,3]);
  });

  // these don't contain 'a' or 'b'
  var possibleKeys = [
      0, 1,
      '', 'z',
      false, true
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.hasKey(key)).toBe(false);
    });
    expect(dict.hasKey('a')).toBe(true);
    expect(dict.hasKey('b')).toBe(true);
  });

  it('Throws an error from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get.bind(dict, key)).toThrow();
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


describe('From keys initialization', function() {
  it('Should set all supplied keys to the same value.', function() {
    var theValue = {1: 2, 3: {4: 5}};
    var keys = ['a', 'b', 'c'];
    var dict = Dict.fromKeys(keys, theValue);
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


describe('Setting a value', function() {
  var dict;

  beforeEach(function() {
    dict = new Dict();
  });

  it('Should set a string type key to a value and get it.', function() {
    var key = 'yea';
    var value = {1: 2};
    dict.set(key, value);
    expect(dict.dict_[key]).toBe(value);
    expect(dict.get(key)).toBe(value);
  });

  it('Should set a number type key and its corresponding string key to the same value and get it.', function() {
    var numericKeyValue = {1: 2};
    dict.set(1, numericKeyValue);
    expect(dict.dict_[1]).toBe(numericKeyValue);
    expect(dict.get(1)).toBe(numericKeyValue);
    expect(dict.dict_['1']).toBe(numericKeyValue);
    expect(dict.get('1')).toBe(numericKeyValue);

    var stringKeyValue = {3: 4};
    dict.set('1', stringKeyValue);
    expect(dict.dict_[1]).toBe(stringKeyValue);
    expect(dict.get(1)).toBe(stringKeyValue);
    expect(dict.dict_['1']).toBe(stringKeyValue);
    expect(dict.get('1')).toBe(stringKeyValue);
  });

  it('Should not allow setting a key of type object or array.', function() {
    var badKeys = [
      [1, 2],
      {3: 'asdf'}
    ];
    badKeys.forEach(function(key) {
      expect(dict.set.bind(dict, key)).toThrow();
    });
  });
});

describe('Dict.clear', function() {
  var dict;

  beforeEach(function() {
    dict = new Dict();
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

describe('Dict.copy', function() {
  var original;

  beforeEach(function() {
    original = new Dict();
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
    expect(original.get.bind(original, keyToSet)).toThrow();
    expect(original.get(keyToSet, 'default')).toBe('default');

    var anotherKeyToSet = 'yea';
    original.set(anotherKeyToSet, 987);
    expect(copied.get.bind(copied, anotherKeyToSet)).toThrow();
    expect(copied.get(anotherKeyToSet, 'default')).toBe('default');
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
    expect(original.get.bind(original, keyToSet)).toThrow();
    expect(original.get(keyToSet, 'default')).toBe('default');

    var anotherKeyToSet = 'yea';
    original.set(anotherKeyToSet, 987);
    expect(copied.get.bind(copied, anotherKeyToSet)).toThrow();
    expect(copied.get(anotherKeyToSet, 'default')).toBe('default');

  });
});


describe('Dict.del', function() {
  var dict;
  var existingKey = 'key';

  beforeEach(function() {
    dict = new Dict();
    dict.set(existingKey, 123);
  });

  it('Should remove an existing key successfully', function() {
    var getExistingKey = dict.get.bind(dict, existingKey);
    expect(dict.length()).toBe(1);
    expect(getExistingKey).not.toThrow();

    dict.del(existingKey);

    expect(dict.length()).toBe(0);
    expect(getExistingKey).toThrow();
  });

  it('Should raise an error removing a non-existing key', function() {
    expect(dict.del.bind(dict, 'non existing key')).toThrow();
  });

});

describe('Dict.pop', function() {

});

describe('Dict.popitem', function() {

});
