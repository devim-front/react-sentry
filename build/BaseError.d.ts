/**
 * Базовый класс ошибки сервиса.
 * @internal
 */
export declare class BaseError extends Error {
    /**
     * Сообщение об ошибке.
     * @param message Сообщение об ошибке.
     */
    constructor(message: string);
}
