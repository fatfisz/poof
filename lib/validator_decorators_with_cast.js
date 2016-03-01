import validator from 'validator';

import createValidatorDecorator from './create_validator_decorator';


const assert = {
  not: {},
};
export default assert;

Object.keys(validator)
  .filter((name) =>
    name === 'contains' ||
    name === 'equals' ||
    name === 'matches' ||
    name.slice(0, 2) === 'is'
  )
  .forEach((validatorName) => {
    const validatorFn = validator[validatorName];
    assert[validatorName] = createValidatorDecorator(validatorFn, false, true);
    assert.not[validatorName] = createValidatorDecorator(validatorFn, true, true);
  });
