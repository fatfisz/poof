'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createValidatorDecorator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _validator = require('validator');

var _create_processor_decorator = require('./create_processor_decorator');

var _create_processor_decorator2 = _interopRequireDefault(_create_processor_decorator);

function createValidatorDecorator(validatorFn, expected, castToString) {
  return function (message) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!message) {
      throw new TypeError('The `message` argument is required');
    }

    return (0, _create_processor_decorator2['default'])(function (store) {
      var currentValue = store.currentValue;

      var cleanValue = castToString ? (0, _validator.toString)(currentValue) : currentValue;

      if (validatorFn.apply(undefined, [cleanValue].concat(args)) === expected) {
        store.setError(message);
        return false;
      }
    });
  };
}

module.exports = exports['default'];
