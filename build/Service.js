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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var browser_1 = require("@sentry/browser");
var service_1 = require("@devim-front/service");
/**
 * Сервис, предоставляющий методы для интеграции с sentry.io.
 *
 * @see https://sentry.io/
 */
var Service = /** @class */ (function (_super) {
    __extends(Service, _super);
    /**
     * Создает экземпляр сервиса с указанным параметрами.
     *
     * @param dsn Client DSN.
     */
    function Service(dsn) {
        var _this = _super.call(this, dsn) || this;
        _this.dsn = dsn;
        if (_this.dsn == null) {
            return _this;
        }
        browser_1.init({
            dsn: dsn,
            beforeSend: _this.handleEvent.bind(_this),
        });
        return _this;
    }
    /**
     * Инициализирует сервис с указанным Client DSN (подробнее об этом параметре
     * смотри в документации sentry.io).
     *
     * @param dsn Client DSN. Если не указать этот идентификатор, все события
     * сервиса будут отправляться в браузерную консоль с уровнем debug и
     * меткой 'sentry' вместо реальной отправки на сервер sentry.io.
     */
    Service.init = function (dsn) {
        _super.init.call(this, dsn);
    };
    Object.defineProperty(Service.prototype, "isConnected", {
        /**
         * Указывает, что сервис подключён sentry и может использовать его API.
         */
        get: function () {
            return this.dsn != null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritdoc
     */
    Service.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.isConnected) {
            browser_1.close();
        }
    };
    /**
     * Возвращает коллекцию пользовательских свойств экземпляра ошибки.
     *
     * @param error Ошибка.
     */
    Service.prototype.getErrorProperties = function (error) {
        var properties = {};
        var keys = Object.keys(error);
        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            var isCustom = key !== 'name' && Object.prototype.hasOwnProperty.call(error, key);
            if (isCustom) {
                // @ts-ignore
                properties[key] = error[key];
            }
        }
        return properties;
    };
    /**
     * Если передано событие ошибки, собирает пользовательские свойства из
     * экземпляра исключения и присоединяет их к дополнительным данным события.
     * В противном случае возвращает исходное событие.
     *
     * @param event Событие.
     * @param hint Дополнительная информация о событии.
     */
    Service.prototype.transformErrorEvent = function (event, hint) {
        var error = hint.originalException;
        if (error instanceof Error) {
            var nextExtra = this.getErrorProperties(error);
            var prevExtra = event.extra || {};
            return __assign(__assign({}, event), { extra: __assign(__assign({}, prevExtra), nextExtra) });
        }
        return event;
    };
    /**
     * Преобразует каждое отправленное через сервис событие.
     *
     * @param event Событие.
     * @param hint Дополнительная информация о событии.
     */
    Service.prototype.handleEvent = function (event, hint) {
        return this.transformErrorEvent(event, hint);
    };
    /**
     * Логгирует событие sentry в браузерную консоль, если код работает в режиме
     * отладки.
     *
     * @param level Уровень сообщени.
     * @param message Сообщение.
     * @param payload Параметры события.
     */
    Service.prototype.writeToConsole = function (level, message, payload) {
        if (process.env.NODE_ENV === 'production' ||
            typeof window === 'undefined') {
            return;
        }
        console.debug("sentry_" + level, message, payload);
    };
    /**
     * Принудительно отправляет указанную ошибку в sentry.
     *
     * @param error Ошибка.
     */
    Service.prototype.sendError = function (error) {
        this.writeToConsole('exception', error.message, this.getErrorProperties(error));
        if (this.isConnected) {
            browser_1.captureException(error);
        }
    };
    /**
     * Отправляет в sentry событие с указанными параметрами.
     *
     * @param level Уровень события.
     * @param label Ярлык события.
     * @param message Описание события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.sendEvent = function (level, label, message, payload) {
        this.writeToConsole(level, message, { label: label, extra: payload });
        if (this.isConnected) {
            browser_1.captureEvent({
                message: message,
                level: level,
                tags: { label: label },
                extra: payload,
            });
        }
    };
    /**
     * Отправляет отладочное событие.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.debug = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        this.sendEvent(browser_1.Severity.Debug, label, message, payload);
    };
    /**
     * Отправляет событие логгирования.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.log = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        this.sendEvent(browser_1.Severity.Log, label, message, payload);
    };
    /**
     * Отправляет информационное событие.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.info = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        this.sendEvent(browser_1.Severity.Info, label, message, payload);
    };
    /**
     * Отправляет событие предпреждения.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.warning = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        this.sendEvent(browser_1.Severity.Warning, label, message, payload);
    };
    /**
     * Отправляет событие ошибки.
     *
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.error = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        this.sendEvent(browser_1.Severity.Error, label, message, payload);
    };
    return Service;
}(service_1.StrictService));
exports.Service = Service;
