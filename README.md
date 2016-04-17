# Poof

> Simple data processing with decorators

[![Build Status](https://travis-ci.org/fatfisz/poof.svg?branch=master)](https://travis-ci.org/fatfisz/poof)
[![Dependency Status](https://david-dm.org/fatfisz/poof.svg)](https://david-dm.org/fatfisz/poof)
[![devDependency Status](https://david-dm.org/fatfisz/poof/dev-status.svg)](https://david-dm.org/fatfisz/poof#info=devDependencies)

Poof is a tool for creating data processing functions in a declarative way by utilising an upcoming JS feature - decorators.

It makes use of the awesome [validator](https://www.npmjs.com/package/validator) lib to provide assertion functions. Without it Poof probably wouldn't exist.

## Getting started

Install the package with this command:
```shell
npm install poof --save
```

Poof makes use of ES6 data structures, e.g. `WeakMap`, so make sure you have those too.

## Why use Poof?

- it lets you describe data processing in a straightforward, declarative way
- it is especially useful for isomorphic websites - you can declare data validator once and use it both on the client-side and the on the server-side
- Poof processors are composable - you can simply pass the processing result to another processor, e.g. when you want to separate validation and transforming

## Basic usage

Poof library has two versions: [`poof`, and `poof/cast`](#the-difference-between-poof-and-poofcast). Both of them have three exports: the [`createProcessor` function](#createprocessorconfig), the [`decorators` object](#decorators) and the [`ValidationError` exception](#validationerror).

```js
// First import tools from Poof. The `poof/cast` version additionaly casts
// data to String for assertions. More about it later.
import { createProcessor, decorators, ValidationError } from 'poof/cast';

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
  ...
} catch(error) {
  if (error instanceof ValidationError) {
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
then you'd get a `ValidationError` with the `fields` property equal to:
```js
{
  _id: 'Missing post id',
  index: 'Invalid index',
}
```

## The difference between poof and poof/cast

The [validator](https://www.npmjs.com/package/validator) library used to make the casting by itself before v. 5.
Now it instead throws when the passed argument is not a string.

The rules of casting are as follows:
- in case of objects try to use `toString` or return `'[object Object]'`
- return `''` for `null`, `undefined`, `NaN` and `''`
- else case the value to a string

This is quite useful for parsing request bodies, which usually consist of strings.
Missing fields assume the value of `''` when auto-casting is on.
Because of this `decorators.assert.isNull` from `poof/cast` covers both empty strings and null values.

So using `poof/cast` where you will be dealing with strings or missing properties spares you from adding more boilerplate (explicit casting).

Warning! If you use an assertion function on a non-string without autocasting, an exception will be thrown and the processing will end abruptly.

## API

Both `poof` and `poof/cast` export:

### createProcessor(config)

Use this function with a config object to get a simple data processor.

The processor either returns an output object or throws `ValidationError` if there was a validation error.

### ValidationError

An exception class that inherits from `Error`. This is thrown if the validation of any of the fields failed.

Instances have one property - `fields`, which is an object containing error info for invalid fields.

### decorators

#### decorators.assert.xxx and decorators.assert.not.xxx

Those contain all validation functions from the validator lib. I will try to keep them up-to-date.

Currently those are: `contains`, `equals`, `isAfter`, `isAlpha`, `isAlphanumeric`, `isAscii`, `isBase64`, `isBefore`, `isBoolean`, `isByteLength`, `isCreditCard`, `isCurrency`, `isDate`, `isDecimal`, `isDivisibleBy`, `isEmail`, `isFloat`, `isFQDN`, `isFullWidth`, `isHalfWidth`, `isHexadecimal`, `isHexColor`, `isIn`, `isInt`, `isIP`, `isISBN`, `isISIN`, `isISO8601`, `isJSON`, `isLength`, `isLowercase`, `isMACAddress`, `isMobilePhone`, `isMongoId`, `isMultibyte`, `isNull`, `isNumeric`, `isSurrogatePair`, `isUppercase`, `isURL`, `isUUID`, `isVariableWidth`, `isWhitelisted`, and `matches`.

The first argument is always a message that can be found in the thrown exception in case the validation failed.

That is followed by other arguments, which are passed to the validation function as the second, third, and so on arguments. The first argument passed is the currently processed value.

So for example if you use `@decorators.assert.equals('Is different', 'expected')` and the current value is `'unexpected'`, the function call will be `equals('unexpected', 'expected')`. If that returns `false`, `'Is different'` will be used as the error message and the validation for that field will not proceed.

`decorators.assert.not` works almost the same, only the validation fails if the function returns `true`.

#### decorators.assign

Used to assign the processed value to the output object. When using, it's best to put this decorator last, because any further processing results won't be saved.

#### decorators.from(key)

The initial value for the processed field is taken from the input object using its key. If you want to use a value of a different field instead, use this decorator.

#### decorators.ignoreIf(predicate)

The predicate is called with the processed value. If the result is `true`, then the processing is stopped for that field and it is omitted from the output object.

#### decorators.ignoreIfUndefined

Sometimes you might want to process some data only if it's present. Use this decorator to avoid validation and transforming in case the processed value is `undefined`. It's equivalent to `decorators.ignoreIf((value) => typeof value === 'undefined')`.

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

This was supposed to be a simple lib, and I didn't have a need to support nested structures with it. I might do it someday.

### Why bother doing this?

It was a bit of an experiment - to do validation with decorators. It turned out quite nice, so why not share.

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
