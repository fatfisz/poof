'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('index', () => {
  let poofFactory;
  let getValidatorDecorators;

  beforeEach(() => {
    getValidatorDecorators = sinon.stub().returns('validator_decorators');

    mockery.registerMock('./create_processor', 'create_processor');
    mockery.registerMock('./decorators/assign', 'assign');
    mockery.registerMock('./decorators/from', 'from');
    mockery.registerMock('./decorators/ignore_if_undefined', 'ignore_if_undefined');
    mockery.registerMock('./decorators/set', 'set');
    mockery.registerMock('./decorators/transform', 'transform');
    mockery.registerMock('./get_validator_decorators', getValidatorDecorators);
    mockery.registerMock('./validation_error', 'validation_error');

    poofFactory = require('../dist/poof_factory');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(poofFactory).be.a.Function();
    should(poofFactory).have.length(1);
  });

  it('should return an appropriate object', () => {
    const castToString = 'cast to string';
    const poof = poofFactory(castToString);

    should(poof).have.keys('createProcessor', 'decorators', 'ValidationError');
    should(poof).be.eql({
      createProcessor: 'create_processor',
      decorators: {
        assign: 'assign',
        from: 'from',
        ignoreIfUndefined: 'ignore_if_undefined',
        set: 'set',
        transform: 'transform',
        assert: 'validator_decorators',
      },
      ValidationError: 'validation_error',
    });
  });
});
