"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Service_1 = require("./Service");
var dsn = 'https://d28a5543ba644e6db8a5ce5fa56bdfb6@o399338.ingest.sentry.io/5256269';
describe('Service', function () {
    it('initialize() should works well', function () {
        Service_1.Service.initialize(dsn);
    });
    it('deleteInstance() should works well', function () {
        return Service_1.Service.deleteInstance();
    });
    it('getInstance() should throws error', function () {
        chai_1.assert.throws(function () { return Service_1.Service.getInstance(); });
    });
    it('initialize() should works well', function () {
        Service_1.Service.initialize(dsn);
    });
});
