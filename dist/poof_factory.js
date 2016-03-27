'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = poofFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _create_processor = require('./create_processor');

var _create_processor2 = _interopRequireDefault(_create_processor);

var _decoratorsAssign = require('./decorators/assign');

var _decoratorsAssign2 = _interopRequireDefault(_decoratorsAssign);

var _decoratorsFrom = require('./decorators/from');

var _decoratorsFrom2 = _interopRequireDefault(_decoratorsFrom);

var _decoratorsIgnore_if_undefined = require('./decorators/ignore_if_undefined');

var _decoratorsIgnore_if_undefined2 = _interopRequireDefault(_decoratorsIgnore_if_undefined);

var _decoratorsSet = require('./decorators/set');

var _decoratorsSet2 = _interopRequireDefault(_decoratorsSet);

var _decoratorsTransform = require('./decorators/transform');

var _decoratorsTransform2 = _interopRequireDefault(_decoratorsTransform);

var _get_validator_decorators = require('./get_validator_decorators');

var _get_validator_decorators2 = _interopRequireDefault(_get_validator_decorators);

var _validation_error = require('./validation_error');

var _validation_error2 = _interopRequireDefault(_validation_error);

function poofFactory(castToString) {
  return {
    createProcessor: _create_processor2['default'],
    decorators: {
      assign: _decoratorsAssign2['default'],
      from: _decoratorsFrom2['default'],
      ignoreIfUndefined: _decoratorsIgnore_if_undefined2['default'],
      set: _decoratorsSet2['default'],
      transform: _decoratorsTransform2['default'],
      assert: (0, _get_validator_decorators2['default'])(castToString)
    },
    ValidationError: _validation_error2['default']
  };
}

module.exports = exports['default'];
