'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createProcessor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _validation_error = require('./validation_error');

var _validation_error2 = _interopRequireDefault(_validation_error);

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
    var store = new _store2['default'](input);

    processors.forEach(function (propertyProcessor) {
      propertyProcessor(store);
    });

    if (store.hasErrors()) {
      throw new _validation_error2['default'](store.errors);
    }

    return store.output;
  };
}

module.exports = exports['default'];
