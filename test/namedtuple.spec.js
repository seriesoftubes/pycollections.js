// Tests for NamedTuple.
'use strict';


if (typeof require !== 'undefined') var pycollections = require('../dist/pycollections');
var NamedTuple = pycollections.NamedTuple;
var RESERVED_WORDS = pycollections.RESERVED_WORDS;


describe('RESERVED_WORDS', function() {
  it('Should not allow changing RESERVED_WORDS', function() {
    for (var key in RESERVED_WORDS) {
      var getValue = function() {return RESERVED_WORDS[key]};
      var oldValue = getValue();
      expect(function() {
        RESERVED_WORDS[key] = 987;
      }).toThrow();
      expect(getValue()).toBe(oldValue);
    }

    var newKey = 'thisIsANewKey!@834';
    expect(function() {
      RESERVED_WORDS[newKey] = 123;
    }).toThrow();

    expect(RESERVED_WORDS[newKey]).toBe(undefined);
  });
});


describe('NamedTuple', function() {
  var NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  var UNDERSCORE = '_';

  var LETTERS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z'
  ];

  var INVALID_CHARS_FOR_JS_CLASS_NAME = [
    '`', '~', '!', '@', '#', '$', '%', '^', '&',
    '*', '-', '=', '+',
    ' ', '\t', '\n', '\r', '\v', '\f',
    '[', ']', '{', '}', '(', ')', '<', '>',
    '\\', '|', ',', '.', '?', '/',
    '"', ';', ':', "'"
  ];

  it('Requires an array as its second argument', function() {
    expect(function() {
      NamedTuple('LegitClassName');
    }).toThrow();
  });

  it('Requires a string as its first argument', function() {
    [0, 1, false, true, null, undefined, NaN].forEach(function(v) {
      expect(function() {
        NamedTuple(v, []);
      }).toThrow();
    });
  });

  it('Can take an empty array as its second arg', function() {
    expect(function() {
      NamedTuple('Yea', []);
    }).not.toThrow();
  });

  it('Requires a non-reserved string (whose first element must be a letter, followed by letters, numbers, and underscores) as its name argument', function() {
    // property names don't matter.
    var propertyNames = ['', 'a', 0, 1, false, true, NaN, undefined, null];

    // can only use a-z A-Z or '_' as the first character.
    var validFirstCharacters = LETTERS.slice();
    validFirstCharacters.push(UNDERSCORE);

    validFirstCharacters.forEach(function(validChar) {
      expect(validChar.length).toBe(1);

      if (!RESERVED_WORDS[validChar]) {
        expect(function() {
          NamedTuple(validChar, propertyNames);
        }).not.toThrow();
      }

      // adding another letter should work
      for (var i = 0, len = LETTERS.length; i < len; i++) {
        var letter = LETTERS[i];
        var plusLetter = validChar + letter;

        if (RESERVED_WORDS[plusLetter]) continue;

        expect(function() {
          NamedTuple(plusLetter, propertyNames);
        }).not.toThrow();
      }

      // adding a number should work
      for (var i = 0, len = NUMBERS.length; i < len; i++) {
        var number = NUMBERS[i];
        expect(function() {
          NamedTuple(validChar + number, propertyNames);
        }).not.toThrow();
      }

      // adding an underscore should work
      expect(function() {
        NamedTuple(validChar + UNDERSCORE, propertyNames);
      }).not.toThrow();

      // adding an invalidCharacter should not work
      for (var i = 0, len = INVALID_CHARS_FOR_JS_CLASS_NAME.length; i < len; i++) {
        var invalidChar = INVALID_CHARS_FOR_JS_CLASS_NAME[i];
        expect(function() {
          NamedTuple(validChar + invalidChar, propertyNames);
        }).toThrow();
      }
    });

    var invalidFirstCharacters = NUMBERS.slice().concat(INVALID_CHARS_FOR_JS_CLASS_NAME);
    invalidFirstCharacters.forEach(function(invalidChar) {
      expect(invalidChar.length).toBe(1);
      expect(function(){
        NamedTuple(invalidChar, propertyNames);
      }).toThrow();
    });
  });

  it('Should produce a class whose name equals the one given to the NamedTuple function', function() {
    // Note: this does not work on IE.
    ['A', 'a', 'MyClass'].forEach(function(className) {
      expect(NamedTuple(className, []).name).toBe(className);
    });
  });

  it('Should allow subclassing of its output class', function() {
    var SuperClass = NamedTuple('SuperClass', ['a']);

    var SubClass = function(arg) {
      SuperClass.call(this, arg);
    };
    SubClass.constructor = SuperClass;
    SubClass.prototype = Object.create(SuperClass.prototype);

    var s1 = new SubClass(123);
    expect(s1 instanceof SubClass).toBe(true);
    expect(s1 instanceof SuperClass).toBe(true);
  });

  it('Should throw an error when creating a new instance of its output with an improper number of args', function() {
    var MyClass = NamedTuple('MyClass', ['a', 'b']);

    expect(function() {
      new MyClass();
    }).toThrow();

    expect(function() {
      new MyClass(1);
    }).toThrow();

    expect(function() {
      new MyClass(1, 2);
    }).not.toThrow();

    expect(function() {
      new MyClass(1, 2, 3);
    }).toThrow();
  });
});


