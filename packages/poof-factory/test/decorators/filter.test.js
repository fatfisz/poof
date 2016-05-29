'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: filter', () => {
  const processorDecorator = 'processor decorator';
  let createProcessorDecorator;
  let filter;
  let currentValue;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    filter = require('../../tmp/decorators/filter');

    currentValue = ['test1', 'test2', 'test3'];

    store = {
      currentValue,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(filter).be.a.Function();
    should(filter).have.length(1);
  });

  it('should return a result of calling `createProcessorDecorator`', () => {
    const result = filter();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    let predicate;
    let processor;

    beforeEach(() => {
      predicate = sinon.spy((item, index) => index % 2 === 0);

      filter(predicate);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should filter the current value with the passed predicate', () => {
      processor(store);

      should(predicate).be.calledThrice();
      should(predicate).be.calledWithExactly('test1', 0, currentValue);
      should(predicate).be.calledWithExactly('test2', 1, currentValue);
      should(predicate).be.calledWithExactly('test3', 2, currentValue);
      should(store.currentValue).be.eql(['test1', 'test3']);
    });

    it('should not return anything', () => {
      const result = processor(store);

      should(result).be.undefined();
    });
  });
});
