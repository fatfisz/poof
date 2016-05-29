'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: assign', () => {
  const processorDecorator = 'processor decorator';
  const currentValue = 'test current';
  let createProcessorDecorator;
  let assign;
  let setOutput;
  let store;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    assign = require('../../tmp/decorators/assign');

    setOutput = sinon.spy();
    store = {
      currentValue,
      setOutput,
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a result of calling `createProcessorDecorator`', () => {
    should(assign).be.equal(processorDecorator);
  });

  describe('processor', () => {
    let processor;

    beforeEach(() => {
      processor = createProcessorDecorator.args[0][0];
    });

    it('should call `store.setOutput` with appropriate arguments', () => {
      const key = 'test key';

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
