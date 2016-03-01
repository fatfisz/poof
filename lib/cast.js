import createProcessor from './create_processor';
import * as decorators from './decorators';
import ValidationError from './validation_error';
import validatorDecoratorsWithCast from './validator_decorators_with_cast';


const decoratorsFixed = {
  ...decorators,
  assert: validatorDecoratorsWithCast,
};

export { createProcessor, decoratorsFixed as decorators, ValidationError };
