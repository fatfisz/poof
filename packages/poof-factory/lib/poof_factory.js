import createProcessor from './create_processor';
import assign from './decorators/assign';
import fromDecorator from './decorators/from';
import ignoreIf from './decorators/ignore_if';
import ignoreIfUndefined from './decorators/ignore_if_undefined';
import set from './decorators/set';
import transform from './decorators/transform';
import getValidatorDecorators from './get_validator_decorators';
import ValidationError from './validation_error';


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
    ValidationError,
  };
}
