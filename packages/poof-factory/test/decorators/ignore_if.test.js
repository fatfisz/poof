'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('decorators: ignoreIf', () => {
  const processorDecorator = 'processor decorator';
  let createProcessorDecorator;
  let ignoreIf;

  beforeEach(() => {
    createProcessorDecorator = sinon.stub().returns(processorDecorator);

    mockery.registerMock('../create_processor_decorator.js', createProcessorDecorator);

    ignoreIf = require('../../tmp/decorators/ignore_if');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(ignoreIf).be.a.Function();
    should(ignoreIf).have.length(1);
  });

  it('should be a result of calling `createProcessorDecorator`', () => {
    const result = ignoreIf();

    should(result).be.equal(processorDecorator);
  });

  describe('processor', () => {
    let predicate;
    let processor;

    beforeEach(() => {
      predicate = sinon.stub();
      ignoreIf(predicate);

      processor = createProcessorDecorator.args[0][0];
    });

    it('should call the predicate once with the current value', () => {
      processor({
        currentValue: 'current value',
      });

      should(predicate).be.calledOnce();
      should(predicate).be.calledWithExactly('current value');
    });

    it('should not return anything if the predicate returns `false`', () => {
      predicate.returns(false);

      const result = processor({});

      should(result).be.undefined();
    });

    it('should return `false` if the predicate returns `true`', () => {
      predicate.returns(true);

      const result = processor({});

      should(result).be.false();
    });
  });
});
