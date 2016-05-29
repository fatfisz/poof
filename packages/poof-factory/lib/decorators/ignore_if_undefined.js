import createProcessorDecorator from '../create_processor_decorator.js';


export default createProcessorDecorator((store) => {
  if (typeof store.currentValue === 'undefined') {
    return false;
  }
});
