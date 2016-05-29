import createProcessorDecorator from '../create_processor_decorator.js';


export default (predicate) =>
  createProcessorDecorator((store) => {
    store.currentValue = store.currentValue.filter(predicate);
  });
