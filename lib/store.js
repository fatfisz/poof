const privateData = new WeakMap();

export default class Store {
  constructor(input) {
    privateData.set(this, {
      input,
      output: {},
      errors: {},
      hasErrors: false,
      currentKey: null,
      currentValue: null,
    });
  }

  reset(key) {
    const data = privateData.get(this);
    data.currentKey = key;
    data.currentValue = data.input[key];
  }

  getInput(key) {
    return privateData.get(this).input[key];
  }

  setOutput(key, value) {
    privateData.get(this).output[key] = value;
  }

  get output() {
    return { ...privateData.get(this).output };
  }

  setError(message) {
    const data = privateData.get(this);
    data.errors[data.currentKey] = message;
    data.hasErrors = true;
  }

  get errors() {
    return { ...privateData.get(this).errors };
  }

  get hasErrors() {
    return privateData.get(this).hasErrors;
  }

  get currentValue() {
    return privateData.get(this).currentValue;
  }

  set currentValue(value) {
    privateData.get(this).currentValue = value;
  }
}
