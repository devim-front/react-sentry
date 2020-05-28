"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotInitializedError = void 0;
var BaseError_1 = require("./BaseError");
/**
 * Возникает, когда в коде происходит попытка обратиться к сервису, пока он
 * ещё не инициализирован.
 */
var NotInitializedError = /** @class */ (function (_super) {
    __extends(NotInitializedError, _super);
    /**
     * Создает экземпляр ошибки.
     */
    function NotInitializedError() {
        return _super.call(this, 'Service is not initialized. Please use Service.initialize() before') || this;
    }
    return NotInitializedError;
}(BaseError_1.BaseError));
exports.NotInitializedError = NotInitializedError;
