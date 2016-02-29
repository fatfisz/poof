'use strict';

const should = require('should/as-function');
const sinon = require('sinon');

const assert = require('../dist/validator_decorators');


describe('assert (validator decorators)', () => {
  const validatorExports = [
    'contains',
    'equals',
    'isAfter',
    'isAlpha',
    'isAlphanumeric',
    'isAscii',
    'isBase64',
    'isBefore',
    'isBoolean',
    'isByteLength',
    'isCreditCard',
    'isCurrency',
    'isDate',
    'isDecimal',
    'isDivisibleBy',
    'isEmail',
    'isFloat',
    'isFQDN',
    'isFullWidth',
    'isHalfWidth',
    'isHexadecimal',
    'isHexColor',
    'isIn',
    'isInt',
    'isIP',
    'isISBN',
    'isISIN',
    'isISO8601',
    'isJSON',
    'isLength',
    'isLowercase',
    'isMACAddress',
    'isMobilePhone',
    'isMongoId',
    'isMultibyte',
    'isNull',
    'isNumeric',
    'isServerSide',
    'isSurrogatePair',
    'isUppercase',
    'isURL',
    'isUUID',
    'isVariableWidth',
    'isWhitelisted',
    'matches',
  ];

  it('should have appropriate exports', () => {
    should(assert).have.keys(validatorExports.concat(['not']));
    should(assert.not).have.keys(validatorExports);
  });

  describe('decorator sample (equals)', () => {
    const target = null;
    const key = 'test key';
    const testedValue = 'tested value';
    const otherValue = 'other value';
    let next;
    let processor;
    let getCurrentValue;
    let store;

    beforeEach(() => {
      const descriptor = {
        value: sinon.spy(),
      };
      next = descriptor.value;
      const decorator = assert.equals('message', testedValue);
      decorator(target, key, descriptor);
      processor = descriptor.value;
      getCurrentValue = sinon.stub();
      store = {
        get currentValue() {
          return getCurrentValue();
        },
        setError: sinon.spy(),
      };
    });

    it('should not set an error and call `next` when the arguments match', () => {
      getCurrentValue.returns(testedValue);

      processor(store);

      should(store.setError).not.be.called();
      should(next).be.called();
    });

    it('should set an error and not call `next` when the arguments mismatch', () => {
      getCurrentValue.returns(otherValue);

      processor(store);

      should(store.setError).be.called();
      should(next).not.be.called();
    });
  });

  describe('decorator sample (not.equals)', () => {
    const target = null;
    const key = 'test key';
    const testedValue = 'tested value';
    const otherValue = 'other value';
    let next;
    let processor;
    let getCurrentValue;
    let store;

    beforeEach(() => {
      const descriptor = {
        value: sinon.spy(),
      };
      next = descriptor.value;
      const decorator = assert.not.equals('message', testedValue);
      decorator(target, key, descriptor);
      processor = descriptor.value;
      getCurrentValue = sinon.stub();
      store = {
        get currentValue() {
          return getCurrentValue();
        },
        setError: sinon.spy(),
      };
    });

    it('should not set an error and call `next` when the arguments mismatch', () => {
      getCurrentValue.returns(otherValue);

      processor(store);

      should(store.setError).not.be.called();
      should(next).be.called();
    });

    it('should set an error and not call `next` when the arguments match', () => {
      getCurrentValue.returns(testedValue);

      processor(store);

      should(store.setError).be.called();
      should(next).not.be.called();
    });
  });
});
