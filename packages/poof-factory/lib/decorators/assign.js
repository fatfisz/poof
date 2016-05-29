import createProcessorDecorator from '../create_processor_decorator.js';


export default createProcessorDecorator((store, key) => {
  store.setOutput(key, store.currentValue);
});
