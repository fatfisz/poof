'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getValidatorDecorators;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _create_validator_decorator = require('./create_validator_decorator');

var _create_validator_decorator2 = _interopRequireDefault(_create_validator_decorator);

function getValidatorDecorators(castToString) {
  var assert = {
    not: {}
  };

  Object.keys(_validator2['default']).filter(function (name) {
    return name === 'contains' || name === 'equals' || name === 'matches' || name.slice(0, 2) === 'is';
  }).forEach(function (validatorName) {
    var validatorFn = _validator2['default'][validatorName];
    assert[validatorName] = (0, _create_validator_decorator2['default'])(validatorFn, false, castToString);
    assert.not[validatorName] = (0, _create_validator_decorator2['default'])(validatorFn, true, castToString);
  });

  return assert;
}

module.exports = exports['default'];
