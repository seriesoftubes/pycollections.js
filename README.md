# pycollections.js
## collections.py for JavaScript

pycollections.js contains class definitions for Dict, DefaultDict, Counter, OrderedDict, and NamedTuple, stocked with functionality that (mostly) mirrors their collections.py counterparts and exceeds that of the ES6 Map class.

It has been tested on NodeJS v0.12.7, and the latest Chrome, Firefox, and Safari browsers.

----
# Contents
- [Getting it](#getting-it)
  - [NPM](#npm)
  - [Bower](#bower)
  - [cdnjs](#cdnjs)
- [Dict](#dict)
  - [Creating a new Dict](#creating-a-new-dict)
  - [Detecting presence of a key](#detecting-presence-of-a-key)
  - [Getting a potentially-missing key's value](#getting-a-potentially-missing-keys-value)
  - [Distinguishing between keys of different types](#distinguishing-between-keys-of-different-types)
  - [Deleting a key](#deleting-a-key)
  - [Popping a key](#popping-a-key)
  - [Clearing out all key-value pairs](#clearing-out-all-key-value-pairs)
  - [Forming a copy](#forming-a-copy)
  - [Updating key-value pairs](#updating-key-value-pairs)
  - [Iterating over keys, values, and items](#iterating-over-keys-values-and-items)
  - [Using non-Python methods](#using-non-python-methods)
- [DefaultDict](#defaultdict)
  - [Creating a new DefaultDict](#creating-a-new-defaultdict)
  - [Getting a potentially-missing key's value](#getting-a-potentially-missing-keys-value-1)
  - [Operating on potentially-missing keys' values](#operating-on-potentially-missing-keys-values)
  - [DefaultDict of Dicts](#defaultdict-of-dicts)
  - [Fun with self-referencing](#fun-with-self-referencing)
- [Counter](#counter)
  - [Creating a new Counter](#creating-a-new-counter)
  - [Counting distinct elements](#counting-distinct-elements)
  - [Increasing/decreasing counts](#increasingdecreasing-counts)
  - [Getting the most common elements](#getting-the-most-common-elements)
- [OrderedDict](#ordereddict)
  - [Creating a new OrderedDict](#creating-a-new-ordereddict)
  - [Maintaining the order of keys and values](#maintaining-the-order-of-keys-and-values)
- [NamedTuple](#namedtuple)
  - [Defining a new namedtuple class](#defining-a-namedtuple-class)
  - [Creating instances of the new class](#creating-instances-of-the-new-class)
  - [Accessing an instance's properties directly](#accessing-an-instances-properties-directly)
  - [Accessing an instance's properties via Array functions](#accessing-an-instances-properties-via-array-functions)


----

# Getting it
## NPM
```
npm install pycollections
```
## Bower
```
bower install pycollections
```
## cdnjs
Coming soon!

----
----

# Dict

### Static methods:
- fromKeys(keys, opt_valueForAllKeys)

### Instance methods:
- clear()
- copy()
- set(key, value)
- update(iterable)
- hasKey(key)
- get(key, opt_defaultValue)
- del(key)
- pop(key, opt_defaultValue)
- iterkeys(cb)
- keys()
- popitem()
- length()
- iteritems(cb)
- items()
- itervalues(cb)
- values()

### Instance methods (not present in Python dict):
- getFirstKey()
- getFirstMatchingKey(predicate)
- isEmpty()
- setOneNewValue(key, fn)
- setSomeNewValues(keys, fn)
- setAllNewValues(fn)


## Demo

### Creating a new Dict
```py
py = {}
py = dict.fromkeys([1, 2, 3], {'the': 'value'})
py = dict(a=1, b=2)
py = dict([('a', 1), ('b', 2)])
py = dict(dict(a=1))
py = dict(123)  # raises TypeError
```
```js
var js = new Dict();
var js = Dict.fromKeys([1, 2, 3], {'the': 'value'});
var js = new Dict({'a': 1, 'b': 2});
var js = new Dict([['a', 1], ['b', 2]]);
var js = new Dict(new Dict({'a': 1}));
var js = new Dict(123);  // throws Error
```
-----
### Detecting presence of a key
```py
py = {}
987 in py  # False
[] in py  # raises TypeError due to unhashable key
```
```js
var js = new Dict();
js.hasKey(987);  // false
js.hasKey([]);  // throws DictKeyNotHashable
```
----
### Getting a potentially-missing key's value
```py
py = {}
py['missing key']  # raises KeyError
py.get('missing key', 'default')  # 'default'
py.get('missing key')  # None
py[[]]  # raises TypeError due to unhashable key
py.get([])  # raises TypeError due to unhashable key
```
```js
var js = new Dict();
js.get('my key');  // throws DictKeyNotFound
js.get('missing key', 'default');  // 'default'
// Must explicitly pass null/undefined as the default;
// when passing only one .get() argument, the key is must exist,
// otherwise it thows an error.
js.get('missing key', null);  // null
js.get([]);  // throws DictKeyNotHashable
js.get([], null);  // throws DictKeyNotHashable
```
----

### Distinguishing between keys of different types
Support for distinct Boolean, Number, String, NaN, null, and undefined keys.
```py
py = {}
py[8] = 'num'
8 in py  # True
'8' in py  # False
len(py)  # 1

py['8'] = 'str'
len(py)  # 2
py[8]  # 'num'
py['8']  # 'str'
```
```js
var js = new Dict();
js.set(8, 'num');
js.hasKey(8); // true
js.hasKey('8'); // false
js.length(); // 1

js.set('8', 'str');
js.length();  // 2
js.get(8);  // 'num'
js.get('8');  // 'str'
```
----
### Deleting a key
```py
py = {'a': 1}
del py['a']
del py['b']  # raises KeyError
```
```js
var js = new Dict({'a': 1});
js.del('a');
js.del('b');  // throws DictKeyNotFound
```
----
### Popping a key
```py
py = {'a': 1, 'b': 2}
py.pop('a')  # 1
py.popitem()  # ('b', 2)
py.pop(123)  # raises KeyError
py.pop(123, 45)  # 45
```
```js
var js = new Dict({'a': 1, 'b': 2});
js.pop('a');  // 1
js.popitem(); // ['b', 2]
js.pop(123);  // throws DictKeyNotFound
js.pop(123, 45);  // 45
```
----
### Clearing out all key-value pairs
```py
py = {'a': 1, 'b': 2}
len(py)  # 2
py.clear()
len(py)  # 0
py['a']  # raises KeyError
```
```js
var js = new Dict({'a': 1, 'b': 2});
js.length();  // 2
js.clear();
js.length();  // 0
js.get('a');  // throws DictKeyNotFound
```
----
### Forming a copy
```py
py1 = {'a': 1, 'b': 2}
py2  = py1.copy()
py1['a'] = 987
py2['a']  # 1
```
```js
var js1 = new Dict({'a': 1, 'b': 2});
var js2 = js1.copy();
js1.set('a', 987);
js2.get('a');  // 1
```
----
### Updating key-value pairs
```py
py = {'a': 1, 'b': 2}
py.update({'a': 999})
py['a']  # 999
len(py)  # 2
py.update([('b', 123)])
py['b']  # 123
```
```js
var js = new Dict({'a': 1, 'b': 2});
js.update({'a': 999});
js.get('a');  // 999
js.length();  // 2
js.update([['b', 123]]);
js.get('b');  // 123
```
----
### Iterating over keys, values, and items
```py
py = {'a': 1}
# does not put all keys into memory at once
for key in py:
  print key  # prints 'a'
py.keys()  # ['a']

# does not put all values into memory at once
for value in py.itervalues():
  print value  # prints 1
py.values()  # [1]

# does not put all items into memory at once
for item in py.iteritems():
  print item  # prints ('a', 1)
py.items()  # [('a', 1)]
```
```js
var js = new Dict({'a': 1});
// does not put all keys into memory at once
js.iterkeys(function(key) {
  console.log(key);  // logs 'a'
});
js.keys();  // ['a']

// does not put all values into memory at once
js.itervalues(function(value) {
  console.log(value);  // logs 1
});
js.values();  // [1]

// does not put all items into memory at once
js.iteritems(function(key, value) {
  console.log(key, value);  // logs 'a', 1
});
js.items();  // [['a', 1]]
```
----
### Using non-Python methods
```js
var js = new Dict();
js.isEmpty();  // true
js.set('key', 99);
js.isEmpty();  // false
// executes without putting all keys into a new array in memory
js.getFirstKey();  // 1
// executes without putting all keys into a new array in memory
js.getFirstMatchingKey(function(k) {
  return typeof(k) === 'number';
 });  // throws DictKeyNotFound
js.getFirstMatchingKey(function(k) {
  return typeof(k) === 'string';
});  // 'key'

// Since there is no direct access to stored elements,
// you can't do things like "py[123] += 1".
// This is especially true of keys whose values are primitive types:
// Boolean, String, or Number.
// Instead, you must do one of the following:
js.setOneNewValue('key', function(currentValue) {
  return currentValue + 10;
});
js.get('key');  // 109

js.setSomeNewValues(['key'], function(currentValue) {
  return currentValue + 10;
});
js.get('key');  // 119

js.setAllNewValues(function(currentValue) {
  return currentValue + 10;
});
js.get('key');  // 129

js.set('array key', []);
js.get('array key').push(123);
js.get('array key');  // [123]
```


----
----

# DefaultDict

### Static methods: same as Dict (DefaultDict is a subclass of Dict)

### Instance methods: same as Dict


## Demo

### Creating a new DefaultDict
```py
py = defaultdict(list)
py = defaultdict(int, a=1)
py = defaultdict(str, [('a', 1)])
py = defaultdict(int, dict(a=1))
py = defaultdict(123)  # raises TypeError
```
```js
var js = new DefaultDict([].constructor);
var js = new DefaultDict(function(){return 0}, {'a': 1});
var js = new DefaultDict(String, [['a', 1]]);
var js = new DefaultDict(function(){return 0}, new Dict({'a': 1}));
var js = new DefaultDict(123);  // throws Error
```

### Getting a potentially-missing key's value
```py
py = defaultdict(int)
len(py)  # 0
py[1]  # 0
len(py)  # 1
py.keys()  # [1]
py.get(123)  # None
len(py)  # 1
py.keys()  # [1]
```
```js
var js = new DefaultDict(function(){return 0});
js.length();  // 0
js.get(1);  // 0
js.length();  // 1
js.keys();  // [1]
js.get(123, null);  // null
js.length();  // 1
js.keys();  // [1]
```

### Operating on potentially-missing keys' values
```py
py = defaultdict(list)
for letter in 'abc':
  py[letter].append(123)
py.items()  # [('a', [123]), ('b', [123]), ('c', [123])]
```
```js
var js = new DefaultDict([].constructor);
'abc'.split('').forEach(function(letter) {
  js.get(letter).push(123);
});
js.items();  // [['a', [123]], ['b', [123]], ['c', [123]]]
```

### DefaultDict of Dicts
```py
py = defaultdict(dict)
py[123][0] = 9
nested_dict = py[123]
nested_dict[0]  # 9
```
```js
var js = new DefaultDict(function(){return new Dict()});
js.get(123).set(0, 9);
var nestedDict = js.get(123);
nestedDict.get(0);  // 9
```

### Fun with self-referencing
```py
py = defaultdict(lambda: py)
py[1][1][2][3] = 123
len(py)  # 3
py[1] is py  # True
3 in py  # True
2 in py  # True
1 in py  # True
py[3]  # 123
```
```js
var js = new DefaultDict(function(){return js});
js.get(1).get(1).get(2).set(3, 123);
js.length();  // 3
js.get(1) === js;  // true
js.hasKey(3);  // true
js.hasKey(2);  // true
js.hasKey(1);  // true
js.get(3);  // 123
```

----
----

# Counter

### Static methods: same as DefaultDict, with some changes
- fromKeys() is not implemented (throws an error)
- getIncrementor(incrementBy)


### Instance methods: same as DefaultDict, plus some new ones
- iterelements(cb)
- elements()
- subtract(iterable)
- mostCommon(opt_n)
- leastCommon(opt_n)


## Demo

### Creating a new Counter
```py
py = Counter()
py = Counter(a=2, b=1)
py = Counter(['a', 'a', 'b'])
py = Counter(123)  # raises TypeError
```
```js
var js = new Counter();
var js = new Counter({'a': 2, 'b': 1});
var js = new Counter(['a', 'a', 'b']);
var js = new Counter(123);  // throws Error
```

### Counting distinct elements
```py
py = Counter()
py.update(['a', 'a', 32, 'false', False, float('inf')])
py.items()  # [('a', 2), (32, 1), ('false', 1), (False, 1), (inf, 1)]
list(py.elements())  # ['a', 'a', 32, 'false', False, inf]
```
```js
var js = new Counter();
js.update(['a', 'a', 32, 'false', false, NaN]);
js.items();  // [['a', 2], [32, 1], ['false', 1], [false, 1], [NaN, 1]]
js.elements();  // ['a', 'a', 32, 'false', false, NaN]
```

### Increasing/decreasing counts
```py
py = Counter(['a', 'b', 'b', 'c', 'c', 'c'])
py[99]  # 0
py['a']  # 1
py['b']  # 2
py['c']  # 3
py.update(['a', 'a', 'b'])
py['a']  # 3
py['b']  # 3
py[99]  # 0
py['c']  # 3

py.subtract({'a': 4})
py['a']  # -1
```
```js
var js = new Counter(['a', 'b', 'b', 'c', 'c', 'c']);
js.get(99);  // 0
js.get('a');  // 1
js.get('b');  // 2
js.get('c');  // 3
js.update(['a', 'a', 'b'])
js.get('a');  // 3
js.get('b');  // 3
js.get(99);  // 0
js.get('c');  // 3

js.subtract({'a': 4})
js.get('a')  // -1
```

### Getting the most common elements
```py
py = Counter(['a', 'b', 'b', 'c', 'c', 'c'])
py.most_common(1)  # [('c', 3)]
py.most_common(2)  # [('c', 3), ('b', 2)]
py.most_common(99)  # [('c', 3), ('b', 2), ('a', 1)]
py.most_common()  # [('c', 3), ('b', 2), ('a', 1)]
```
```js
var js = new Counter(['a', 'b', 'b', 'c', 'c', 'c']);
js.mostCommon(1);  // [['c', 3]]
js.mostCommon(2);  // [['c', 3], ['b', 2]]
js.mostCommon(99);  // [['c', 3], ['b', 2], ['a', 1]]
js.mostCommon();  // [['c', 3], ['b', 2], ['a', 1]]
```

----
----

# OrderedDict

### Static methods: same as Dict (it's a Dict subclass)

### Instance methods: same as Dict

## Demo

### Creating a new OrderedDict
```py
py = OrderedDict()
py = OrderedDict(a=1, b=2)
py = OrderedDict([('a', 1), ('b', 2)])
```
```js
var js = new OrderedDict();
var js = new OrderedDict({a:1, b:2});
var js = new OrderedDict([['a', 1], ['b', 2]]);
```

### Maintaining the order of keys and values
```py
py = OrderedDict()
py['1st'] = 0
py['2nd'] = 1
py['3rd'] = 2
py.keys()  # ['1st', '2nd', '3rd']
py.values()  # [0, 1, 2]

py.pop('1st')  # 0
py.keys()  # ['2nd', '3rd']
py.values()  # [1, 2]

py['1st'] = 0
py.keys()  # ['2nd', '3rd', '1st']
py.values()  # [1, 2, 0]
```
```js
var js = new OrderedDict();
js.set('1st', 0);
js.set('2nd', 1);
js.set('3rd', 2);
js.keys();  // ['1st', '2nd', '3rd']
js.values();  // [0, 1, 2]

js.pop('1st');  // 0
js.keys();  // ['2nd', '3rd']
js.values();  // [1, 2]

js.set('1st', 0);
js.keys();  // ['2nd', '3rd', '1st']
js.values();  // [1, 2, 0]
```

----
----

# NamedTuple

## Demo

### Defining a new NamedTuple class
```py
Py = namedtuple('Py', ['a', 'b'])
```
```js
var Js = NamedTuple('Js', ['a', 'b']);
```

### Creating instances of the new class
```py
py = Py(1, 2)  #  Py(a=1, b=2)
py = Py(1)  # throws TypeError
py = Py(1, 2, 3)  # throws TypeError
```
```js
var js = new Js(1, 2);
js.toString();  // "Js(a=1, b=2)"
var js = new Js(1);  // throws Error
var js = new Js(1, 2, 3);  // throws Error
```

### Accessing an instance's properties directly
```py
py = Py(1, [2, 3])
py.a  # 1
py.b  # [2, 3]
py[0]  # 1
py[1]  # [2, 3]

py.a = 123  # raises AttributeError
py[1] = 99  # raises TypeError
```
```js
var js = new Js(1, [2, 3]);
js.a;  // 1
js.b;  // [2, 3]
js[0];  // 1
js[1];  // [2, 3]

js.a = 99;  // throws Error in strict mode, otherwise changes nothing
js[1] = 99;  // changes nothing
```

### Accessing an instance's properties via Array functions
```py
py = Py(1, 2)
for value in py:
  print value  # prints 1 then 2
all(py)  # True
```
```js
var js = new Js(1, 2);
js.forEach(function(value, index) {
  console.log(value, index);  // logs [1, 0] then [2, 1]
});
js.every(function(v){return v > 0});  // true
```
