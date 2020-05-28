import { BaseError } from './BaseError';

/**
 * Возникает, когда в коде происходит попытка обратиться к сервису, пока он
 * ещё не инициализирован.
 */
export class NotInitializedError extends BaseError {
  /**
   * Создает экземпляр ошибки.
   */
  public constructor() {
    super(
      'Service is not initialized. Please call Service.initialize() before usage.'
    );
  }
}
