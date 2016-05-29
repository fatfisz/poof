'use strict';

const mockery = require('mockery');
const should = require('should/as-function');


describe('assertions: hasType', () => {
  let hasType;

  beforeEach(() => {
    hasType = require('../../tmp/assertions/has_type');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts two arguments', () => {
    should(hasType).be.a.Function();
    should(hasType).have.length(2);
  });

  it('should return `true` or `false` depending on the type match', () => {
    // eslint-disable-next-line no-undefined
    should(hasType(undefined, 'undefined')).be.true();

    should(hasType(true, 'boolean')).be.true();
    should(hasType(false, 'boolean')).be.true();
    should(hasType(false, 'boolean')).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(hasType(new Boolean(true), 'object')).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(hasType(new Boolean(true), 'boolean')).be.false();

    should(hasType(1, 'number')).be.true();
    should(hasType(NaN, 'number')).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(hasType(new Number(1), 'object')).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(hasType(new Number(1), 'number')).be.false();

    should(hasType('some string', 'string')).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(hasType(new String('some string'), 'object')).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(hasType(new String('some string'), 'string')).be.false();

    should(hasType(Symbol(), 'symbol')).be.true();
    should(hasType(Symbol('some string'), 'symbol')).be.true();
    should(hasType(Symbol.for('some string'), 'symbol')).be.true();

    should(hasType(() => {}, 'function')).be.true();

    should(hasType({}, 'object')).be.true();
    should(hasType([], 'object')).be.true();
    should(hasType(null, 'object')).be.true();
  });
});
