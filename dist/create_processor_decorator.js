"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createProcessorDecorator;

function createProcessorDecorator(processor) {
  return function (target, key, descriptor) {
    var next = descriptor.value;

    descriptor.value = function (store) {
      if (processor(store, key) !== false) {
        next(store);
      }
    };
  };
}

module.exports = exports["default"];