describe('NamedTuple output class instance', function() {
  it('Should not change the value of any of its properties', function() {
    var MyClass = NamedTuple('MyClass', ['a']);
    var valueA = {yea: 123};
    var obj = new MyClass(valueA);
    expect(obj.a).toBe(valueA);

    expect(function() {
      obj.a = 3281435;
    }).toThrow();

    expect(obj.a).toBe(valueA);
  });

  it('Should not allow adding new properties to itself', function() {
    var MyClass = NamedTuple('MyClass', ['a']);
    var obj = new MyClass(1);
    var newKey = 'asdfj123';
    expect(obj[newKey]).toBe(undefined);
    expect(function() {
      obj[newKey] = 123;
    }).toThrow();
    expect(obj[newKey]).toBe(undefined);

    expect(function() {
      Object.defineProperty(obj, newKey, {value: 987});
    }).toThrow();

    expect(obj[newKey]).toBe(undefined);
  });

  it('Should iterate through its properties in the same order in which they were provided', function() {
    var prop1 = 'a';
    var prop2 = 'b';
    var props = [prop1, prop2];
    var Thing = NamedTuple('Thing', props);

    var firstArg = 1;
    var secondArg = 2;
    var args = [firstArg, secondArg];
    // can't easily dynamically call a constructor
    var thing = new Thing(firstArg, secondArg);

    expect(thing.fields).toBe(props);
    var keyIndex = 0;
    thing.forEach(function(value, index, context) {
      expect(context).toBe(thing);
      expect(value).toBe(args[index]);
    });
  });

  it('Should have a length that always matches its number of properties', function() {
    var Thing0, Thing1, Thing2;
    var t0, t1, t2;

    Thing0 = NamedTuple('Thing', []);
    t0 = new Thing0();
    expect(t0.length).toBe(0);

    Thing1 = NamedTuple('Thing', ['a']);
    t1 = new Thing1('first arg');
    expect(t1.length).toBe(1);

    Thing2 = NamedTuple('Thing', ['a', 'b']);
    t2 = new Thing2('first arg', 123);
    expect(t2.length).toBe(2);

    expect(function() {
      t2.adsf = 3;
    }).toThrow();
    expect(t2.length).toBe(2);

    expect(function() {
      delete t2.a;
    }).toThrow();
    expect(t2.length).toBe(2);

    expect(function() {
      Object.defineProperty(t2, 'neasdfadsf', {value: 123});
    }).toThrow();
    expect(t2.length).toBe(2);
  });

  it('Should keep an accurate, non-enumerable length property even if one of its props is "length"', function() {
    var Weird = NamedTuple('Weird', ['a', 'length']);
    var firstArg = 1;
    var secondArg = 98;
    var nw = new Weird(firstArg, secondArg);
    var len = nw.length;
    expect(len).toBe(2);
    expect(secondArg).not.toBe(len);
    expect(nw[1]).toBe(secondArg);

    nw.forEach(function(value, index) {
      if (index === 0) expect(value).toBe(firstArg);
      else if (index === 1) expect(value).toBe(secondArg);
      else throw new Error('should not be reached');
    });
  });

  it('Should keep an accurate, non-enumerable fields property even if one of its props is "fields"', function() {
    var props = ['fields'];
    var Weird = NamedTuple('Weird', props);
    var arg = 98;
    expect(arg).not.toBe(props);
    var nw = new Weird(arg);
    expect(nw.fields).toBe(props)

    expect(nw[0]).toBe(arg);
    nw.forEach(function(value, index) {
      if (index === 0) expect(value).toBe(arg);
      else throw new Error('should not be reached');
    });
  });

  it('Should not overwrite its toString method if one of its props is "toString"', function() {
    var props = ['toString'];
    var Weird = NamedTuple('Weird', props);
    var arg = 98;
    expect(typeof arg).not.toBe('function');
    var nw = new Weird(arg);
    expect(nw.toString).not.toBe(arg);
    expect(typeof nw.toString).toBe('function');

    nw.forEach(function(value, index) {
      if (index === 0) expect(value).toBe(arg);
      else throw new Error('should not be reached');
    });
  });
});
