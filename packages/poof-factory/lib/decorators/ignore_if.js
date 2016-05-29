import createProcessorDecorator from '../create_processor_decorator.js';


export default (predicate) =>
  createProcessorDecorator((store) => {
    if (predicate(store.currentValue)) {
      return false;
    }
  });
