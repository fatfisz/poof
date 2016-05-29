import createProcessorDecorator from '../create_processor_decorator.js';


export default (value) =>
  createProcessorDecorator((store) => {
    store.currentValue = value;
  });
