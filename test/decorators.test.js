'use strict';

const should = require('should/as-function');
const sinon = require('sinon');

const decorators = require('../dist/decorators');
const assert = require('../dist/validator_decorators');


describe('decorators', () => {
  it('should have appropriate exports', () => {
    should(decorators).have.keys([
      'assert',
      'assign',
      'from',
      'ignoreIfUndefined',
      'set',
      'transform',
    ]);
    should(decorators.assert).be.equal(
      assert,
      'expected decorators.assert to have the right value'
    );
  });

  describe('custom decorators', () => {
    const target = null;
    const key = 'test key';
    const currentValue = 'test current';
    let descriptor;
    let next;
    let getCurrentValue;
    let setCurrentValue;
    let store;

    beforeEach(() => {
      descriptor = {
        value: sinon.spy(),
      };
      next = descriptor.value;
      getCurrentValue = sinon.stub().returns(currentValue);
      setCurrentValue = sinon.spy();
      store = {
        getInput: sinon.stub(),
        setOutput: sinon.stub(),
        get currentValue() {
          return getCurrentValue();
        },
        set currentValue(value) {
          setCurrentValue(value);
        },
        setError: sinon.spy(),
      };
    });

    describe('assign', () => {
      let processor;

      beforeEach(() => {
        const decorator = decorators.assign;
        decorator(target, key, descriptor);
        processor = descriptor.value;
      });

      it('should call store.setOutput with the key and the current value', () => {
        processor(store);

        should(getCurrentValue).be.calledOnce();
        should(setCurrentValue).not.be.called();
        should(store.setError).not.be.called();
        should(next).be.called();
        should(store.setOutput).be.calledOnce();
        should(store.setOutput).be.calledWithExactly(key, currentValue);
      });
    });

    describe('from', () => {
      const fromKey = 'from key';
      const inputValue = 'input value';
      let processor;

      beforeEach(() => {
        const decorator = decorators.from(fromKey);
        decorator(target, key, descriptor);
        processor = descriptor.value;
      });

      it('should set the current value to input[key]', () => {
        store.getInput.returns(inputValue);

        processor(store);

        should(getCurrentValue).not.be.called();
        should(setCurrentValue).be.calledOnce();
        should(setCurrentValue).be.calledWithExactly(inputValue);
        should(store.setError).not.be.called();
        should(next).be.called();
        should(store.setOutput).not.be.called();
      });
    });


    describe('ignoreIfUndefined', () => {
      let processor;

      beforeEach(() => {
        const decorator = decorators.ignoreIfUndefined;
        decorator(target, key, descriptor);
        processor = descriptor.value;
      });

      it('should not call next if the current value is undefined', () => {
        getCurrentValue.returns();

        processor(store);

        should(getCurrentValue).be.calledOnce();
        should(setCurrentValue).not.be.called();
        should(store.setError).not.be.called();
        should(next).not.be.called();
        should(store.setOutput).not.be.called();
      });

      it('should call next if the current value is not undefined', () => {
        processor(store);

        should(getCurrentValue).be.calledOnce();
        should(setCurrentValue).not.be.called();
        should(store.setError).not.be.called();
        should(next).be.calledOnce();
        should(store.setOutput).not.be.called();
      });
    });


    describe('set', () => {
      const targetValue = 'target value';
      let processor;

      beforeEach(() => {
        const decorator = decorators.set(targetValue);
        decorator(target, key, descriptor);
        processor = descriptor.value;
      });

      it('should set the current value to the provided one', () => {
        processor(store);

        should(getCurrentValue).not.be.called();
        should(setCurrentValue).be.calledOnce();
        should(setCurrentValue).be.calledWithExactly(targetValue);
        should(store.setError).not.be.called();
        should(next).be.called();
        should(store.setOutput).not.be.called();
      });
    });


    describe('transform', () => {
      const transformedValue = 'transformed value';
      let transformer;
      let processor;

      beforeEach(() => {
        transformer = sinon.stub().returns(transformedValue);
        const decorator = decorators.transform(transformer);
        decorator(target, key, descriptor);
        processor = descriptor.value;
      });

      it('should transform the current value using the transformer', () => {
        processor(store);

        should(getCurrentValue).be.calledOnce();
        should(transformer).be.calledOnce();
        should(transformer).be.calledWithExactly(currentValue);
        should(setCurrentValue).be.calledOnce();
        should(setCurrentValue).be.calledWithExactly(transformedValue);
        should(store.setError).not.be.called();
        should(next).be.called();
        should(store.setOutput).not.be.called();
      });
    });
  });
});
