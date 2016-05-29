import createProcessorDecorator from '../create_processor_decorator.js';


export default (mapper) =>
  createProcessorDecorator((store) => {
    store.currentValue = store.currentValue.map(mapper);
  });
