'use strict';

const mockery = require('mockery');
require('should-sinon');


// Set up mockery
beforeEach(() => {
  mockery.enable({
    useCleanCache: true,
    warnOnUnregistered: false,
  });
});

afterEach(() => {
  mockery.disable();
});
