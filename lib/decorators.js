import createProcessorDecorator from './create_processor_decorator';


export const assign = createProcessorDecorator((store, key) => {
  store.setOutput(key, store.currentValue);
});

export const from = (key) =>
  createProcessorDecorator((store) => {
    store.currentValue = store.getInput(key);
  });

export const ignoreIfUndefined = createProcessorDecorator((store) => {
  if (typeof store.currentValue === 'undefined') {
    return false;
  }
});

export const set = (value) =>
  createProcessorDecorator((store) => {
    store.currentValue = value;
  });

export const transform = (transformer) =>
  createProcessorDecorator((store) => {
    store.currentValue = transformer(store.currentValue);
  });
