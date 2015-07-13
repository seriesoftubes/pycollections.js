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
```python
123 in d
```

JS:
```js
d.hasKey(123);
```


Python:
```py
d[8] = 'num'
8 in d  # True
'8' in d  # False
len(d)  # 1

d['8'] = 'str'
len(d)  # 2
d[8]  # 'num'
d['8']  # 'str'
```

JS:
```js
d.set(8, 'num');
d.hasKey(8); // true
d.hasKey('8'); // false
d.length(); // 1

d.set('8', 'str');
d.length();  // 2
d.get(8);  // 'num'
d.get('8');  // 'str'
```

Python:
```py
d['my key']
d.get('missing key', 'default value')
d.get('missing key')
```

JS:
```js
d.get('my key');
d.get('missing key', 'default value');
// Must explicitly pass undefined as the default,
// otherwise the key is assumed to exist.
d.get('missing key', undefined);
```

