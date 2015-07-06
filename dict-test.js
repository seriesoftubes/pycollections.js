
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
      false, true,
      {}, {1: 'A'}
  ];

  it('Does not contain anything', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.contains(key)).toBe(false);
    });
  });

  it('Returns undefined from get() with any key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get(key)).toBe(undefined);
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
      false, true,
      {}, {1: 'A'}
  ];

  it('Does not contain anything', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.contains(key)).toBe(false);
    });
  });

  it('Returns undefined from get() with any key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get(key)).toBe(undefined);
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
      {}, {1: 'A'}
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.contains(key)).toBe(false);
    });
    expect(dict.contains('a')).toBe(true);
    expect(dict.contains('b')).toBe(true);
  });

  it('Returns undefined from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get(key)).toBe(undefined);
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
      false, true,
      {}, {1: 'A'}
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.contains(key)).toBe(false);
    });
    expect(dict.contains('a')).toBe(true);
    expect(dict.contains('b')).toBe(true);
  });

  it('Returns undefined from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get(key)).toBe(undefined);
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
      false, true,
      {}, {1: 'A'}
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.contains(key)).toBe(false);
    });
    expect(dict.contains('a')).toBe(true);
    expect(dict.contains('b')).toBe(true);
  });

  it('Returns undefined from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get(key)).toBe(undefined);
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
      false, true,
      {}, {1: 'A'}
  ];

  it('contains only a and b', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.contains(key)).toBe(false);
    });
    expect(dict.contains('a')).toBe(true);
    expect(dict.contains('b')).toBe(true);
  });

  it('Returns undefined from get() with non-present key and no defaultValue', function() {
    possibleKeys.forEach(function(key) {
      expect(dict.get(key)).toBe(undefined);
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
