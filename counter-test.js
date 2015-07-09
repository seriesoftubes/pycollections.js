
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
