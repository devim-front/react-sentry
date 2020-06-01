import { Event, Severity, EventHint } from '@sentry/browser';
import { StrictService } from '@devim-front/service';
/**
 * Сервис, предоставляющий методы для интеграции с sentry.io.
 *
 * @see https://sentry.io/
 */
export declare class Service extends StrictService {
    /**
     * Инициализирует сервис с указанным Client DSN (подробнее об этом параметре
     * смотри в документации sentry.io).
     *
     * @param dsn Client DSN. Если не указать этот идентификатор, все события
     * сервиса будут отправляться в браузерную консоль с уровнем debug и
     * меткой 'sentry' вместо реальной отправки на сервер sentry.io.
     */
    static init(dsn?: string): void;
    /**
     * Client DSN.
     */
    private readonly dsn?;
    /**
     * Указывает, что сервис подключён sentry и может использовать его API.
     */
    protected get isConnected(): boolean;
    /**
     * Создает экземпляр сервиса с указанным параметрами.
     *
     * @param dsn Client DSN.
     */
    constructor(dsn?: string);
    /**
     * @inheritdoc
     */
    dispose(): void;
    /**
     * Возвращает коллекцию пользовательских свойств экземпляра ошибки.
     *
     * @param error Ошибка.
     */
    protected getErrorProperties(error: Error): Record<string, any>;
    /**
     * Если передано событие ошибки, собирает пользовательские свойства из
     * экземпляра исключения и присоединяет их к дополнительным данным события.
     * В противном случае возвращает исходное событие.
     *
     * @param event Событие.
     * @param hint Дополнительная информация о событии.
     */
    private transformErrorEvent;
    /**
     * Преобразует каждое отправленное через сервис событие.
     *
     * @param event Событие.
     * @param hint Дополнительная информация о событии.
     */
    protected handleEvent(event: Event, hint: EventHint): Event;
    /**
     * Логгирует событие sentry в браузерную консоль, если код работает в режиме
     * отладки.
     *
     * @param level Уровень сообщени.
     * @param message Сообщение.
     * @param payload Параметры события.
     */
    protected writeToConsole(level: string, message: string, payload: any): void;
    /**
     * Принудительно отправляет указанную ошибку в sentry.
     *
     * @param error Ошибка.
     */
    sendError(error: Error): void;
    /**
     * Отправляет в sentry событие с указанными параметрами.
     *
     * @param level Уровень события.
     * @param label Ярлык события.
     * @param message Описание события.
     * @param payload Дополнительные параметры события.
     */
    protected sendEvent(level: Severity, label: string, message: string, payload: Record<string, any>): void;
    /**
     * Отправляет отладочное событие.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    debug(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет событие логгирования.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    log(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет информационное событие.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    info(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет событие предпреждения.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    warning(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет событие ошибки.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    error(label: string, message: string, payload?: Record<string, any>): void;
}
