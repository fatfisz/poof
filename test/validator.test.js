'use strict';

const should = require('should/as-function');


describe('validator - exports check', () => {
  const validatorFunctions = [
    'contains',
    'equals',
    'matches',
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
    'isSurrogatePair',
    'isUppercase',
    'isURL',
    'isUUID',
    'isVariableWidth',
    'isWhitelisted',
    // The keys below are also exported, but are not later included in Poof
    'blacklist',
    'escape',
    'ltrim',
    'normalizeEmail',
    'rtrim',
    'stripLow',
    'toBoolean',
    'toDate',
    'toFloat',
    'toInt',
    'toString',
    'trim',
    'unescape',
    'version',
    'whitelist',
  ];
  let validator;

  beforeEach(() => {
    validator = require('validator');
  });

  it('should have the recognized exports', () => {
    should(validator).have.keys(validatorFunctions);
  });
});
