import createProcessorDecorator from '../create_processor_decorator.js';


export default (key) =>
  createProcessorDecorator((store) => {
    store.currentValue = store.getInput(key);
  });
