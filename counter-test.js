// Tests for counter.js.

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
    var elements = ['a', 'a', 'b', {'not': 'hashable'}];
    var counter = new Counter();
    expect(counter.update.bind(counter, elements)).toThrow();
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
