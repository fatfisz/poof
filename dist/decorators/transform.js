'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _create_processor_decorator = require('../create_processor_decorator');

var _create_processor_decorator2 = _interopRequireDefault(_create_processor_decorator);

exports['default'] = function (transformer) {
  return (0, _create_processor_decorator2['default'])(function (store) {
    store.currentValue = transformer(store.currentValue);
  });
};

module.exports = exports['default'];
