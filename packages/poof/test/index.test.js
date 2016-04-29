'use strict';

const mockery = require('mockery');
const should = require('should/as-function');
const sinon = require('sinon');


describe('Poof - default version', () => {
  let poofFactory;
  let index;

  beforeEach(() => {
    poofFactory = sinon.stub().returns('poof_factory');

    mockery.registerMock('poof-factory', poofFactory);

    index = require('../tmp/index');
  });

  afterEach(() => {
    mockery.deregisterAll();
  });

  it('should be a result of calling poof factory', () => {
    should(index).be.equal('poof_factory');
  });

  it('should call poof factory with `false` once', () => {
    should(poofFactory).be.calledOnce();
    should(poofFactory).be.calledWithExactly(false);
  });
});
