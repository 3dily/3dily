"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIos = exports.isAndroid = void 0;
var isAndroid = function () {
    return navigator.userAgent.toLowerCase().indexOf('android') > -1;
};
exports.isAndroid = isAndroid;
var isIos = function () {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
    ].includes(navigator.platform) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};
exports.isIos = isIos;
