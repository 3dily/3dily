"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var constants_js_1 = require("../constants.js");
var Controller_js_1 = require("./Controller.js");
var Events_js_1 = require("./Events.js");
var utils_js_1 = require("./utils.js");
require("../libs/model-viewer.min.js");
var Scene = /** @class */ (function () {
    function Scene(opts) {
        var _this = this;
        this.activeFrame = 0;
        this.frameElements = [];
        this.loading = 0;
        this.events = new Events_js_1.Events();
        this.zoom = false;
        this.onChangeFrame = function (i) {
            _this.frameElements[_this.activeFrame].classList.remove('threedily-frame-active');
            _this.frameElements[i].classList.add('threedily-frame-active');
            _this.activeFrame = i;
            _this.events.trigger('change-frame', i);
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
        this.onLoading = function (loading) {
            if (loading === void 0) { loading = _this.loading + 1; }
            _this.loading = loading;
            if (_this.loading === _this.data.framesCount) {
                _this.controller = new Controller_js_1.Controller(_this.sceneElement, _this.data.framesCount, _this.onChangeFrame, _this.onZoom);
                setTimeout(function () {
                    _this.progressbar.remove();
                }, 1200);
            }
            ;
            _this.progressbar.firstChild.style.width = "".concat((_this.loading / _this.data.framesCount) * 100, "%");
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
        var container = document.getElementById(this.opts.containerId);
        if (!container) {
            console.error('Container not found!');
            return;
        }
        this.container = document.createElement('div');
        this.container.classList.add('threedily-container');
        container.appendChild(this.container);
        if (!globalThis.QRCode) {
            var script = document.createElement('script');
            script.src =
                '//cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.integrity =
                'sha512-CNgIRecGo7nphbeZ04Sc13ka07paqdeTu0WR1IM4kNcpmBAUSHSQX0FslNhTDadL4O5SAGapGt4FodqL8My0mA==';
            script.crossOrigin = 'anonymous';
            script.referrerPolicy = 'no-referrer';
            this.container.appendChild(script);
        }
        this.baseUrl =
            (this.opts.API_URL || constants_js_1.API_URL) +
                this.opts.panelId +
                '/' +
                this.opts.productCode;
        fetch("".concat(this.baseUrl, "/data"))
            .then(function (res) { return res.json(); })
            .then(function (data) {
            _this.data = data;
            _this.events.trigger('load-data', data);
            if (_this.opts.mode === '360') {
                _this.setupScene();
            }
            else if (_this.opts.mode === 'model') {
                _this.setupModelViewer();
            }
            else {
                data.framesCount > 0 ? _this.setupScene() : _this.setupModelViewer();
            }
        });
    };
    Scene.prototype.setupModelViewer = function () {
        this.remove();
        this.modelElement = document.createElement('model-viewer');
        this.modelElement.setAttribute('touch-action', 'pan-y');
        this.modelElement.setAttribute('camera-controls', '');
        this.modelElement.setAttribute('enable-pan', '');
        this.modelElement.setAttribute('environment-image', 'neutral');
        this.modelElement.setAttribute('src', this.baseUrl +
            '/model?type=glb' +
            (this.opts.variants
                ? "&variants=".concat(JSON.stringify(this.opts.variants))
                : ''));
        this.modelElement.classList.add('threedily-model');
        this.container.appendChild(this.modelElement);
        this.setupAR();
    };
    Scene.prototype.setupScene = function () {
        var _this = this;
        this.remove();
        this.sceneElement = document.createElement('div');
        this.sceneElement.classList.add('threedily-scene');
        this.container.appendChild(this.sceneElement);
        this.loading = 0;
        if (this.data.framesCount < 1)
            return;
        this.createLoading();
        for (var i = 0; i < this.data.framesCount; i++) {
            var img = document.createElement('img');
            img.classList.add('threedily-frame');
            img.style.backgroundColor = this.opts.background || '#FFFFFF';
            i === this.activeFrame && img.classList.add('threedily-frame-active');
            this.sceneElement.appendChild(img);
            this.frameElements.push(img);
        }
        var loadFrames = function (i, step) {
            if (i === void 0) { i = 0; }
            if (step === void 0) { step = 0; }
            _this.frameElements[i].src = _this.buildURL(i);
            _this.frameElements[i].onload = function () {
                _this.onLoading();
                _this.frameElements[i].onload = null;
            };
        };
        for (var i = 0; i < this.data.framesCount; i++) {
            loadFrames(i);
        }
        this.setupAR();
    };
    Scene.prototype.setupAR = function () {
        var _this = this;
        if (this.opts.ar !== undefined && !this.opts.ar) {
            return;
        }
        var arBtn = document.createElement('a');
        this.container.appendChild(arBtn);
        arBtn.classList.add('threedily-ar-btn');
        if ((0, utils_js_1.isIos)()) {
            arBtn.setAttribute('href', this.baseUrl +
                '/model?type=usdz' +
                (this.opts.variants
                    ? "&variants=".concat(JSON.stringify(this.opts.variants))
                    : ''));
            arBtn.setAttribute('rel', 'ar');
            this.opts.autoAR && arBtn.click();
        }
        else if ((0, utils_js_1.isAndroid)()) {
            arBtn.setAttribute('href', 'intent://arvr.google.com/scene-viewer/1.0?file=' +
                this.baseUrl +
                '/model?type=glb' +
                (this.opts.variants
                    ? "&variants=".concat(JSON.stringify(this.opts.variants))
                    : '') +
                '#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;');
            this.opts.autoAR && arBtn.click();
        }
        else {
            arBtn.addEventListener('click', function () {
                _this.showQRCode();
            });
        }
    };
    Scene.prototype.showQRCode = function () {
        var modal = document.createElement('div');
        var wrapper = document.createElement('div');
        var desc = document.createElement('p');
        desc.classList.add('threedily-ar-qr-desc');
        desc.innerText = 'Please scan the following code with your mobile phone.';
        modal.classList.add('threedily-ar-qr-modal');
        wrapper.classList.add('threedily-ar-qr-wrapper');
        modal.appendChild(desc);
        this.container.appendChild(modal);
        modal.appendChild(wrapper);
        var qrcode = new globalThis.QRCode(wrapper, {
            text: this.opts.arUrl || window.location.href,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: globalThis.QRCode.CorrectLevel.H,
        });
        var closeBtn = document.createElement('div');
        closeBtn.classList.add('threedily-ar-qr-close-btn');
        closeBtn.onclick = function () {
            qrcode.clear();
            modal.remove();
        };
        modal.appendChild(closeBtn);
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
        var url = new URL("".concat(this.baseUrl, "/image"));
        url.searchParams.append('frame', frame.toString());
        url.searchParams.append('shadow', (!!this.opts.shadow).toString());
        url.searchParams.append('size', JSON.stringify({
            width: quality === '1k' ? 1024 : quality === '2k' ? 1920 : 3840,
        }));
        if (this.opts.variants) {
            url.searchParams.append('variants', JSON.stringify(this.opts.variants));
        }
        url.searchParams.append('background', this.opts.background || '#FFFFFF');
        return url.toString();
    };
    Scene.prototype.remove = function () {
        this.frameElements = [];
        this.container.innerHTML = '';
        if (this.sceneElement) {
            this.sceneElement.remove();
        }
        if (this.modelElement) {
            this.modelElement.remove();
        }
    };
    Scene.prototype.changeVariants = function (variants) {
        this.opts.variants = variants;
        if (this.opts.mode === '360') {
            this.setupScene();
        }
        else if (this.opts.mode === 'model') {
            this.setupModelViewer();
        }
        else {
            this.data.framesCount > 0 ? this.setupScene() : this.setupModelViewer();
        }
    };
    Scene.prototype.changeBackground = function (color) {
        this.opts.background = color;
        this.setupScene();
    };
    Scene.prototype.toggleShadow = function (value) {
        if (value === undefined) {
            this.opts.shadow = !this.opts.shadow;
        }
        else {
            this.opts.shadow = value;
        }
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
