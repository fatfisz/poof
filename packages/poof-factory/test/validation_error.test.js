'use strict';

const mockery = require('mockery');
const should = require('should/as-function');


describe('ValidationError', () => {
  let ValidationError;

  beforeEach(() => {
    ValidationError = require('../tmp/validation_error');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should export a function that accepts one argument', () => {
    should(ValidationError).be.a.Function();
    should(ValidationError).have.a.length(1);
  });

  it('should throw when not instantiated using `new`', () => {
    should(() => {
      ValidationError();
    }).throw(TypeError, {
      message: 'Cannot call a class as a function',
    });
  });

  it('should throw when the fields are missing', () => {
    should(() => {
      // eslint-disable-next-line no-new
      new ValidationError();
    }).throw(TypeError, {
      message: 'The `fields` argument is required',
    });
  });

  it('should have the right name set on the prototype and instance', () => {
    should(ValidationError.prototype.name).be.equal('ValidationError');
    should(new ValidationError({}).name).be.equal('ValidationError');
  });

  it('should set the fields correctly', () => {
    const fields = 'test fields';
    should(new ValidationError(fields).fields).be.equal(fields);
  });
});
