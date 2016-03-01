'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _create_processor = require('./create_processor');

var _create_processor2 = _interopRequireDefault(_create_processor);

var _decorators = require('./decorators');

var decorators = _interopRequireWildcard(_decorators);

var _validation_error = require('./validation_error');

var _validation_error2 = _interopRequireDefault(_validation_error);

var _validator_decorators_with_cast = require('./validator_decorators_with_cast');

var _validator_decorators_with_cast2 = _interopRequireDefault(_validator_decorators_with_cast);

var decoratorsFixed = _extends({}, decorators, {
  assert: _validator_decorators_with_cast2['default']
});

exports.createProcessor = _create_processor2['default'];
exports.decorators = decoratorsFixed;
exports.ValidationError = _validation_error2['default'];
