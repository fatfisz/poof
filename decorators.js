import createProcessorDecorator from './create_processor_decorator';
import { currentValue } from './symbols';
export { default as assert } from './validator_decorators';


export const assign = createProcessorDecorator((options, key) => {
  options.output[key] = options[currentValue];
});

export const from = (which) =>
  createProcessorDecorator((options) => {
    options[currentValue] = options.input[which];
  });

export const ignoreIf = (predicate) =>
  createProcessorDecorator((options) => {
    if (predicate(options[currentValue])) {
      return false;
    }
  });

export const set = (value) =>
  createProcessorDecorator((options) => {
    options[currentValue] = value;
  });

export const transform = (transformer) =>
  createProcessorDecorator((options) => {
    options[currentValue] = transformer(options[currentValue]);
  });
