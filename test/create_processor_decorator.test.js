'use strict';

const should = require('should/as-function');
const sinon = require('sinon');

const createProcessorDecorator = require('../dist/create_processor_decorator');


describe('createProcessorDecorator', () => {
  it('should be a function', () => {
    should(createProcessorDecorator).be.a.Function();
  });

  it('should accept one argument', () => {
    should(createProcessorDecorator).have.length(1);
  });

  it('should return a decorator function', () => {
    const decorator = createProcessorDecorator();

    should(decorator).be.a.Function;
    should(decorator).have.length(3);
  });

  it('should set the value of the descriptor to a new function', () => {
    const decorator = createProcessorDecorator();
    const descriptor = {};

    decorator({}, '', descriptor);

    should(descriptor).have.keys('value');
    should(descriptor.value).be.a.Function();
  });

  describe('new value', () => {
    const target = null;
    const key = 'test key';
    let processor;
    let prevValue;
    let nextValue;
    let store;

    beforeEach(() => {
      processor = sinon.stub();
      const decorator = createProcessorDecorator(processor);
      prevValue = sinon.spy();
      const descriptor = {
        value: prevValue,
      };
      decorator(target, key, descriptor);
      nextValue = descriptor.value;
      store = {};
    });

    it('should accept one argument', () => {
      should(nextValue).have.length(1);
    });

    it('should call the processor with the store and the key', () => {
      nextValue(store);

      should(processor).be.calledOnce();
      should(processor).be.calledWithExactly(store, key);
    });

    it('should call the previous value if processor returns a truthy value', () => {
      processor.returns(true);

      nextValue(store);

      should(prevValue).be.calledOnce();
      should(prevValue).be.calledWithExactly(store);
    });

    it('should call the previous value if processor doesn\'t return false explicitly', () => {
      processor.returns(null);

      nextValue(store);

      should(prevValue).be.calledOnce();
      should(prevValue).be.calledWithExactly(store);
    });

    it('shouldn\'t call the previous value if processor returns false', () => {
      processor.returns(false);

      nextValue(store);

      should(prevValue).not.be.called();
    });
  });
});
