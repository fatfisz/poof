'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var FieldValidationError = _interopDefault(require('field-validation-error'));
var validator = require('validator');
var validator__default = _interopDefault(validator);

var babelHelpers = {};

babelHelpers.createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

babelHelpers._extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var privateData = new WeakMap();

var Store = (function () {
  function Store(input) {
    babelHelpers.classCallCheck(this, Store);

    privateData.set(this, {
      input: input,
      output: {},
      errors: {},
      hasErrors: false,
      currentKey: null,
      currentValue: null
    });
  }

  Store.prototype.reset = function reset(key) {
    var data = privateData.get(this);
    data.currentKey = key;
    data.currentValue = data.input[key];
  };

  Store.prototype.getInput = function getInput(key) {
    return privateData.get(this).input[key];
  };

  Store.prototype.setOutput = function setOutput(key, value) {
    privateData.get(this).output[key] = value;
  };

  Store.prototype.setError = function setError(message) {
    var data = privateData.get(this);
    data.errors[data.currentKey] = message;
    data.hasErrors = true;
  };

  babelHelpers.createClass(Store, [{
    key: "output",
    get: function get() {
      return babelHelpers._extends({}, privateData.get(this).output);
    }
  }, {
    key: "errors",
    get: function get() {
      return babelHelpers._extends({}, privateData.get(this).errors);
    }
  }, {
    key: "hasErrors",
    get: function get() {
      return privateData.get(this).hasErrors;
    }
  }, {
    key: "currentValue",
    get: function get() {
      return privateData.get(this).currentValue;
    },
    set: function set(value) {
      privateData.get(this).currentValue = value;
    }
  }]);
  return Store;
})();

function createProcessor(definition) {
  var processors = Object.keys(definition).map(function (outputKey) {
    var propertyProcessor = definition[outputKey];
    return function (store) {
      // Initially the value is taken from the input object using the same key
      // as the one that the currently processed property has.
      store.reset(outputKey);
      propertyProcessor(store);
    };
  });

  return function (input) {
    var store = new Store(input);

    processors.forEach(function (propertyProcessor) {
      propertyProcessor(store);
    });

    if (store.hasErrors) {
      throw new FieldValidationError(store.errors);
    }

    return store.output;
  };
}

function createProcessorDecorator(processor) {
  return function (target, key, descriptor) {
    var next = descriptor.value;

    descriptor.value = function (store) {
      if (processor(store, key) !== false) {
        next(store);
      }
    };
  };
}

var assign = createProcessorDecorator(function (store, key) {
  store.setOutput(key, store.currentValue);
});

function filter (predicate) {
  return createProcessorDecorator(function (store) {
    store.currentValue = store.currentValue.filter(predicate);
  });
}

function fromDecorator (key) {
  return createProcessorDecorator(function (store) {
    store.currentValue = store.getInput(key);
  });
}

function ignoreIf (predicate) {
  return createProcessorDecorator(function (store) {
    if (predicate(store.currentValue)) {
      return false;
    }
  });
}

var ignoreIfUndefined = createProcessorDecorator(function (store) {
  if (typeof store.currentValue === 'undefined') {
    return false;
  }
});

function map (mapper) {
  return createProcessorDecorator(function (store) {
    store.currentValue = store.currentValue.map(mapper);
  });
}

function set (value) {
  return createProcessorDecorator(function (store) {
    store.currentValue = value;
  });
}

function transform (transformer) {
  return createProcessorDecorator(function (store) {
    store.currentValue = transformer(store.currentValue);
  });
}

function createValidatorDecorator(validatorFn, expected, castToString) {
  return function (message) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!message) {
      throw new TypeError('The `message` argument is required');
    }

    return createProcessorDecorator(function (store) {
      var currentValue = store.currentValue;

      var cleanValue = castToString ? validator.toString(currentValue) : currentValue;

      if (validatorFn.apply(undefined, [cleanValue].concat(args)) === expected) {
        store.setError(message);
        return false;
      }
    });
  };
}

function getValidatorDecorators(castToString) {
  var assert = {
    not: {}
  };

  Object.keys(validator__default).filter(function (name) {
    return name === 'contains' || name === 'equals' || name === 'matches' || name.slice(0, 2) === 'is';
  }).forEach(function (validatorName) {
    var validatorFn = validator__default[validatorName];
    assert[validatorName] = createValidatorDecorator(validatorFn, false, castToString);
    assert.not[validatorName] = createValidatorDecorator(validatorFn, true, castToString);
  });

  return assert;
}

function poofFactory(castToString) {
  return {
    createProcessor: createProcessor,
    decorators: {
      assign: assign,
      filter: filter,
      from: fromDecorator,
      ignoreIf: ignoreIf,
      ignoreIfUndefined: ignoreIfUndefined,
      map: map,
      set: set,
      transform: transform,
      assert: getValidatorDecorators(castToString)
    }
  };
}

module.exports = poofFactory;