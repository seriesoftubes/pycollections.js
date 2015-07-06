
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
