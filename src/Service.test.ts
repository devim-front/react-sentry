import { assert } from 'chai';

import { Service } from './Service';

describe('Service', () => {
  const makeService = () =>
    class CustomService extends Service {
      public level: string;
      public message: string;
      public payload: Record<string, any>;

      protected writeToConsole(level: string, message: string, payload: any) {
        super.writeToConsole(level, message, payload);

        this.level = level;
        this.message = message;
        this.payload = payload;
      }
    };

  const assertEqual = (
    service: ReturnType<typeof makeService>,
    level: string,
    message: string,
    payload: Record<string, any>
  ) => {
    assert.equal(service.get().level, level);
    assert.equal(service.get().message, message);
    assert.deepEqual(service.get().payload, payload);
  };

  describe('sendError', () => {
    it('should works well', () => {
      const service = makeService();
      service.init();
      const message = 'Foo';
      const error = new Error(message);
      // @ts-ignore
      error.foo = 'bar';
      service.get().sendError(error);
      assertEqual(service, 'exception', message, { foo: 'bar' });
    });
  });

  describe('debug', () => {
    it('should works well', () => {
      const service = makeService();
      service.init();
      const label = 'label';
      const message = 'message';
      const payload = { hello: 'world' };
      service.get().debug(label, message, payload);
      assertEqual(service, 'debug', message, { label, extra: payload });
    });
  });

  describe('info', () => {
    it('should works well', () => {
      const service = makeService();
      service.init();
      const label = 'label';
      const message = 'message';
      const payload = { hello: 'world' };
      service.get().info(label, message, payload);
      assertEqual(service, 'info', message, { label, extra: payload });
    });
  });

  describe('log', () => {
    it('should works well', () => {
      const service = makeService();
      service.init();
      const label = 'label';
      const message = 'message';
      const payload = { hello: 'world' };
      service.get().log(label, message, payload);
      assertEqual(service, 'log', message, { label, extra: payload });
    });
  });

  describe('warning', () => {
    it('should works well', () => {
      const service = makeService();
      service.init();
      const label = 'label';
      const message = 'message';
      const payload = { hello: 'world' };
      service.get().warning(label, message, payload);
      assertEqual(service, 'warning', message, { label, extra: payload });
    });
  });

  describe('error', () => {
    it('should works well', () => {
      const service = makeService();
      service.init();
      const label = 'label';
      const message = 'message';
      const payload = { hello: 'world' };
      service.get().error(label, message, payload);
      assertEqual(service, 'error', message, { label, extra: payload });
    });
  });
});
