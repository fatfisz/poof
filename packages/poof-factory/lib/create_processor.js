import FieldValidationError from 'field-validation-error';

import Store from './store.js';


export default function createProcessor(definition) {
  const processors = Object.keys(definition)
    .map((outputKey) => {
      const propertyProcessor = definition[outputKey];
      return (store) => {
        // Initially the value is taken from the input object using the same key
        // as the one that the currently processed property has.
        store.reset(outputKey);
        propertyProcessor(store);
      };
    });

  return (input) => {
    const store = new Store(input);

    processors.forEach((propertyProcessor) => {
      propertyProcessor(store);
    });

    if (store.hasErrors) {
      throw new FieldValidationError(store.errors);
    }

    return store.output;
  };
}
