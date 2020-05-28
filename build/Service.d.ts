import { Event, Severity, EventHint } from '@sentry/browser';
/**
 * Сервис, предоставляющий методы для интеграции с sentry.io.
 * @see https://sentry.io/
 */
export declare class Service {
    /**
     * Сохраненная сущность синглтона.
     */
    private static instance;
    /**
     * Возвращает экземпляр синглтона.
     */
    static getInstance<T extends typeof Service>(this: T): InstanceType<T>;
    /**
     * Инициализирует сервис.
     * @param dsn Идентификатор аккаунта, предоставляемый в админ-панели sentry.
     * Если не указан, то сервис будет запущен в демонстрационном режиме: вместо
     * реальной отправки сообщений в sentry будет происходить их логгирование
     * в браузерную консоль с уровнем debug.
     */
    static initialize(dsn?: string): void;
    /**
     * Останавливает работу сервиса и высвобождает все занятые ресурсы.
     */
    static dispose(): void;
    /**
     * Идентификатор аккаунта.
     */
    private readonly dsn?;
    /**
     * True, если сервис действительно подключен к sentry, а не используется
     * в демонстрационном режиме без реальной отправки событий.
     */
    private get isConnected();
    /**
     * Создает экземпляр сервиса. Сервис является синглтоном, не следует вызывать
     * конструктор напрямую.
     * @param dsn Идентификатор аккаунта. Если не указан, все события sentry
     * буду отправляться в браузерную консоль с уровнем 'debug'.
     */
    constructor(dsn?: string);
    /**
     * Закрывает соединение с sentry.
     */
    protected close(): Promise<void>;
    /**
     * Возвращает коллекцию пользовательских свойств экземпляра ошибки.
     * @param error Ошибка.
     */
    protected getErrorProperties(error: Error): Record<string, any>;
    /**
     * Преобразует каждое отправленное через сервис событие.
     * @param event События.
     * @param hint Дополнительная информация о событии.
     */
    protected handleEvent(event: Event, hint: EventHint): Event;
    /**
     * Принудительно отправляет указанную ошибку в sentry.
     * @param error Ошибка.
     */
    sendError(error: Error): void;
    /**
     * Отправляет в sentry событие с указанными параметрами.
     * @param level Уровень события.
     * @param label Ярлык события.
     * @param message Описание события.
     * @param payload Дополнительные параметры события.
     */
    protected sendEvent(level: Severity, label: string, message: string, payload: Record<string, any>): void;
    /**
     * Отправляет отладочное событие.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    debug(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет событие логгирования.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    log(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет информационное событие.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    info(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет событие предпреждения.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    warning(label: string, message: string, payload?: Record<string, any>): void;
    /**
     * Отправляет событие ошибки.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    error(label: string, message: string, payload?: Record<string, any>): void;
}
