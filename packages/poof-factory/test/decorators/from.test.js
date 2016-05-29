'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: from', () => {
  const processorDecorator = 'processor decorator';
  const currentValue = 'test current';
  const getInputResult = 'getInput result';
  let createProcessorDecorator;
  let fromDecorator;
  let getInput;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    fromDecorator = require('../../tmp/decorators/from');

    getInput = sinon.stub().returns(getInputResult);
    store = {
      currentValue,
      getInput,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(fromDecorator).be.a.Function();
    should(fromDecorator).have.length(1);
  });

  it('should return a result of calling `createProcessorDecorator`', () => {
    const result = fromDecorator();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    const key = 'test key';
    let processor;

    beforeEach(() => {
      fromDecorator(key);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should call `store.getInput` with appropriate arguments', () => {

      processor(store, key);

      should(getInput).be.calledOnce();
      should(getInput).be.calledWithExactly(key);
      should(store.currentValue).be.equal(getInputResult);
    });

    it('should not return anything', () => {
      const result = processor(store);

      should(result).be.undefined();
    });
  });
});
