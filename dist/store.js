"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privateData = new WeakMap();

var Store = (function () {
  function Store(input) {
    _classCallCheck(this, Store);

    privateData.set(this, {
      input: input,
      output: {},
      errors: {},
      hasErrors: false,
      currentKey: null,
      currentValue: null
    });
  }

  _createClass(Store, [{
    key: "reset",
    value: function reset(key) {
      var data = privateData.get(this);
      data.currentKey = key;
      data.currentValue = data.input[key];
    }
  }, {
    key: "getInput",
    value: function getInput(key) {
      return privateData.get(this).input[key];
    }
  }, {
    key: "setOutput",
    value: function setOutput(key, value) {
      privateData.get(this).output[key] = value;
    }
  }, {
    key: "setError",
    value: function setError(message) {
      var data = privateData.get(this);
      data.errors[data.currentKey] = message;
      data.hasErrors = true;
    }
  }, {
    key: "hasErrors",
    value: function hasErrors() {
      return privateData.get(this).hasErrors;
    }
  }, {
    key: "output",
    get: function get() {
      return _extends({}, privateData.get(this).output);
    }
  }, {
    key: "errors",
    get: function get() {
      return _extends({}, privateData.get(this).errors);
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

exports["default"] = Store;
module.exports = exports["default"];
