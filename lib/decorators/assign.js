import createProcessorDecorator from '../create_processor_decorator';


export default createProcessorDecorator((store, key) => {
  store.setOutput(key, store.currentValue);
});
