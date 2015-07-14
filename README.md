# collections.js
## Bringing collections.py to JavaScript

collections.js contains class definitions for Dict, DefaultDict, and Counter, all stocked with functionality that both exceeds that of the ES6 Map class and (mostly) mirrors their collections.py counterparts.

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
- modifyOneValueInPlace(key, fn)
- modifySomeValuesInPlace(keys, fn)
- modifyAllValuesInPlace(fn)
- setOneNewValue(key, fn)
- setSomeNewValues(keys, fn)
- setAllNewValues(fn)


## Demo

### Creating a new instance
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
