// Tests for class Counter.
'use strict';


if (typeof require !== 'undefined') var pycollections = require('../pycollections');
var Counter = pycollections.Counter;
var Dict = pycollections.Dict;
var DefaultDict = pycollections.DefaultDict;
var DictKeyNotHashable = pycollections.DictKeyNotHashable;


describe('Counter constructor', function() {
  it('Is a subclass of Dict and DefaultDict.', function() {
    expect(new Counter() instanceof Dict).toBe(true);
    expect(new Counter() instanceof DefaultDict).toBe(true);
  });

  it('Should form an empty Counter when given no args.', function() {
    var counter = new Counter();
    expect(counter.isEmpty()).toBe(true);
    expect(counter.length()).toBe(0);
  });

  it('Should set its key-value pairs as a normal Dict given a Dict/DefaultDict/Counter/Object', function() {
    var obj = {'a': 'b', 'c': 123};
    var dict = new Dict(obj);
    var defaultDict = new DefaultDict(String, dict);

    [obj, dict, defaultDict].forEach(function(arg) {
      var counter = new Counter(arg);
      expect(counter.get('a')).toBe('b');
      expect(counter.get('c')).toBe(123);
    });
  });

  it('Should set its key-value pairs to the counts of distinct array elements, given an Array', function() {
    var elements = ['a', 'a', 'b'];
    var counter = new Counter(elements);
    expect(counter.get('a')).toBe(2);
    expect(counter.get('b')).toBe(1);
    expect(counter.get(384)).toBe(0);
  });
});


describe('Counter.getIncrementor', function() {
  it('Should return a function', function() {
    var incrementor = Counter.getIncrementor(1);
    expect(typeof(incrementor)).toBe('function');
  });

  it('Should return a function that, when called, increments a given value.', function() {
    var incrementor = Counter.getIncrementor(1);
    var result = incrementor(2);
    expect(result).toBe(3);
  });
});


describe('Counter.fromKeys', function() {
  it('Should throw an error', function() {
    var counter = new Counter();
    expect(function() {
      counter.fromKeys([1, 2, 3], 123);
    }).toThrow();
  });
});


describe('Counter.get', function() {
  it('Should return 0 from a non-existing key', function() {
    var counter = new Counter();
    [0, 1, '', 'a', false, true, undefined, null].forEach(function(key) {
      expect(counter.get(key)).toBe(0);
    });
  });
});


describe('Counter.update', function() {
  it('Should throw an error when given no args.', function() {
    var counter = new Counter();
    expect(counter.update.bind(counter)).toThrow();
  });

  it('Should increment its key-value pairs by the key-values given from a Dict/DefaultDict/Counter/Object', function() {
    var numberEight = 8;
    var keyEight = 'eight';
    var numberNine = 9;
    var keyNine = 'nine';

    var obj = {};
    obj[keyEight] = numberEight;
    obj[keyNine] = numberNine;
    var dict = new Dict(obj);
    var defaultDict = new DefaultDict(Number, dict);

    [obj, dict, defaultDict].forEach(function(arg) {
      var counter = new Counter();
      counter.update(arg);
      expect(counter.get(keyEight)).toBe(numberEight);
      expect(counter.get(keyNine)).toBe(numberNine);

      // This counter is instantiated with the {eight: 8, nine: 9},
      // so updating it with those some args doubles their counts.
      var counter2 = new Counter(arg);
      counter2.update(arg);
      expect(counter2.get(keyEight)).toBe(2*numberEight);
      expect(counter2.get(keyNine)).toBe(2*numberNine);
    });
  });

  it('Should increment its counts based on the elements a given array with 100% hashable elements.', function() {
    var elements = ['a', 'a', 'b'];
    var counter = new Counter();

    counter.update(elements);
    expect(counter.get('a')).toBe(2);
    expect(counter.get('b')).toBe(1);
    expect(counter.get(384)).toBe(0);

    counter.update(elements);
    expect(counter.get('a')).toBe(4);
    expect(counter.get('b')).toBe(2);
    expect(counter.get(384)).toBe(0);
  });

  it('Should fail given array with <100% hashable elements.', function() {
    var unhashable = {'not': 'hashable'};
    var elements = ['a', 'a', 'b', unhashable];
    var counter = new Counter();
    expect(counter.update.bind(counter, elements)).toThrow(new DictKeyNotHashable(unhashable));
  });
});


describe('Counter.elements', function() {
  it('Should return an empty array for an empty Counter.', function() {
    var counter = new Counter();
    expect(counter.elements()).toEqual([]);
  });

  it('Should return an array containing <value> amount of each key', function() {
    var counter = new Counter({'a': 0});
    expect(counter.elements()).toEqual([]);

    counter.update(['a']);
    expect(counter.elements()).toEqual(['a']);

    counter.update(['a']);
    expect(counter.elements()).toEqual(['a', 'a']);

    counter.clear();
    expect(counter.elements()).toEqual([]);

    // Special behavior: when a key's value (count) is negative,
    // it doesn't output any elements for that key.
    var counter = new Counter({'a': -2});
    expect(counter.elements()).toEqual([]);
  });
});


