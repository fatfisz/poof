import validator from 'validator';

import createProcessorDecorator from './create_processor_decorator';
import { currentValue, hasErrors } from './symbols';


const assert = {
  not: {},
};
export default assert;

function getValidatorDecorator(validatorName) {
  const validatorFn = validator[validatorName];

  return (message, ...args) =>
    createProcessorDecorator((options, key) => {
      const value = options[currentValue];
      const result = validatorFn(...[value, ...args]);
      if (!result) {
        options[hasErrors] = true;
        options.errors[key] = message;
        return false;
      }
    });
}

function getNegatedValidatorDecorator(validatorName) {
  const validatorFn = validator[validatorName];

  return (message, ...args) =>
    createProcessorDecorator((options, key) => {
      const value = options[currentValue];
      const result = validatorFn(...[value, ...args]);
      if (result) {
        options[hasErrors] = true;
        options.errors[key] = message;
        return false;
      }
    });
}

Object.keys(validator)
  .filter((name) =>
    name === 'contains' ||
    name === 'equals' ||
    name === 'matches' ||
    name.slice(0, 2) === 'is'
  )
  .forEach((validatorName) => {
    assert[validatorName] = getValidatorDecorator(validatorName);
    assert.not[validatorName] = getNegatedValidatorDecorator(validatorName);
  });
