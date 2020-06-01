import {
  init,
  Event,
  Severity,
  captureException,
  captureEvent,
  EventHint,
  close,
} from '@sentry/browser';
import { StrictService } from '@devim-front/service';

/**
 * Сервис, предоставляющий методы для интеграции с sentry.io.
 *
 * @see https://sentry.io/
 */
export class Service extends StrictService {
  /**
   * Инициализирует сервис с указанным Client DSN (подробнее об этом параметре
   * смотри в документации sentry.io).
   *
   * @param dsn Client DSN. Если не указать этот идентификатор, все события
   * сервиса будут отправляться в браузерную консоль с уровнем debug и
   * меткой 'sentry' вместо реальной отправки на сервер sentry.io.
   */
  public static init(dsn?: string) {
    super.init(dsn);
  }

  /**
   * Client DSN.
   */
  private readonly dsn?: string;

  /**
   * Указывает, что сервис подключён sentry и может использовать его API.
   */
  protected get isConnected() {
    return this.dsn != null;
  }

  /**
   * Создает экземпляр сервиса с указанным параметрами.
   *
   * @param dsn Client DSN.
   */
  public constructor(dsn?: string) {
    super(dsn);

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
   * @inheritdoc
   */
  public dispose() {
    super.dispose();

    if (this.isConnected) {
      close();
    }
  }

  /**
   * Возвращает коллекцию пользовательских свойств экземпляра ошибки.
   *
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
   * Если передано событие ошибки, собирает пользовательские свойства из
   * экземпляра исключения и присоединяет их к дополнительным данным события.
   * В противном случае возвращает исходное событие.
   *
   * @param event Событие.
   * @param hint Дополнительная информация о событии.
   */
  private transformErrorEvent(event: Event, hint: EventHint) {
    const error = hint.originalException;

    if (error instanceof Error) {
      const nextExtra = this.getErrorProperties(error);
      const prevExtra = event.extra || {};

      return {
        ...event,
        extra: {
          ...prevExtra,
          ...nextExtra,
        },
      };
    }

    return event;
  }

  /**
   * Преобразует каждое отправленное через сервис событие.
   *
   * @param event Событие.
   * @param hint Дополнительная информация о событии.
   */
  protected handleEvent(event: Event, hint: EventHint) {
    return this.transformErrorEvent(event, hint);
  }

  /**
   * Логгирует событие sentry в браузерную консоль, если код работает в режиме
   * отладки.
   *
   * @param level Уровень сообщени.
   * @param message Сообщение.
   * @param payload Параметры события.
   */
  protected writeToConsole(level: string, message: string, payload: any) {
    if (
      process.env.NODE_ENV === 'production' ||
      typeof window === 'undefined'
    ) {
      return;
    }

    console.debug(`sentry_${level}`, message, payload);
  }

  /**
   * Принудительно отправляет указанную ошибку в sentry.
   *
   * @param error Ошибка.
   */
  public sendError(error: Error) {
    this.writeToConsole(
      'exception',
      error.message,
      this.getErrorProperties(error)
    );

    if (this.isConnected) {
      captureException(error);
    }
  }

  /**
   * Отправляет в sentry событие с указанными параметрами.
   *
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
    this.writeToConsole(level, message, { label, extra: payload });

    if (this.isConnected) {
      captureEvent({
        message,
        level,
        tags: { label },
        extra: payload,
      });
    }
  }

  /**
   * Отправляет отладочное событие.
   *
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
   * Отправляет событие логгирования.
   *
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
   * Отправляет информационное событие.
   *
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
   * Отправляет событие предпреждения.
   *
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
   * Отправляет событие ошибки.
   *
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
