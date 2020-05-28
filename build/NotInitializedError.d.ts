import { BaseError } from './BaseError';
/**
 * Возникает, когда в коде происходит попытка обратиться к сервису, пока он
 * ещё не инициализирован.
 */
export declare class NotInitializedError extends BaseError {
    /**
     * Создает экземпляр ошибки.
     */
    constructor();
}
