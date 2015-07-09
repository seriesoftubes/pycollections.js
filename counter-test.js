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

    var obj = {}
    obj[keyEight] = numberEight
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
});
