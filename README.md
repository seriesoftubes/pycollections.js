# collections.js
## Bringing collections.py to JavaScript

collections.js contains class definitions for Dict, DefaultDict, and Counter, each of which is fully-stocked with functionality native to their collections.py counterparts.


# Dict
### Static methods:
- fromKeys(keys, opt_valueForAllKeys)
### Instance methods:
- clear() (link to py/js example pair)
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

### Methods not present in Python dict:
- getFirstKey()
- getFirstMatchingKey(predicate)
- modifyOneValueInPlace(key, fn)
- modifySomeValuesInPlace(keys, fn)
- modifyAllValuesInPlace(fn)


## Demo
Python:
```py
d = dict()
```
JS:
```js
var d = new Dict();
```

Python:
```py
d[5.8] = 'num'
5.8 in d  # True
'5.8' in d  # False
len(d)  # 1

d['5.8'] = 'str'
len(d)  # 2
d[5.8]  # 'num'
d['5.8']  # 'str'
```

JS:
```js
d.set(5.8, 'num');
d.set('5.8', 'str');
d.length();  // 2
d.get(5.8);  // 'num'
d.get('5.8');  // 'str'
```

Python:
```python
123 in d
```

JS:
```js
d.hasKey(123);
```