describe('Counter.subtract', function() {
  it('Should fail given a non-Dict/Object/Array arg', function() {
    var counter = new Counter();
    expect(counter.subtract.bind(counter)).toThrow();
    [0, 1, false, true, '', 'a'].forEach(function(badArg) {
      expect(counter.subtract.bind(counter, badArg)).toThrow();
    });
  });

  it('Should do nothing given an empty Dict/Object/Array', function() {
    var emptyContainers = [{}, new Dict(), new DefaultDict(String), new Counter()];
    emptyContainers.forEach(function(emptyContainer) {
      var counter = new Counter({'a': 1});
      expect(counter.elements()).toEqual(['a']);

      counter.subtract(emptyContainer);
      expect(counter.elements()).toEqual(['a']);
    });
  });

  it('Should decrement values given a non-empty Dict', function() {
    var counter = new Counter({'a': 1});
    expect(counter.elements()).toEqual(['a']);

    counter.subtract(new Dict({'a': 2}));
    expect(counter.get('a')).toBe(-1);
    expect(counter.elements()).toEqual([]);
  });

  it('Should decrement values given a non-empty Object', function() {
    var counter = new Counter({'a': 1});
    expect(counter.elements()).toEqual(['a']);

    counter.subtract({'a': 2});
    expect(counter.get('a')).toBe(-1);
    expect(counter.elements()).toEqual([]);
  });

  it('Should decrement values given a non-empty Array', function() {
    var counter = new Counter({'a': 1});
    expect(counter.elements()).toEqual(['a']);

    counter.subtract(['a', 'a']);
    expect(counter.get('a')).toBe(-1);
    expect(counter.elements()).toEqual([]);
  });
});


describe('Counter.mostCommon', function() {
  it('Given no arg, should return all key-value pairs, with the most common ordered first.', function() {
    var counter = new Counter('aacabb'.split(''));
    expect(counter.get('a')).toBe(3);
    expect(counter.get('b')).toBe(2);
    expect(counter.get('c')).toBe(1);

    var result = counter.mostCommon();
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(['a', 3]);
    expect(result[1]).toEqual(['b', 2]);
    expect(result[2]).toEqual(['c', 1]);
  });

  it('Given an opt_n, should return opt_n key-value pairs, with the most common ordered first.', function() {
    var counter = new Counter('aacabb'.split(''));
    expect(counter.get('a')).toBe(3);
    expect(counter.get('b')).toBe(2);
    expect(counter.get('c')).toBe(1);

    var result0 = counter.mostCommon(0);
    expect(result0.length).toBe(0);
    expect(result0).toEqual([]);

    var result1 = counter.mostCommon(1);
    expect(result1.length).toBe(1);
    expect(result1[0]).toEqual(['a', 3]);

    var result2 = counter.mostCommon(2);
    expect(result2.length).toBe(2);
    expect(result2[0]).toEqual(['a', 3]);
    expect(result2[1]).toEqual(['b', 2]);

    var result3 = counter.mostCommon(3);
    expect(result3.length).toBe(3);
    expect(result3[0]).toEqual(['a', 3]);
    expect(result3[1]).toEqual(['b', 2]);
    expect(result3[2]).toEqual(['c', 1]);

    var result4 = counter.mostCommon(4);
    expect(result4.length).toBe(3);
    expect(result4[0]).toEqual(['a', 3]);
    expect(result4[1]).toEqual(['b', 2]);
    expect(result4[2]).toEqual(['c', 1]);
  });
});


describe('Counter.leastCommon', function() {
  it('Given no arg, should return all key-value pairs, with the least common ordered first.', function() {
    var counter = new Counter('aacabb'.split(''));
    expect(counter.get('a')).toBe(3);
    expect(counter.get('b')).toBe(2);
    expect(counter.get('c')).toBe(1);

    var result = counter.leastCommon();
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(['c', 1]);
    expect(result[1]).toEqual(['b', 2]);
    expect(result[2]).toEqual(['a', 3]);
  });

  it('Given an opt_n, should return opt_n key-value pairs, with the least common ordered first.', function() {
    var counter = new Counter('aacabb'.split(''));
    expect(counter.get('a')).toBe(3);
    expect(counter.get('b')).toBe(2);
    expect(counter.get('c')).toBe(1);

    var result0 = counter.leastCommon(0);
    expect(result0.length).toBe(0);
    expect(result0).toEqual([]);

    var result1 = counter.leastCommon(1);
    expect(result1.length).toBe(1);
    expect(result1[0]).toEqual(['c', 1]);

    var result2 = counter.leastCommon(2);
    expect(result2.length).toBe(2);
    expect(result2[0]).toEqual(['c', 1]);
    expect(result2[1]).toEqual(['b', 2]);

    var result3 = counter.leastCommon(3);
    expect(result3.length).toBe(3);
    expect(result3[0]).toEqual(['c', 1]);
    expect(result3[1]).toEqual(['b', 2]);
    expect(result3[2]).toEqual(['a', 3]);

    var result4 = counter.leastCommon(4);
    expect(result4.length).toBe(3);
    expect(result4[0]).toEqual(['c', 1]);
    expect(result4[1]).toEqual(['b', 2]);
    expect(result4[2]).toEqual(['a', 3]);
  });
});
