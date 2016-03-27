import createProcessorDecorator from '../create_processor_decorator';


export default (transformer) =>
  createProcessorDecorator((store) => {
    store.currentValue = transformer(store.currentValue);
  });
