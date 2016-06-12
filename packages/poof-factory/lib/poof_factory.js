import createProcessor from './create_processor.js';
import assign from './decorators/assign.js';
import assignTo from './decorators/assign_to.js';
import filter from './decorators/filter.js';
import fromDecorator from './decorators/from.js';
import ignoreIf from './decorators/ignore_if.js';
import ignoreIfUndefined from './decorators/ignore_if_undefined.js';
import map from './decorators/map.js';
import set from './decorators/set.js';
import transform from './decorators/transform.js';
import getValidatorDecorators from './get_validator_decorators.js';


export default function poofFactory(castToString) {
  return {
    createProcessor,
    decorators: {
      assign,
      assignTo,
      filter,
      from: fromDecorator,
      ignoreIf,
      ignoreIfUndefined,
      map,
      set,
      transform,
      assert: getValidatorDecorators(castToString),
    },
  };
}
