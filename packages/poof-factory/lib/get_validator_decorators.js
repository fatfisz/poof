import validator from 'validator';

import createValidatorDecorator from './create_validator_decorator.js';


export default function getValidatorDecorators(castToString) {
  const assert = {
    not: {},
  };

  Object.keys(validator)
    .filter((name) =>
      name === 'contains' ||
      name === 'equals' ||
      name === 'matches' ||
      name.slice(0, 2) === 'is'
    )
    .forEach((validatorName) => {
      const validatorFn = validator[validatorName];
      assert[validatorName] = createValidatorDecorator(validatorFn, false, castToString);
      assert.not[validatorName] = createValidatorDecorator(validatorFn, true, castToString);
    });

  return assert;
}
