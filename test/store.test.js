'use strict';

const should = require('should/as-function');
const sinon = require('sinon');

const Store = require('../dist/store');


describe('Store', () => {
  it('should export a function that accepts one argument', () => {
    should(Store).be.a.Function();
    should(Store).have.a.length(1);
  });

  it('should throw when not instantiated using `new`', () => {
    should(() => {
      Store({});
    }).throw(TypeError, {
      message: 'Cannot call a class as a function',
    });
  });

  describe('methods and properties', () => {
    const testKey = 'testKey';
    const testValue = 'test value';
    const input = Object.freeze({
      [testKey]: testValue,
    });
    let data;
    let store;

    beforeEach(() => {
      data = {
        input,
        output: {},
        errors: {},
      };
      sinon.stub(WeakMap.prototype, 'get').returns(data);
      sinon.spy(WeakMap.prototype, 'set');

      store = new Store(input);
    });

    afterEach(() => {
      WeakMap.prototype.get.restore();
      WeakMap.prototype.set.restore();
    });

    it('should properly initialize the private state', () => {
      should(WeakMap.prototype.set).be.calledOnce();

      const args = WeakMap.prototype.set.firstCall.args;
      should(args[0]).be.equal(store);
      should(args[1]).be.eql({
        input,
        output: {},
        errors: {},
        hasErrors: false,
        currentKey: null,
        currentValue: null,
      });
      should(args[1].input).be.equal(input);
    });

    it('should be able to reset the state using a provided key', () => {
      data.output = 'untouched';
      data.errors = 'untouched';
      data.hasErrors = 'untouched';

      store.reset(testKey);

      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to return an input value for the given key', () => {
      data.output = 'untouched';
      data.errors = 'untouched';
      data.hasErrors = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      const result = store.getInput(testKey);

      should(result).be.equal(testValue);
      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to set an output value for the given key', () => {
      const outputKey = 'outputKey';
      const outputValue = 'output value';

      data.errors = 'untouched';
      data.hasErrors = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      store.setOutput(outputKey, outputValue);

      should(data.input).be.equal(input);
      should(data.output).be.eql({
        [outputKey]: outputValue,
      });
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to retrieve a clone of the output object', () => {
      const outputKey = 'outputKey';
      const outputValue = 'output value';

      data.output = {
        [outputKey]: outputValue,
      };
      data.errors = 'untouched';
      data.hasErrors = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      const output = data.output;
      const outputClone = store.output;

      should(output).not.be.equal(outputClone);
      should(output).be.eql(outputClone);

      should(data.input).be.equal(input);
      should(data.output).be.equal(output);
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to add an error message for the current key', () => {
      const message = 'test message';

      data.output = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      store.setError(message);

      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.eql({
        [testKey]: message,
      });
      should(data.hasErrors).be.equal(true);
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to retrieve a clone of the errors object', () => {
      const errorKey = 'errorKey';
      const errorValue = 'error value';

      data.output = 'untouched';
      data.errors = {
        [errorKey]: errorValue,
      };
      data.hasErrors = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      const errors = data.errors;
      const errorsClone = store.errors;

      should(errors).not.be.equal(errorsClone);
      should(errors).be.eql(errorsClone);

      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.equal(errors);
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to retrieve the hasErrors flag', () => {
      const hasErrors = 'test hasErrors';

      data.output = 'untouched';
      data.errors = 'untouched';
      data.hasErrors = hasErrors;
      data.currentKey = testKey;
      data.currentValue = testValue;

      const result = store.hasErrors;

      should(result).be.equal(hasErrors);
      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal(hasErrors);
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to retrieve the current value', () => {
      data.output = 'untouched';
      data.errors = 'untouched';
      data.hasErrors = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      const result = store.currentValue;

      should(result).be.equal(testValue);
      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(testValue);
    });

    it('should be able to set the current value', () => {
      const otherValue = 'test other value';

      data.output = 'untouched';
      data.errors = 'untouched';
      data.hasErrors = 'untouched';
      data.currentKey = testKey;
      data.currentValue = testValue;

      store.currentValue = otherValue;

      should(data.input).be.equal(input);
      should(data.output).be.equal('untouched');
      should(data.errors).be.equal('untouched');
      should(data.hasErrors).be.equal('untouched');
      should(data.currentKey).be.equal(testKey);
      should(data.currentValue).be.equal(otherValue);
    });
  });
});
