'use strict';

const should = require('should/as-function');

const poof = require('../dist');
const createProcessor = require('../dist/create_processor');
const decorators = require('../dist/decorators');
const ValidationError = require('../dist/validation_error');


describe('index', () => {
  it('should have appropriate exports', () => {
    should(poof).have.keys('createProcessor', 'decorators', 'ValidationError');
    should(poof.createProcessor).be.equal(
      createProcessor,
      'expected poof.createProcessor to have the right value'
    );
    should(poof.decorators).be.equal(
      decorators,
      'expected poof.decorators to have the right value'
    );
    should(poof.ValidationError).be.equal(
      ValidationError,
      'expected poof.ValidationError to have the right value'
    );
  });
});
