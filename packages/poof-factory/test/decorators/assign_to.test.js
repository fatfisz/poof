'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: assignTo', () => {
  const processorDecorator = 'processor decorator';
  const currentValue = 'test current';
  let createProcessorDecorator;
  let assignToDecorator;
  let setOutput;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    assignToDecorator = require('../../tmp/decorators/assign_to');

    setOutput = sinon.spy();
    store = {
      currentValue,
      setOutput,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(assignToDecorator).be.a.Function();
    should(assignToDecorator).have.length(1);
  });

  it('should return a result of calling `createProcessorDecorator`', () => {
    const result = assignToDecorator();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    const key = 'test key';
    let processor;

    beforeEach(() => {
      assignToDecorator(key);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should call `store.setOutput` with appropriate arguments', () => {
      processor(store, key);

      should(setOutput).be.calledOnce();
      should(setOutput).be.calledWithExactly(key, currentValue);
    });

    it('should not return anything', () => {
      const result = processor(store);

      should(result).be.undefined();
    });
  });
});
