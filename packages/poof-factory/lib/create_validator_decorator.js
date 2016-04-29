import { toString } from 'validator';

import createProcessorDecorator from './create_processor_decorator';


export default function createValidatorDecorator(validatorFn, expected, castToString) {
  return (message, ...args) => {
    if (!message) {
      throw new TypeError('The `message` argument is required');
    }

    return createProcessorDecorator((store) => {
      const { currentValue } = store;
      const cleanValue = castToString ?
        toString(currentValue) :
        currentValue;

      if (validatorFn(...[cleanValue, ...args]) === expected) {
        store.setError(message);
        return false;
      }
    });
  };
}
