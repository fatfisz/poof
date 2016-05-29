'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: set', () => {
  const processorDecorator = 'processor decorator';
  const currentValue = 'test current';
  let createProcessorDecorator;
  let set;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    set = require('../../tmp/decorators/set');

    store = {
      currentValue,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(set).be.a.Function();
    should(set).have.length(1);
  });

  it('should return a result of calling `createProcessorDecorator`', () => {
    const result = set();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    const value = 'test value';
    let processor;

    beforeEach(() => {
      set(value);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should set the current value to the passed value', () => {
      processor(store);

      should(store.currentValue).be.equal(value);
    });

    it('should not return anything', () => {
      const result = processor(store);

      should(result).be.undefined();
    });
  });
});
