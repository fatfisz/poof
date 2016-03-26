'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationError = (function (_Error) {
  _inherits(ValidationError, _Error);

  function ValidationError(fields) {
    _classCallCheck(this, ValidationError);

    if (!fields) {
      throw new TypeError('The `fields` argument is required');
    }

    _Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.fields = fields;
  }

  return ValidationError;
})(Error);

ValidationError.prototype.name = 'ValidationError';

exports['default'] = ValidationError;
module.exports = exports['default'];
