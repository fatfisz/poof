'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: transform', () => {
  const processorDecorator = 'processor decorator';
  const currentValue = 'test current';
  let createProcessorDecorator;
  let transform;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    transform = require('../../tmp/decorators/transform');

    store = {
      currentValue,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(transform).be.a.Function();
    should(transform).have.length(1);
  });

  it('should return a result of calling `createProcessorDecorator`', () => {
    const result = transform();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    const transformerResult = 'transformer result';
    let transformer;
    let processor;

    beforeEach(() => {
      transformer = sinon.stub().returns(transformerResult);

      transform(transformer);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should transform the current value with the passed transformer', () => {
      processor(store);

      should(transformer).be.calledOnce();
      should(transformer).be.calledWithExactly(currentValue);
      should(store.currentValue).be.equal(transformerResult);
    });

    it('should not return anything', () => {
      const result = processor(store);

      should(result).be.undefined();
    });
  });
});
