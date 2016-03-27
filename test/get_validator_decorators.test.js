'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('getValidatorDecorators)', () => {
  const castToString = 'cast to string';
  let validator;
  let createValidatorDecorator;
  let getValidatorDecorators;

  beforeEach(() => {
    validator = Object.freeze({
      contains: 'contains',
      equals: 'equals',
      matches: 'matches',
      isSomething1: 'isSomething1',
      isSomething2: 'isSomething2',
      isSomething3: 'isSomething3',
      apple: 'apple',
      banana: 'banana',
      coconut: 'coconut',
      containsNo: 'containsNo',
      equalsNuhUh: 'equalsNuhUh',
      matchesNaaah: 'matchesNaaah',
    });
    createValidatorDecorator = sinon.spy(
      (validatorFn, expected) => `${validatorFn} - ${expected}`
    );

    mockery.registerMock('validator', validator);
    mockery.registerMock('./create_validator_decorator', createValidatorDecorator);

    getValidatorDecorators = require('../dist/get_validator_decorators');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a function that accepts one argument', () => {
    should(getValidatorDecorators).be.a.Function();
    should(getValidatorDecorators).have.length(1);
  });

  it('should return an appropriate object', () => {
    const result = getValidatorDecorators(castToString);

    should(createValidatorDecorator).have.callCount(12);
    should(createValidatorDecorator).be.calledWithExactly('contains', false, castToString);
    should(createValidatorDecorator).be.calledWithExactly('contains', true, castToString);
    should(createValidatorDecorator).be.calledWithExactly('equals', false, castToString);
    should(createValidatorDecorator).be.calledWithExactly('equals', true, castToString);
    should(createValidatorDecorator).be.calledWithExactly('matches', false, castToString);
    should(createValidatorDecorator).be.calledWithExactly('matches', true, castToString);
    should(createValidatorDecorator).be.calledWithExactly('isSomething1', false, castToString);
    should(createValidatorDecorator).be.calledWithExactly('isSomething1', true, castToString);
    should(createValidatorDecorator).be.calledWithExactly('isSomething2', false, castToString);
    should(createValidatorDecorator).be.calledWithExactly('isSomething2', true, castToString);
    should(createValidatorDecorator).be.calledWithExactly('isSomething3', false, castToString);
    should(createValidatorDecorator).be.calledWithExactly('isSomething3', true, castToString);

    should(result).be.eql({
      contains: 'contains - false',
      equals: 'equals - false',
      matches: 'matches - false',
      isSomething1: 'isSomething1 - false',
      isSomething2: 'isSomething2 - false',
      isSomething3: 'isSomething3 - false',
      not: {
        contains: 'contains - true',
        equals: 'equals - true',
        matches: 'matches - true',
        isSomething1: 'isSomething1 - true',
        isSomething2: 'isSomething2 - true',
        isSomething3: 'isSomething3 - true',
      },
    });
  });
});
