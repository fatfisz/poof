export default function createProcessorDecorator(processor) {
  return (target, key, descriptor) => {
    const next = descriptor.value;

    descriptor.value = (options) => {
      if (processor(options, key) !== false) {
        next(options);
      }
    };
  };
}
