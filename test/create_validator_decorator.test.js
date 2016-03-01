'use strict';

const should = require('should/as-function');
const sinon = require('sinon');

const createValidatorDecorator = require('../dist/create_validator_decorator');


describe('createValidatorDecorator', () => {
  it('should be a function that accepts two arguments', () => {
    should(createValidatorDecorator).be.a.Function();
    should(createValidatorDecorator).have.length(3);
  });

  it('should return a decorator creator', () => {
    const createDecorator = createValidatorDecorator();

    should(createDecorator).be.a.Function;

    const decorator = createDecorator('message');

    should(decorator).be.a.Function;
    should(decorator).have.length(3);
  });

  describe('validator decorator (without cast)', () => {
    const expected = 'expected';
    const unexpected = 'unexpected';
    const target = null;
    const key = 'test key';
    const currentValue = 'current value';
    let next;
    let validatorFn;
    let createDecorator;
    let processor;
    let getCurrentValue;
    let store;

    beforeEach(() => {
      const descriptor = {
        value: sinon.spy(),
      };
      next = descriptor.value;
      validatorFn = sinon.stub();
      createDecorator = createValidatorDecorator(validatorFn, expected, false);
      const decorator = createDecorator('message', 'arg1', 'arg2', 'arg3');
      decorator(target, key, descriptor);
      processor = descriptor.value;
      getCurrentValue = sinon.stub().returns(currentValue);
      store = {
        get currentValue() {
          return getCurrentValue();
        },
        setError: sinon.spy(),
      };
    });

    it('should throw when the message is missing', () => {
      should(() => {
        createDecorator();
      }).throw(TypeError, {
        message: 'The `message` argument is required',
      });
    });

    it('should call validator function with the current value and the arguments', () => {
      processor(store);

      should(getCurrentValue).be.calledOnce();

      should(validatorFn).be.calledOnce();
      should(validatorFn).be.calledWithExactly(currentValue, 'arg1', 'arg2', 'arg3');
    });

    it('should not cast the current value', () => {
      // eslint-disable-next-line no-new-wrappers
      const objectCurrentValue = new String(currentValue);
      getCurrentValue.returns(objectCurrentValue);

      processor(store);

      should(validatorFn).be.calledWith(objectCurrentValue);
    });

    it('should call `store.setError` with the message and return false if the validator returned the expected value', () => {
      validatorFn.returns(expected);

      processor(store);

      should(store.setError).be.calledOnce();
      should(store.setError).be.calledWithExactly('message');
      should(next).not.be.called(); // This means the returned value was false
    });

    it('shouldn\'t call `store.setError` and not return false if the validator returned an unexpected value', () => {
      validatorFn.returns(unexpected);

      processor(store);

      should(store.setError).not.be.called();
      should(next).be.called(); // This means the returned value was not false
    });
  });

  describe('validator decorator (with cast)', () => {
    const expected = 'expected';
    const unexpected = 'unexpected';
    const target = null;
    const key = 'test key';
    const currentValue = 'current value';
    let next;
    let validatorFn;
    let createDecorator;
    let processor;
    let getCurrentValue;
    let store;

    beforeEach(() => {
      const descriptor = {
        value: sinon.spy(),
      };
      next = descriptor.value;
      validatorFn = sinon.stub();
      createDecorator = createValidatorDecorator(validatorFn, expected, true);
      const decorator = createDecorator('message', 'arg1', 'arg2', 'arg3');
      decorator(target, key, descriptor);
      processor = descriptor.value;
      getCurrentValue = sinon.stub().returns(currentValue);
      store = {
        get currentValue() {
          return getCurrentValue();
        },
        setError: sinon.spy(),
      };
    });

    it('should throw when the message is missing', () => {
      should(() => {
        createDecorator();
      }).throw(TypeError, {
        message: 'The `message` argument is required',
      });
    });

    it('should call validator function with the current value and the arguments', () => {
      processor(store);

      should(getCurrentValue).be.calledOnce();

      should(validatorFn).be.calledOnce();
      should(validatorFn).be.calledWithExactly(currentValue, 'arg1', 'arg2', 'arg3');
    });

    it('should cast the current value', () => {
      // eslint-disable-next-line no-new-wrappers
      const objectCurrentValue = new String(currentValue);
      getCurrentValue.returns(objectCurrentValue);

      processor(store);

      should(validatorFn).be.calledWith(currentValue);
    });

    it('should call `store.setError` with the message and return false if the validator returned the expected value', () => {
      validatorFn.returns(expected);

      processor(store);

      should(store.setError).be.calledOnce();
      should(store.setError).be.calledWithExactly('message');
      should(next).not.be.called(); // This means the returned value was false
    });

    it('shouldn\'t call `store.setError` and not return false if the validator returned an unexpected value', () => {
      validatorFn.returns(unexpected);

      processor(store);

      should(store.setError).not.be.called();
      should(next).be.called(); // This means the returned value was not false
    });
  });
});
