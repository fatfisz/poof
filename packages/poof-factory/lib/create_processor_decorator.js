export default function createProcessorDecorator(processor) {
  return (target, key, descriptor) => {
    const next = descriptor.value;

    descriptor.value = (store) => {
      if (processor(store, key) !== false) {
        next(store);
      }
    };
  };
}
