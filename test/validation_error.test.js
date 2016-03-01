'use strict';

const should = require('should/as-function');

const ValidationError = require('../dist/validation_error');


describe('ValidationError', () => {
  it('should export a function that accepts one argument', () => {
    should(ValidationError).be.a.Function();
    should(ValidationError).have.a.length(1);
  });

  it('should throw when not instantiated using `new`', () => {
    should(() => {
      ValidationError({});
    }).throw(TypeError, {
      message: 'Cannot call a class as a function',
    });
  });

  it('should have the right name set on the prototype and instance', () => {
    should(ValidationError.prototype.name).be.equal('ValidationError');
    should(new ValidationError().name).be.equal('ValidationError');
  });

  it('should set the fields correctly', () => {
    const fields = 'test fields';
    should(new ValidationError(fields).fields).be.equal(fields);
  });
});
