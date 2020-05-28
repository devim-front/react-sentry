import {
  init,
  Event,
  Severity,
  captureException,
  captureEvent,
  EventHint,
  close,
} from '@sentry/browser';

import { NotInitializedError } from './NotInitializedError';

/**
 * Сервис, предоставляющий методы для интеграции с Sentry.IO.
 * @see https://sentry.io/
 */
export class Service {
  /**
   * Сохраненная сущность синглтона.
   */
  private static instance: any;

  /**
   * Возвращает экземпляр синглтона.
   */
  public static getInstance<T extends typeof Service>(this: T) {
    if (this.instance == null) {
      throw new NotInitializedError();
    }

    return this.instance as InstanceType<T>;
  }

  /**
   * Инициализирует сервис.
   * @param dsn Идентификатор аккаунта, предоставляемый в админ-панели Sentry.
   */
  public static initialize(dsn: string) {
    if (this.instance == null) {
      this.instance = new this(dsn);
      return;
    }

    const instance = this.getInstance();

    if (instance.dsn === dsn) {
      return;
    }

    this.dispose();

    this.instance = new this(dsn);
  }

  /**
   * Останавливает работу сервиса и высвобождает все занятые ресурсы.
   */
  public static dispose() {
    if (this.instance == null) {
      return;
    }

    const instance = this.getInstance();
    this.instance = undefined;

    instance.close();
  }

  /**
   * Идентификатор аккаунта.
   */
  private readonly dsn?: string;

  /**
   * Создает экземпляр сервиса. Сервис является синглтоном, не следует вызывать
   * конструктор напрямую.
   * @param dsn Идентификатор аккаунта. Если не указан, все события sentry
   * буду отправляться в браузерную консоль с уровнем 'debug'.
   */
  public constructor(dsn?: string) {
    this.dsn = dsn;

    if (this.dsn == null) {
      return this;
    }

    init({
      dsn,
      beforeSend: this.handleEvent.bind(this),
    });
  }

  /**
   * Закрывает соединение с sentry.
   */
  protected async close() {
    if (this.dsn == null) {
      return;
    }

    await close();
  }

  /**
   * Возвращает коллекцию пользовательских свойств экземпляра ошибки.
   * @param error Ошибка.
   */
  protected getErrorProperties(error: Error) {
    const properties: Record<string, any> = {};
    const keys = Object.keys(error);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      const isCustom =
        key !== 'name' && Object.prototype.hasOwnProperty.call(error, key);

      if (isCustom) {
        // @ts-ignore
        properties[key] = error[key];
      }
    }

    return properties;
  }

  /**
   * Преобразует каждое отправленное через сервис событие.
   * @param event События.
   * @param hint Дополнительная информация о событии.
   */
  protected handleEvent(event: Event, hint: EventHint) {
    const error = hint.originalException;

    if (error instanceof Error) {
      const extra = this.getErrorProperties(error);
      return { ...event, extra };
    }

    return event;
  }

  /**
   * Принудительно отправляет указанную ошибку в sentry и возвращает присвоенный
   * ей идентификатор.
   * @param error Ошибка.
   */
  public sendError(error: Error) {
    console.debug(
      `sentry_exception`,
      error.message,
      this.getErrorProperties(error)
    );

    if (this.dsn == null) {
      return;
    }

    captureException(error);
  }

  /**
   * Отправляет в sentry событие с указанными параметрами и возвращает
   * присвоенный ему идентификатор.
   * @param level Уровень события.
   * @param label Ярлык события.
   * @param message Описание события.
   * @param payload Дополнительные параметры события.
   */
  protected sendEvent(
    level: Severity,
    label: string,
    message: string,
    payload: Record<string, any>
  ) {
    console.debug(`sentry_${level}`, label, message, payload);

    if (this.dsn == null) {
      return;
    }

    captureEvent({
      message,
      level,
      tags: { label },
      extra: payload,
    });
  }

  /**
   * Отправляет отладочное событие и возвращает присвоенный ему идентификатор.
   * @param label Метка события.
   * @param message Текст события.
   * @param payload Дополнительные параметры события.
   */
  public debug(
    label: string,
    message: string,
    payload: Record<string, any> = {}
  ) {
    this.sendEvent(Severity.Debug, label, message, payload);
  }

  /**
   * Отправляет событие логгирования и возвращает присвоеный ему идентификатор.
   * @param label Метка события.
   * @param message Текст события.
   * @param payload Дополнительные параметры события.
   */
  public log(
    label: string,
    message: string,
    payload: Record<string, any> = {}
  ) {
    this.sendEvent(Severity.Log, label, message, payload);
  }

  /**
   * Отправляет информационное событие и возвращает присвоеный ему
   * идентификатор.
   * @param label Метка события.
   * @param message Текст события.
   * @param payload Дополнительные параметры события.
   */
  public info(
    label: string,
    message: string,
    payload: Record<string, any> = {}
  ) {
    this.sendEvent(Severity.Info, label, message, payload);
  }

  /**
   * Отправляет событие предпреждения и возвращает присвоеный ему идентификатор.
   * @param label Метка события.
   * @param message Текст события.
   * @param payload Дополнительные параметры события.
   */
  public warning(
    label: string,
    message: string,
    payload: Record<string, any> = {}
  ) {
    this.sendEvent(Severity.Warning, label, message, payload);
  }

  /**
   * Отправляет событие ошибки и возвращает присвоеный ему идентификатор.
   * @param label Метка события.
   * @param message Текст события.
   * @param payload Дополнительные параметры события.
   */
  public error(
    label: string,
    message: string,
    payload: Record<string, any> = {}
  ) {
    this.sendEvent(Severity.Error, label, message, payload);
  }
}
