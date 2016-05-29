import createProcessor from './create_processor.js';
import assign from './decorators/assign.js';
import fromDecorator from './decorators/from.js';
import ignoreIf from './decorators/ignore_if.js';
import ignoreIfUndefined from './decorators/ignore_if_undefined.js';
import set from './decorators/set.js';
import transform from './decorators/transform.js';
import getValidatorDecorators from './get_validator_decorators.js';


export default function poofFactory(castToString) {
  return {
    createProcessor,
    decorators: {
      assign,
      from: fromDecorator,
      ignoreIf,
      ignoreIfUndefined,
      set,
      transform,
      assert: getValidatorDecorators(castToString),
    },
  };
}
