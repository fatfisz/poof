'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: ignoreIfUndefined', () => {
  const processorDecorator = 'processor decorator';
  let createProcessorDecorator;
  let ignoreIfUndefined;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator', createProcessorDecorator);

    ignoreIfUndefined = require('../../tmp/decorators/ignore_if_undefined');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a result of calling `createProcessorDecorator`', () => {
    should(ignoreIfUndefined).be.equal(processorDecorator);
  });

  describe('processor', () => {
    let processor;

    beforeEach(() => {
      processor = createProcessorDecorator.args[0][0];
    });

    it('should not return anything if the current value is not undefined', () => {
      const result = processor({
        currentValue: 'something',
      });

      should(result).be.undefined();
    });

    it('should not return anything if the current value is false', () => {
      const result = processor({
        currentValue: false,
      });

      should(result).be.undefined();
    });

    it('should not return anything if the current value is null', () => {
      const result = processor({
        currentValue: null,
      });

      should(result).be.undefined();
    });

    it('should return `false` if the current value is undefined', () => {
      const result = processor({});

      should(result).be.false();
    });
  });
});
