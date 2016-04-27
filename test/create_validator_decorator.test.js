'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('createValidatorDecorator', () => {
  const toStringResult = 'toString result';
  let toString;
  let createProcessorDecorator;
  let createValidatorDecorator;

  beforeEach(() => {
    toString = sinon.stub().returns(toStringResult);
    createProcessorDecorator = sinon.spy();

    mockery.registerMock('validator', {
      toString,
    });
    mockery.registerMock('./create_processor_decorator', createProcessorDecorator);

    createValidatorDecorator = require('../tmp/create_validator_decorator');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts two arguments', () => {
    should(createValidatorDecorator).be.a.Function();
    should(createValidatorDecorator).have.length(3);
  });

  it('should return a function', () => {
    const createDecorator = createValidatorDecorator();

    should(createDecorator).be.a.Function;
    should(createDecorator).have.length(1);
  });

  describe('decorator creator', () => {
    let createDecorator;

    beforeEach(() => {
      createDecorator = createValidatorDecorator();
    });

    it('should throw if it is missing the first argument', () => {
      should(() => {
        createDecorator();
      }).throw(TypeError, {
        message: 'The `message` argument is required',
      });
    });

    it('should return the result of calling `createProcessorDecorator` with a function', () => {
      createDecorator('message');

      should(createProcessorDecorator).be.calledOnce();
      should(createProcessorDecorator).be.calledWithExactly(sinon.match.func);
    });
  });

  describe('validator decorator (without cast)', () => {
    const expected = 'expected';
    const unexpected = 'unexpected';
    const message = 'message';
    const currentValue = 'current value';
    let validatorFn;
    let processor;
    let store;

    beforeEach(() => {
      validatorFn = sinon.stub();
      const createDecorator = createValidatorDecorator(validatorFn, expected, false);
      createDecorator(message, 'arg1', 'arg2', 'arg3');

      processor = createProcessorDecorator.args[0][0];

      store = {
        currentValue,
        setError: sinon.spy(),
      };
    });

    it('should call validator function with the uncasted current value and the arguments', () => {
      processor(store);

      should(toString).not.be.called();
      should(validatorFn).be.calledOnce();
      should(validatorFn).be.calledWithExactly(currentValue, 'arg1', 'arg2', 'arg3');
    });

    it('should call `store.setError` with the message and return `false` if the validator returned the expected value', () => {
      validatorFn.returns(expected);

      const result = processor(store);

      should(store.setError).be.calledOnce();
      should(store.setError).be.calledWithExactly(message);
      should(result).be.false();
    });

    it('shouldn\'t call `store.setError` and not return anything if the validator returned an unexpected value', () => {
      validatorFn.returns(unexpected);

      const result = processor(store);

      should(store.setError).not.be.called();
      should(result).be.undefined();
    });
  });

  describe('validator decorator (with cast)', () => {
    const expected = 'expected';
    const unexpected = 'unexpected';
    const message = 'message';
    const currentValue = 'current value';
    let validatorFn;
    let processor;
    let store;

    beforeEach(() => {
      validatorFn = sinon.stub();
      const createDecorator = createValidatorDecorator(validatorFn, expected, true);
      createDecorator('message', 'arg1', 'arg2', 'arg3');

      processor = createProcessorDecorator.args[0][0];

      store = {
        currentValue,
        setError: sinon.spy(),
      };
    });

    it('should call validator function with the casted current value and the arguments', () => {
      processor(store);

      should(toString).be.calledOnce();
      should(toString).be.calledWithExactly(currentValue);
      should(validatorFn).be.calledOnce();
      should(validatorFn).be.calledWithExactly(toStringResult, 'arg1', 'arg2', 'arg3');
    });

    it('should call `store.setError` with the message and return `false` if the validator returned the expected value', () => {
      validatorFn.returns(expected);

      processor(store);

      should(store.setError).be.calledOnce();
      should(store.setError).be.calledWithExactly(message);
    });

    it('shouldn\'t call `store.setError` and not return anything if the validator returned an unexpected value', () => {
      validatorFn.returns(unexpected);

      processor(store);

      should(store.setError).not.be.called();
    });
  });
});
