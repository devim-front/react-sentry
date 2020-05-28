import { assert } from 'chai';

import { Service } from './Service';

const dsn =
  'https://d28a5543ba644e6db8a5ce5fa56bdfb6@o399338.ingest.sentry.io/5256269';

describe('Service', () => {
  it('initialize() should works well', () => {
    Service.initialize(dsn);
  });

  it('deleteInstance() should works well', () => {
    return Service.deleteInstance();
  });

  it('getInstance() should throws error', () => {
    assert.throws(() => Service.getInstance());
  });

  it('initialize() should works well again', () => {
    Service.initialize(dsn);
  });
});
