import { currentValue, hasErrors } from './symbols';
import ValidationError from './valiation_error';


export default function createProcessor(definition) {
  const processors = Object.keys(definition)
    .map((outputKey) => {
      const propertyProcessor = definition[outputKey];
      return (options) => {
        // Initially the value is taken from the input object using the same key
        // as the one that the currently processed property has.
        options[currentValue] = options.input[outputKey];
        propertyProcessor(options);
      };
    });

  return (input) => {
    const options = {
      input,
      [currentValue]: null,
      output: {},
      errors: {},
      [hasErrors]: false,
    };

    processors.forEach((propertyProcessor) => {
      propertyProcessor(options);
    });

    if (options[hasErrors]) {
      throw new ValidationError(options.errors);
    }

    return options.output;
  };
}
