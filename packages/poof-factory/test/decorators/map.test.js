'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: map', () => {
  const processorDecorator = 'processor decorator';
  let createProcessorDecorator;
  let map;
  let currentValue;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    map = require('../../tmp/decorators/map');

    currentValue = ['test1', 'test2', 'test3'];

    store = {
      currentValue,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(map).be.a.Function();
    should(map).have.length(1);
  });

  it('should return a result of calling `createProcessorDecorator`', () => {
    const result = map();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    let mapper;
    let processor;

    beforeEach(() => {
      mapper = sinon.spy((item) => `${item}_mapped`);

      map(mapper);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should map the current value with the passed mapper', () => {
      processor(store);

      should(mapper).be.calledThrice();
      should(mapper).be.calledWithExactly('test1', 0, currentValue);
      should(mapper).be.calledWithExactly('test2', 1, currentValue);
      should(mapper).be.calledWithExactly('test3', 2, currentValue);
      should(store.currentValue).be.eql([
        'test1_mapped',
        'test2_mapped',
        'test3_mapped',
      ]);
    });

    it('should not return anything', () => {
      const result = processor(store);

      should(result).be.undefined();
    });
  });
});
