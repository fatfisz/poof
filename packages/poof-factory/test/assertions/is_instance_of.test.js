'use strict';

const mockery = require('mockery');
const should = require('should/as-function');


describe('assertions: isInstanceOf', () => {
  let isInstanceOf;

  beforeEach(() => {
    isInstanceOf = require('../../tmp/assertions/is_instance_of');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts two arguments', () => {
    should(isInstanceOf).be.a.Function();
    should(isInstanceOf).have.length(2);
  });

  it('should return `true` or `false` depending on the type match', () => {
    should(isInstanceOf({}, 'object')).be.false();
    should(isInstanceOf({}, Symbol())).be.false();

    // eslint-disable-next-line no-undefined
    should(isInstanceOf(undefined, Object)).be.false();
    should(isInstanceOf(null, Object)).be.false();
    should(isInstanceOf(true, Object)).be.false();
    should(isInstanceOf(false, Object)).be.false();
    should(isInstanceOf(true, Boolean)).be.false();
    should(isInstanceOf(1, Object)).be.false();
    should(isInstanceOf(NaN, Object)).be.false();
    should(isInstanceOf(1, Number)).be.false();
    should(isInstanceOf('some string', Object)).be.false();
    should(isInstanceOf('some string', String)).be.false();
    should(isInstanceOf(Symbol(), Object)).be.false();
    should(isInstanceOf(Symbol(), Symbol)).be.false();

    // eslint-disable-next-line no-undefined
    should(isInstanceOf(true, Boolean)).be.false();
    should(isInstanceOf(false, Boolean)).be.false();
    should(isInstanceOf(1, Number)).be.false();
    should(isInstanceOf(NaN, Number)).be.false();
    should(isInstanceOf('some string', String)).be.false();
    should(isInstanceOf(Symbol(), Symbol)).be.false();

    // eslint-disable-next-line no-new-wrappers
    should(isInstanceOf(new Boolean(true), Object)).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(isInstanceOf(new Boolean(true), Boolean)).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(isInstanceOf(new Number(1), Object)).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(isInstanceOf(new Number(1), Number)).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(isInstanceOf(new String('some string'), Object)).be.true();
    // eslint-disable-next-line no-new-wrappers
    should(isInstanceOf(new String('some string'), String)).be.true();
    should(isInstanceOf(() => {}, Object)).be.true();
    should(isInstanceOf(() => {}, Function)).be.true();
    should(isInstanceOf({}, Object)).be.true();
    should(isInstanceOf([], Object)).be.true();
    should(isInstanceOf([], Array)).be.true();

    function Proto() {}

    should(isInstanceOf(new Proto(), Object)).be.true();
    should(isInstanceOf(new Proto(), Proto)).be.true();

    const obj = Object.create(Proto.prototype);

    should(isInstanceOf(obj, Object)).be.true();
    should(isInstanceOf(obj, Proto)).be.true();
  });
});
