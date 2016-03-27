import createProcessorDecorator from '../create_processor_decorator';


export default (value) =>
  createProcessorDecorator((store) => {
    store.currentValue = value;
  });
