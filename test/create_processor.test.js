'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('createProcessor', () => {
  let createProcessor;
  let Store;
  let store;
  let ValidationError;

  beforeEach(() => {
    Store = function () {
      Object.assign(this, store);
    };
    Store.prototype.reset = function () {};

    store = {};

    ValidationError = sinon.spy();

    mockery.registerMock('./store', Store);
    mockery.registerMock('./validation_error', ValidationError);

    createProcessor = require('../dist/create_processor');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(createProcessor).be.a.Function();
    should(createProcessor).have.length(1);
  });

  it('should return a function that accepts one argument', () => {
    const processor = createProcessor({});

    should(processor).be.a.Function();
    should(processor).have.length(1);
  });

  describe('processor', () => {
    it('should only call processors of enumerable properties', () => {
      const definition = {
        first: sinon.stub(),
        second: sinon.stub(),
        third: sinon.stub(),
      };
      Object.defineProperty(definition, 'non-enumerable', {
        configurable: true,
        enumerable: false,
        value: sinon.spy(),
        writable: true,
      });
      const processor = createProcessor(definition);

      processor({});

      should(definition.first).be.calledOnce();
      should(definition.second).be.calledOnce();
      should(definition.third).be.calledOnce();
      should(definition['non-enumerable']).not.be.called();
    });

    it('should call `store.reset` for each processor', () => {
      function requireResetFor(name) {
        return () => {
          should(wasReset).be.equal(
            true,
            `expected \`store.reset\` to be called before the ${name} processor`
          );
          wasReset = false;
        };
      }

      let wasReset = false;
      const definition = {
        first: requireResetFor('first'),
        second: requireResetFor('second'),
        third: requireResetFor('third'),
      };
      sinon.stub(Store.prototype, 'reset', () => {
        wasReset = true;
      });
      const processor = createProcessor(definition);

      processor({});

      should(Store.prototype.reset).be.calledThrice();
      should(Store.prototype.reset).be.calledWith('first');
      should(Store.prototype.reset).be.calledWith('second');
      should(Store.prototype.reset).be.calledWith('third');
    });

    it('should call processors with a Store object', () => {
      const definition = {
        first: sinon.spy(),
        second: sinon.spy(),
      };
      const processor = createProcessor(definition);

      processor({});

      const instanceOfStore = sinon.match.instanceOf(Store);
      should(definition.first).be.calledWithExactly(instanceOfStore);
      should(definition.second).be.calledWithExactly(instanceOfStore);
    });

    it('should throw ValidationError if `store.hasErrors` returns `true`', () => {
      store.hasErrors = true;
      store.errors = 'test errors';

      const processor = createProcessor({});

      should(() => {
        processor({});
      }).throw(ValidationError);

      should(ValidationError).be.calledOnce();
      should(ValidationError).be.calledWithNew();
      should(ValidationError).be.calledWithExactly('test errors');
    });

    it('should return output if `store.hasErrors` returns `false`', () => {
      store.hasErrors = false;
      store.output = 'test output';

      const processor = createProcessor({});
      let result;

      should(() => {
        result = processor({});
      }).not.throw();

      should(result).be.equal('test output');
    });
  });
});
