import createProcessorDecorator from '../create_processor_decorator.js';


export default (key) =>
  createProcessorDecorator((store) => {
    store.setOutput(key, store.currentValue);
  });
