import validator from 'validator';

import hasType from './assertions/has_type.js';
import isInstanceOf from './assertions/is_instance_of.js';
import createValidatorDecorator from './create_validator_decorator.js';


export default function getValidatorDecorators(castToString) {
  const assert = {
    not: {},
  };

  const validatorFunctions = [
    ['hasType', hasType],
    ['isInstanceOf', isInstanceOf],
  ];

  Object.keys(validator)
    .filter((name) =>
      name === 'contains' ||
      name === 'equals' ||
      name === 'matches' ||
      name.slice(0, 2) === 'is'
    )
    .forEach((validatorName) => {
      validatorFunctions.push([validatorName, validator[validatorName]]);
    });

  validatorFunctions.forEach(([validatorName, validatorFn]) => {
    assert[validatorName] = createValidatorDecorator(validatorFn, false, castToString);
    assert.not[validatorName] = createValidatorDecorator(validatorFn, true, castToString);
  });

  return assert;
}
