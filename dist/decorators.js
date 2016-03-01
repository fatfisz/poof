'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _create_processor_decorator = require('./create_processor_decorator');

var _create_processor_decorator2 = _interopRequireDefault(_create_processor_decorator);

var assign = (0, _create_processor_decorator2['default'])(function (store, key) {
  store.setOutput(key, store.currentValue);
});

exports.assign = assign;
var from = function from(key) {
  return (0, _create_processor_decorator2['default'])(function (store) {
    store.currentValue = store.getInput(key);
  });
};

exports.from = from;
var ignoreIfUndefined = (0, _create_processor_decorator2['default'])(function (store) {
  if (typeof store.currentValue === 'undefined') {
    return false;
  }
});

exports.ignoreIfUndefined = ignoreIfUndefined;
var set = function set(value) {
  return (0, _create_processor_decorator2['default'])(function (store) {
    store.currentValue = value;
  });
};

exports.set = set;
var transform = function transform(transformer) {
  return (0, _create_processor_decorator2['default'])(function (store) {
    store.currentValue = transformer(store.currentValue);
  });
};
exports.transform = transform;
