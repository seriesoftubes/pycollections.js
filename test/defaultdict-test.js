// Tests for class DefaultDict.
'use strict';


var DefaultDict = pycollections.DefaultDict;


describe('Initialized empty defaultdict', function() {

  it('Must have a default function', function() {
    expect(function() { new DefaultDict(); }).toThrow();
    expect(function() { new DefaultDict(1); }).toThrow();
    expect(function() { new DefaultDict(Number); }).not.toThrow();
  });

  it('Is a subclass of Dict.', function() {
    expect(new DefaultDict(Number) instanceof Dict).toBe(true);
  });

  it('Returns its default value when a key is missing', function() {
    var defaultFn = String;
    var defaultFnValue = defaultFn();
    var dd = new DefaultDict(defaultFn);

    var missingKeys = [1, 2, 3];
    missingKeys.forEach(function(key) {
      expect(dd.hasKey(key)).toBe(false);
      expect(dd.get(key)).toBe(defaultFnValue);
    });
    expect(dd.length()).toBe(missingKeys.length);
  });

  it('Returns custom supplied default value when a key is missing and get is called with a second arg', function() {
    var dd = new DefaultDict(String);
    var missingKeys = [1, 2, 3];
    var forcedDefault = {'this': 'isRight'};
    missingKeys.forEach(function(key) {
      expect(dd.hasKey(key)).toBe(false);
      expect(dd.get(key, forcedDefault)).toBe(forcedDefault);
    });
    expect(dd.length()).toBe(0);
  });

  it('Should support setting a key to a value that differs from the type of the defaultFunction', function() {
    var dd = new DefaultDict(String);
    var key = 12.32;
    var value = {'yep': 82.1};
    dd.set(key, value);
    expect(dd.get(key)).toBe(value);
  });

  it('Should support counting values via a Number default function', function() {
    var letters = 'abccc'.split('');
    var dd = new DefaultDict(Number);
    dd.setSomeNewValues(letters, function(v) {
      return v + 1;
    });
    expect(dd.get('a')).toBe(1);
    expect(dd.get('b')).toBe(1);
    expect(dd.get('c')).toBe(3);
  });

  it('Should support building default arrays', function() {
    var keyToValues = new DefaultDict(function(){return []});
    expect(keyToValues.length()).toBe(0);

    var bobKey = 'Bob';
    var messageForBob = 'is awesome';
    keyToValues.get(bobKey).push(messageForBob);
    expect(keyToValues.length()).toBe(1);

    expect(keyToValues.get(bobKey)).toEqual([messageForBob]);

    var nancyKey = 'Nancy';
    var niceMessage = 'you are nice';
    keyToValues.get(nancyKey).push(niceMessage);
    expect(keyToValues.length()).toBe(2);

    // different keys should lead to different Arrays.
    expect(keyToValues.get(nancyKey)).not.toBe(keyToValues.get(bobKey));
    expect(keyToValues.get(nancyKey)).toEqual([niceMessage]);
    expect(keyToValues.get(bobKey)).toEqual([messageForBob]);

    var fakeKey = 'fake!';
    expect(keyToValues.hasKey(fakeKey)).toEqual(false);
    expect(keyToValues.get(fakeKey)).toEqual([]);
    expect(keyToValues.hasKey(fakeKey)).toEqual(true);
    expect(keyToValues.length()).toBe(3);
  });

  it('Should enable a dict of dicts', function() {
    var dictOfDicts = new DefaultDict(function(){return new Dict()});
    var key = 'key';
    var key2 = 'woohoo!';
    var yea = 'yea!';
    expect(dictOfDicts.get(key)).toEqual(new Dict());
    dictOfDicts.get(key).set(key2, yea);
    expect(dictOfDicts.get(key).get(key2)).toBe(yea);
  });

  it('Should support self-referencing nested DefaultDicts', function() {
    var selfReferencing = new DefaultDict(function() {
      return selfReferencing;
    });

    var key1 = 1;
    var key2 = 2;
    var key3 = 'yea';
    var nice = 'nice';
    var nestedDict1 = selfReferencing.get(key1);
    expect(nestedDict1).toBe(selfReferencing);

    var nestedDict2 = nestedDict1.get(key2);
    expect(nestedDict2).toBe(selfReferencing);
    
    nestedDict2.set(key3, nice);

    expect(selfReferencing.get(key1).get(key2).get(key3)).toBe(nice);

    var nestedDict1 = selfReferencing.get(key1);
    expect(nestedDict1).toBe(selfReferencing);

    var nestedDict2 = nestedDict1.get(key2);
    expect(nestedDict2).toBe(selfReferencing);
    expect(nestedDict2.get(key3)).toBe(nice);
  });
});
