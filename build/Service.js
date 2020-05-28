"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var browser_1 = require("@sentry/browser");
var NotInitializedError_1 = require("./NotInitializedError");
/**
 * Сервис, предоставляющий методы для интеграции с Sentry.IO.
 * @see https://sentry.io/
 */
var Service = /** @class */ (function () {
    /**
     * Создает экземпляр сервиса. Сервис является синглтоном, не следует вызывать
     * конструктор напрямую.
     * @param dsn Идентификатор аккаунта.
     */
    function Service(dsn) {
        browser_1.init({ dsn: dsn, beforeSend: this.handleEvent.bind(this) });
    }
    /**
     * Возвращает экземпляр синглтона.
     */
    Service.getInstance = function () {
        if (this.instance == null) {
            throw new NotInitializedError_1.NotInitializedError();
        }
        return this.instance;
    };
    /**
     * Инициализирует сервис.
     * @param dsn Идентификатор аккаунта, предоставляемый в админ-панели Sentry.
     */
    Service.initialize = function (dsn) {
        this.instance = new this(dsn);
    };
    /**
     * Удаляет сохраненную сущность синглтона.
     */
    Service.deleteInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.instance == null) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getInstance().dispose()];
                    case 1:
                        _a.sent();
                        this.instance = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Преобразует каждое отправленное через сервис событие.
     * @param event События.
     * @param hint Дополнительная информация о событии.
     */
    Service.prototype.handleEvent = function (event, hint) {
        var error = hint.originalException;
        if (error == null || !(error instanceof Error)) {
            return event;
        }
        var extra = {};
        var keys = Object.keys(error);
        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (Object.prototype.hasOwnProperty.call(error, key)) {
                // @ts-ignore
                extra[key] = error[key];
            }
        }
        return __assign(__assign({}, event), { extra: extra });
    };
    /**
     * Закрывает соединение с sentry.
     */
    Service.prototype.dispose = function () {
        return browser_1.close();
    };
    /**
     * Отправляет в sentry событие с указанными параметрами и возвращает
     * присвоенный ему идентификатор.
     * @param level Уровень события.
     * @param label Ярлык события.
     * @param message Описание события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.sendEvent = function (level, label, message, payload) {
        return browser_1.captureEvent({
            message: message,
            level: level,
            tags: { label: label },
            extra: payload,
        });
    };
    /**
     * Отправляет отладочное событие и возвращает присвоенный ему идентификатор.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.debug = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        return this.sendEvent(browser_1.Severity.Debug, label, message, payload);
    };
    /**
     * Отправляет событие логгирования и возвращает присвоеный ему идентификатор.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.log = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        return this.sendEvent(browser_1.Severity.Log, label, message, payload);
    };
    /**
     * Отправляет информационное событие и возвращает присвоеный ему
     * идентификатор.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.info = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        return this.sendEvent(browser_1.Severity.Info, label, message, payload);
    };
    /**
     * Отправляет событие предпреждения и возвращает присвоеный ему идентификатор.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.warning = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        return this.sendEvent(browser_1.Severity.Warning, label, message, payload);
    };
    /**
     * Отправляет событие ошибки и возвращает присвоеный ему идентификатор.
     * @param label Метка события.
     * @param message Текст события.
     * @param payload Дополнительные параметры события.
     */
    Service.prototype.error = function (label, message, payload) {
        if (payload === void 0) { payload = {}; }
        return this.sendEvent(browser_1.Severity.Error, label, message, payload);
    };
    /**
     * Принудительно отправляет указанную ошибку в sentry и возвращает присвоенный
     * ей идентификатор.
     * @param error Ошибка.
     */
    Service.prototype.sendError = function (error) {
        return browser_1.captureException(error);
    };
    return Service;
}());
exports.Service = Service;
