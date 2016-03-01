'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _create_validator_decorator = require('./create_validator_decorator');

var _create_validator_decorator2 = _interopRequireDefault(_create_validator_decorator);

var assert = {
  not: {}
};
exports['default'] = assert;

Object.keys(_validator2['default']).filter(function (name) {
  return name === 'contains' || name === 'equals' || name === 'matches' || name.slice(0, 2) === 'is';
}).forEach(function (validatorName) {
  var validatorFn = _validator2['default'][validatorName];
  assert[validatorName] = (0, _create_validator_decorator2['default'])(validatorFn, false, true);
  assert.not[validatorName] = (0, _create_validator_decorator2['default'])(validatorFn, true, true);
});
module.exports = exports['default'];
