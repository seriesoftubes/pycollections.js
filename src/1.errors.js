
var DictKeyNotFound = function(opt_key) {
  if (arguments.length) {
    this.keyWasSupplied = true;
    this.key = opt_key;
  } else {
    this.keyWasSupplied = false;
  }
};

var DictKeyNotHashable = function(key) {
  this.key = key;
};
