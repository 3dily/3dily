"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var constants_js_1 = require("../constants.js");
var Controller_js_1 = require("./Controller.js");
var Events_js_1 = require("./Events.js");
var Scene = /** @class */ (function () {
    function Scene(opts) {
        var _this = this;
        this.framesCount = 0;
        this.activeFrame = 0;
        this.frameElements = [];
        this.loading = 0;
        this.events = new Events_js_1.Events();
        this.zoom = false;
        this.onChangeFrame = function (i) {
            _this.frameElements[_this.activeFrame].classList.remove('threedily-frame-active');
            _this.frameElements[i].classList.add('threedily-frame-active');
            _this.activeFrame = i;
        };
        this.onZoom = function (transform) {
            _this.frameElements[_this.activeFrame].style.transform = transform;
            if (transform === 'unset') {
                _this.zoom = false;
                _this.frameElements[_this.activeFrame].src = _this.buildURL(_this.activeFrame);
            }
            else if (!_this.zoom) {
                _this.zoom = true;
                _this.frameElements[_this.activeFrame].src = _this.buildURL(_this.activeFrame, '4k');
            }
        };
        this.onLoading = function () {
            _this.loading += 1;
            if (_this.loading === _this.framesCount) {
                _this.controller = new Controller_js_1.Controller(_this.sceneElement, _this.framesCount, _this.onChangeFrame, _this.onZoom);
                setTimeout(function () {
                    _this.progressbar.remove();
                }, 1200);
            }
            ;
            _this.progressbar.firstChild.style.width = "".concat((_this.loading / _this.framesCount) * 100, "%");
        };
        this.opts = opts;
        if (this.validateOpts()) {
            this.init();
        }
        else {
            console.error('opts invalid!');
        }
    }
    Scene.prototype.init = function () {
        var _this = this;
        this.container = document.getElementById(this.opts.containerId);
        if (!this.container) {
            console.error('Container not found!');
            return;
        }
        this.baseUrl = constants_js_1.API_URL + this.opts.panelId + '/' + this.opts.productCode;
        fetch("".concat(this.baseUrl, "/data"))
            .then(function (res) { return res.json(); })
            .then(function (data) {
            _this.data = data;
            _this.events.trigger('load-data', data);
            _this.setupScene();
        });
    };
    Scene.prototype.setupScene = function () {
        var _this = this;
        this.remove();
        this.setFramesCount();
        this.sceneElement = document.createElement('div');
        this.sceneElement.classList.add('threedily-scene');
        this.container.appendChild(this.sceneElement);
        this.loading = 0;
        if (this.framesCount < 1)
            return;
        this.createLoading();
        var loadFrames = function (i) {
            if (i === void 0) { i = 0; }
            var img = document.createElement('img');
            img.classList.add('threedily-frame');
            i === _this.activeFrame && img.classList.add('threedily-frame-active');
            img.src = _this.buildURL(i);
            new Promise(function (resolve) {
                img.onload = img.onerror = function () { return resolve(); };
            }).then(function () {
                img.onload = img.onerror = undefined;
                _this.onLoading();
                _this.sceneElement.appendChild(img);
                _this.frameElements.push(img);
                i < _this.framesCount - 1 && loadFrames(i + 1);
            });
        };
        loadFrames();
    };
    Scene.prototype.setFramesCount = function () {
        var _this = this;
        var galleryIndex = 0;
        if (this.opts.variants) {
            if (!Object.keys(this.opts.variants).every(function (item) {
                return _this.data.layers.map(function (l) { return l.code; }).includes(item);
            })) {
                throw console.error('variants invalid!');
            }
            this.data.layers.forEach(function (layer, i) {
                if (Object.keys(_this.opts.variants).includes(layer.code)) {
                    var index = layer.variants.indexOf(_this.opts.variants[layer.code]);
                    if (index > -1) {
                        galleryIndex +=
                            i === _this.data.layers.length - 1
                                ? index
                                : index *
                                    _this.data.layers
                                        .slice(i + 1)
                                        .map(function (layer) { return layer.variants.length; })
                                        .reduce(function (a, b) { return a + b; }, 0);
                    }
                    else {
                        throw console.error('variants invalid!');
                    }
                }
            });
        }
        this.framesCount = this.data.files[galleryIndex].frames.length;
    };
    Scene.prototype.createLoading = function () {
        var progress = document.createElement('div');
        progress.classList.add('threedily-linear-progress');
        var bar = document.createElement('div');
        progress.appendChild(bar);
        bar.classList.add('threedily-linear-progress-bar');
        this.sceneElement.appendChild(progress);
        this.progressbar = progress;
    };
    Scene.prototype.validateOpts = function () {
        return this.opts.panelId && this.opts.containerId && this.opts.productCode;
    };
    Scene.prototype.buildURL = function (frame, quality) {
        if (quality === void 0) { quality = '2k'; }
        return "".concat(this.baseUrl, "/image?frame=").concat(frame).concat(this.opts.shadow === true || typeof this.opts.shadow === 'undefined'
            ? ''
            : '&shadow=false', "&quality=").concat(quality).concat(this.opts.variants
            ? '&variants=' + JSON.stringify(this.opts.variants)
            : '');
    };
    Scene.prototype.remove = function () {
        if (this.sceneElement)
            this.sceneElement.remove();
    };
    Scene.prototype.changeVariants = function (variants) {
        this.opts.variants = variants;
        this.setupScene();
    };
    Scene.prototype.toggleShadow = function () {
        this.opts.shadow = !this.opts.shadow;
        this.setupScene();
    };
    Scene.prototype.getData = function () {
        return this.data;
    };
    Scene.prototype.on = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.events).on.apply(_a, args);
    };
    Scene.prototype.off = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.events).off.apply(_a, args);
    };
    return Scene;
}());
exports.Scene = Scene;
