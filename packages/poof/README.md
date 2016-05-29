# Poof

> Simple data processing with decorators

[![Build Status](https://travis-ci.org/fatfisz/poof.svg?branch=master)](https://travis-ci.org/fatfisz/poof)
[![Dependency Status](https://david-dm.org/fatfisz/poof.svg?path=packages/poof)](https://david-dm.org/fatfisz/poof?path=packages/poof)
[![devDependency Status](https://david-dm.org/fatfisz/poof/dev-status.svg?path=packages/poof)](https://david-dm.org/fatfisz/poof?path=packages/poof#info=devDependencies)

Poof is a tool for creating data processing functions in a declarative way by utilising an upcoming JS feature - decorators.

It makes use of the awesome [validator](https://www.npmjs.com/package/validator) lib to provide assertion functions. Without it Poof probably wouldn't exist.

## Contents

- [Getting started](#getting-started)
- [Why use Poof?](#why-use-poof)
- [Example](#example)
- [Example explained](#example-explained)
- [The difference between poof and poof-cast](#the-difference-between-poof-and-poof-cast)
- [API](#api)
  - [createProcessor(config)](#createprocessorconfig)
  - [decorators](#decorators)
    - [decorators.assert.method and decorators.assert.not.method](#decoratorsassertmethod-and-decoratorsassertnotmethod)
    - [decorators.assert.hasType and decorators.assert.not.hasType](#decoratorsasserthastype-and-decoratorsassertnothastype)
    - [decorators.assert.isInstanceOf and decorators.assert.not.isInstanceOf](#decoratorsassertisinstanceof-and-decoratorsassertnotisinstanceof)
    - [decorators.assign](#decoratorsassign)
    - [decorators.filter(predicate)](#decoratorsfilterpredicate)
    - [decorators.from(key)](#decoratorsfromkey)
    - [decorators.ignoreIf(predicate)](#decoratorsignoreifpredicate)
    - [decorators.ignoreIfUndefined](#decoratorsignoreifundefined)
    - [decorators.map(mapper)](#decoratorsmapmapper)
    - [decorators.set(value)](#decoratorssetvalue)
    - [decorators.transform(transformer)](#decoratorstransformtransformer)
- [Some questions you might have](#some-questions-you-might-have)
  - [How can I use decorators in my code?](#how-can-i-use-decorators-in-my-code)
  - [Why the explicit assignment decorator?](#why-the-explicit-assignment-decorator)
  - [What about nested structures?](#what-about-nested-structures)
  - [Why is the field error exception a separate package?](#why-is-the-field-error-exception-a-separate-package)
- [Be careful with decorators!](#be-careful-with-decorators)
- [Contributing](#contributing)
- [License](#license)

## Getting started

Install the `poof` package with this command:
```shell
npm install poof field-validation-error --save
```
and/or install the `poof-cast` package with this command:
```shell
npm install poof-cast field-validation-error -save
```

`field-validation-error` is a peer dependency of both `poof` packages.

### ES6 Data Structures

Poof makes use of ES6 data structures, e.g. `WeakMap`, but doesn't include any polyfill.
Make sure you add a polyfill yourself if you want to support older browsers.

## Why use Poof?

- it lets you describe data processing in a straightforward, declarative way
- it is especially useful for isomorphic websites - you can declare data validator once and use it both on the client-side and the on the server-side
- Poof processors are composable - you can pass the result from one processor to another, e.g. when you want to separate validation and transforming

## Example

```js
import FieldValidationError from 'field-validation-error';
import { createProcessor, decorators } from 'poof-cast';

const processIdAndIndex = createProcessor({
  @decorators.from('postId')
  @decorators.assert.not.isNull('Missing post id')
  @decorators.assert.isMongoId('Invalid id')
  @decorators.transform(ObjectID)
  @decorators.assign
  _id() {},

  @decorators.assert.not.isNull('Missing index')
  @decorators.assert.isInt('Invalid index', { min: 0 })
  @decorators.transform(Number)
  @decorators.assign
  index() {},
});

try {
  const result = processIdAndIndex(request.body);

  // Do something with the result...
} catch(error) {
  if (error instanceof FieldValidationError) {
    // Do something with error messages contained in `error.fields`
  }
}
```

## Example explained

Poof library has two versions: [`poof`, and `poof-cast`](#the-difference-between-poof-and-poof-cast). Both of them have two exports: the [`createProcessor` function](#createprocessorconfig) and the [`decorators` object](#decorators).

```js
// First import the FieldValidationError and also tools from Poof. The
// `poof-cast` version additionaly casts data to String for assertions. More
// about it later.
import FieldValidationError from 'field-validation-error';
import { createProcessor, decorators } from 'poof-cast';

// The `createProcessor` function returns a processor based on the passed
// config object.
const processIdAndIndex = createProcessor({

  // This decorator tells to pick the data from the `postId` property of
  // a passed object.
  @decorators.from('postId')

  // This decorator checks if the value is empty; if not, the error for this
  // field is set to 'Missing post id' and this field's processing stops here.
  @decorators.assert.not.isNull('Missing post id')

  // Similarly, check if the value is a MongoDB id.
  @decorators.assert.isMongoId('Invalid id')

  // This decorator takes a function and uses it to transforms the value.
  // In this case the ObjectID constructor is used.
  @decorators.transform(ObjectID)

  // If you want to have the result of the processing contained in the result
  // object, you have to do it explicitly with the `assign` decorator.
  @decorators.assign

  // This defines the output property which will have the processed value.
  _id() {},


  // Assert that the value is not empty.
  @decorators.assert.not.isNull('Missing index')

  // Assert that the value is an integer, with a value of at least 0.
  @decorators.assert.isInt('Invalid index', { min: 0 })

  // Cast to Number
  @decorators.transform(Number)

  // Pass to the output
  @decorators.assign

  // The result will land in the `index` property.
  // Note that here we initially get the value from the `index` property, so
  // the `from` decorator is not needed.
  index() {},
});


try {
  // Now the processor can be used with an object.
  const result = processIdAndIndex(request.body);

  // Do something with the result...
} catch(error) {
  if (error instanceof FieldValidationError) {
    // Do something with error messages contained in `error.fields`
  }
}
```

So if `request.body` is:
```js
{
  postId: '507f1f77bcf86cd799439011',
  index: '12',
}
```
then `result` would be:
```js
{
  _id: ObjectID('507f1f77bcf86cd799439011'),
  index: 12,
}
```

If instead `request.body` is:
```js
{
  index: '-1',
}
```
then you'd get a `FieldValidationError` with the `fields` property equal to:
```js
{
  _id: 'Missing post id',
  index: 'Invalid index',
}
```

## The difference between poof and poof-cast

While `poof` passes processed data for asserts without change, `poof-cast` casts it to string beforehand. The casting works the same as default JS string casting, with this exception: `null`, `undefined`, and `NaN` become `''` (empty string).

This is quite useful for parsing request bodies which usually consist of strings - missing fields assume the value of `''` when auto-casting is on. Because of this `decorators.assert.isNull` from `poof-cast` can be used to check both for field presence and whether the value is a non-empty string. This of course reduces otherwise necessary boilerplate code.

The [validator](https://www.npmjs.com/package/validator) library used to make the casting by itself before v. 5. Now it instead throws when the passed argument is not a string. Those exceptions can be thrown when using `poof` (without casting), so be careful when using that version.

## API

Both `poof` and `poof-cast` export:

### createProcessor(config)

Use this function with a config object to get a simple data processor.

The processor either returns an output object or throws `FieldValidationError` if there was a validation error.

### decorators

#### decorators.assert.method and decorators.assert.not.method

Those contain all validation functions from the validator lib: `contains`, `equals`, `isAfter`, `isAlpha`, `isAlphanumeric`, `isAscii`, `isBase64`, `isBefore`, `isBoolean`, `isByteLength`, `isCreditCard`, `isCurrency`, `isDataURI`, `isDate`, `isDecimal`, `isDivisibleBy`, `isEmail`, `isFloat`, `isFQDN`, `isFullWidth`, `isHalfWidth`, `isHexadecimal`, `isHexColor`, `isIn`, `isInt`, `isIP`, `isISBN`, `isISIN`, `isISO8601`, `isJSON`, `isLength`, `isLowercase`, `isMACAddress`, `isMobilePhone`, `isMongoId`, `isMultibyte`, `isNull`, `isNumeric`, `isSurrogatePair`, `isUppercase`, `isURL`, `isUUID`, `isVariableWidth`, `isWhitelisted`, and `matches`.

*The validator methods will be updated if necessary, but the new ones should be auto-detected in most cases.*

The first argument is always a message that can be found in the thrown exception in case the validation failed.

That is followed by other arguments, which are passed to the validation function as the second, third, and so on arguments. The first argument passed is the currently processed value.

So for example for `@decorators.assert.equals('Is different', 'expected')` the arguments passed to the `equals` validator will be the current value and `'expected'`, and if the currently processed value is different from `'expected'`, the error message for this field will be set to `'Is different'`.

`decorators.assert.not` works almost the same, only the validation fails if the function returns `true`.

#### decorators.assert.hasType and decorators.assert.not.hasType

An additional assertion function that performs the `typeof` check on the current value and the passed argument.

#### decorators.assert.isInstanceOf and decorators.assert.not.isInstanceOf

An additional assertion function that performs the `instanceof` check on the current value and the passed argument.

#### decorators.assign

Used to assign the processed value to the output object. When using, it's best to put this decorator last, because any further processing results won't be saved.

#### decorators.filter(predicate)

Filters the current value using `predicate`. The current value is assumed to be an array.

#### decorators.from(key)

The initial value for the processed field is taken from the input object using its key. If you want to use a value of a different field instead, use this decorator.

#### decorators.ignoreIf(predicate)

The predicate is called with the processed value. If the result is `true`, then the processing is stopped for that field and it is omitted from the output object.

#### decorators.ignoreIfUndefined

Sometimes you might want to process some data only if it's present. Use this decorator to avoid validation and transforming in case the processed value is `undefined`. It's equivalent to `decorators.ignoreIf((value) => typeof value === 'undefined')`.

#### decorators.map(mapper)

Maps the current value using `mapper`. The current value is assumed to be an array.

#### decorators.set(value)

Simply sets the processed value to the one passed in the argument.

#### decorators.transform(transformer)

Takes transformer, applies it to the processed value, and sets it as a new processed value. Useful for type casting or otherwise transforming the validated data.

## Some questions you might have

### How can I use decorators in my code?

You can use Babel 5 with an optional "es7.decorators" transformer, or use Babel 6 with [this legacy plugin](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy). There are some differences though, you can read about them [here](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy/blob/master/README.md).

### Why the explicit assignment decorator?

When I started creating what later became Poof I didn't always want to have all of the fields in the output object, and so I decided for the explicit assignment. Maybe in the future I'll add some options to enable auto-assignment for all fields in the object though.

### What about nested structures?

This was supposed to be a simple lib, and I didn't have a need to support nested structures with it. I might do it someday and I'm open to suggestions/PRs.

### Why is the field error exception a separate package?

It makes sense to decouple the exception from the `poof` package because another package that handles this exception shouldn't be tied to `poof`. This problem is not contrived, it's an actual problem I had.

## Be careful with decorators!

The decorators feature is still at stage 1, a proposal.
This means that the [current decorator spec](https://github.com/wycats/javascript-decorators) can change dramatically before it advances to the next stage.

With this said, no changes should affect your use of this library much. You will be mostly using the exterior (decorator application) which now has a final form more or less, while the interior (how the decorating works in Poof) will be kept up-to-date with the spec.

While some things may be set in stone, there is still a room for improvement. So if you care about decorators, please can take part in discussions at [wycats/javascript-decorators](https://github.com/wycats/javascript-decorators) and [jeffmo/es-class-fields-and-static-properties](https://github.com/jeffmo/es-class-fields-and-static-properties).

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code with `npm test`.

## License

Copyright (c) 2016 Rafał Ruciński. Licensed under the MIT license.
