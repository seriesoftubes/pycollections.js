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
- isEmpty()
- iteritems(cb)
- items()
- itervalues(cb)
- values()

### Instance methods (not present in Python dict):
- getFirstKey()
- getFirstMatchingKey(predicate)
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
```
```js
var js = new Dict();
var js = Dict.fromKeys([1, 2, 3], {'the': 'value'});
```
-----
### Detecting presence of a key
```py
py = {}
987 in py  # False
```
```js
var js = new Dict();
js.hasKey(987);  // false
```
----
### Getting a potentially-missing key's value
```py
py = {}
py['missing key']  # raises KeyError
py.get('missing key', 'default')  # 'default'
py.get('missing key')  # None
```
```js
var js = new Dict();
js.get('my key');  // throws DictKeyNotFoundError
js.get('missing key', 'default');  // 'default'
// Must explicitly pass null/undefined as the default;
// with 1 .get() argument, the key is assumed to exist.
js.get('missing key', null);  // null
```
----

### Distinguishing between keys of different types
Support for distinct Boolean, Number, String, Null, NaN, and undefined keys.
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


