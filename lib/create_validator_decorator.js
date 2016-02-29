import createProcessorDecorator from './create_processor_decorator';


export default function createValidatorDecorator(validatorFn, expected) {
  return (message, ...args) =>
    createProcessorDecorator((store) => {
      if (validatorFn(...[store.currentValue, ...args]) === expected) {
        store.setError(message);
        return false;
      }
    });
}
