'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('Poof Factory', () => {
  let poofFactory;
  let getValidatorDecorators;

  beforeEach(() => {
    getValidatorDecorators = sinon.stub().returns('validator_decorators');

    mockery.registerMock('./create_processor.js', 'create_processor');
    mockery.registerMock('./decorators/assign.js', 'assign');
    mockery.registerMock('./decorators/from.js', 'from');
    mockery.registerMock('./decorators/ignore_if.js', 'ignore_if');
    mockery.registerMock('./decorators/ignore_if_undefined.js', 'ignore_if_undefined');
    mockery.registerMock('./decorators/set.js', 'set');
    mockery.registerMock('./decorators/transform.js', 'transform');
    mockery.registerMock('./get_validator_decorators.js', getValidatorDecorators);

    poofFactory = require('../tmp/poof_factory');
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

    should(poof).have.keys('createProcessor', 'decorators');
    should(poof).be.eql({
      createProcessor: 'create_processor',
      decorators: {
        assign: 'assign',
        from: 'from',
        ignoreIf: 'ignore_if',
        ignoreIfUndefined: 'ignore_if_undefined',
        set: 'set',
        transform: 'transform',
        assert: 'validator_decorators',
      },
    });
  });
});
