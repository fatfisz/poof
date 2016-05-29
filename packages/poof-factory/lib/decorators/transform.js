import createProcessorDecorator from '../create_processor_decorator.js';


export default (transformer) =>
  createProcessorDecorator((store) => {
    store.currentValue = transformer(store.currentValue);
  });
