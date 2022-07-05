/*!
 * 3DILY v1.0.0
 * (c) 2021-2022 Kamran Mokhtari
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Threedily = factory());
})(this, (function () { 'use strict';

    var API_URL = 'https://dev.api.3dily.com/scene/';

    var clamp = function (number, min, max) {
        return Math.min(Math.max(number, min), max);
    };
    var Controller = /** @class */ (function () {
        function Controller(element, framesCount, onChangeFrame, onZoom) {
            this.pointerPosition = { x: 0, y: 0 };
            this.pointerIsDown = false;
            this.moved = false;
            this.activeIndex = 0;
            this.zoomIsEnable = false;
            this.zoomScale = 4.3;
            this.translate = { x: 0, y: 0 };
            this.element = element;
            this.framesCount = framesCount;
            this.onChangeFrame = onChangeFrame;
            this.onZoom = onZoom;
            this.init();
        }
        Controller.prototype.init = function () {
            var _this = this;
            this.element.onpointerdown = function (e) {
                _this.pointerPosition = { x: e.clientX, y: e.clientY };
                _this.pointerIsDown = true;
                _this.moved = false;
            };
            this.element.onpointermove = function (e) {
                if (!_this.pointerIsDown || _this.zoomIsEnable)
                    return;
                var deltaX = _this.pointerPosition.x - e.clientX;
                if (Math.abs(deltaX) < 3)
                    return;
                var index = deltaX < 0 ? _this.activeIndex - 1 : _this.activeIndex + 1;
                _this.activeIndex =
                    index > _this.framesCount - 1
                        ? 0
                        : index < 0
                            ? _this.framesCount - 1
                            : index;
                _this.moved = true;
                _this.onChangeFrame(_this.activeIndex);
                _this.pointerPosition = { x: e.clientX, y: e.clientY };
            };
            this.element.onclick = function (e) {
                if (!_this.moved && !_this.zoomIsEnable) {
                    _this.zoomIsEnable = true;
                    _this.translate = _this.getTranslate(e.clientX, e.clientY);
                    _this.onZoom("scale(".concat(_this.zoomScale, ") translate(").concat(_this.translate.x, "px, ").concat(_this.translate.y, "px)"));
                }
                else if (_this.zoomIsEnable) {
                    _this.zoomIsEnable = false;
                    _this.onZoom('unset');
                }
            };
            this.element.onpointerup = function () {
                _this.pointerIsDown = false;
            };
            this.element.onmousemove = function (e) {
                if (!_this.zoomIsEnable)
                    return;
                var translate = _this.getTranslate(e.clientX, e.clientY);
                _this.onZoom("scale(".concat(_this.zoomScale, ") translate(").concat(translate.x, "px, ").concat(translate.y, "px)"));
            };
            this.element.ontouchmove = function (e) {
                if (!_this.zoomIsEnable)
                    return;
                var widthDelta = (_this.element.clientWidth * (_this.zoomScale - 1)) / (2 * _this.zoomScale);
                var heightDelta = (_this.element.clientHeight * (_this.zoomScale - 1)) /
                    (2 * _this.zoomScale);
                var delta = {
                    x: e.touches[0].clientX - _this.pointerPosition.x,
                    y: e.touches[0].clientY - _this.pointerPosition.y,
                };
                _this.pointerPosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
                _this.translate = {
                    x: clamp(_this.translate.x + delta.x * 0.4, -widthDelta, widthDelta),
                    y: clamp(_this.translate.y + delta.y * 0.4, -heightDelta, heightDelta),
                };
                _this.onZoom("scale(".concat(_this.zoomScale, ") translate(").concat(_this.translate.x, "px, ").concat(_this.translate.y, "px)"));
            };
        };
        Controller.prototype.getTranslate = function (clientX, clientY) {
            var localPosition = {
                x: clamp(clientX -
                    this.element.offsetLeft -
                    parseInt(window.getComputedStyle(this.element).borderWidth.replace('px', '')), 0, this.element.clientWidth),
                y: clamp(clientY -
                    this.element.offsetTop -
                    parseInt(window.getComputedStyle(this.element).borderWidth.replace('px', '')), 0, this.element.clientHeight),
            };
            var widthDelta = (this.element.clientWidth * (this.zoomScale - 1)) / (2 * this.zoomScale);
            var heightDelta = (this.element.clientHeight * (this.zoomScale - 1)) / (2 * this.zoomScale);
            return {
                x: widthDelta * (1 - (2 * localPosition.x) / this.element.clientWidth),
                y: heightDelta * (1 - (2 * localPosition.y) / this.element.clientHeight),
            };
        };
        return Controller;
    }());

    var Events = /** @class */ (function () {
        function Events() {
            this.handlers = {};
        }
        Events.prototype.on = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.handlers[args[0]])
                this.handlers[args[0]] = [];
            this.handlers[args[0]].push(args[1]);
        };
        Events.prototype.trigger = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.handlers[args[0]])
                this.handlers[args[0]] = [];
            for (var _a = 0, _b = this.handlers[args[0]]; _a < _b.length; _a++) {
                var h = _b[_a];
                h(args[1]);
            }
        };
        Events.prototype.off = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.handlers[args[0]])
                this.handlers[args[0]] = [];
            if (args[1]) {
                this.handlers[args[0]] = this.handlers[args[0]].filter(function (h) { return h !== args[1]; });
            }
            else {
                this.handlers[args[0]] = [];
            }
        };
        return Events;
    }());

    var Scene = /** @class */ (function () {
        function Scene(opts) {
            var _this = this;
            this.activeFrame = 0;
            this.frameElements = [];
            this.loading = 0;
            this.events = new Events();
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
            this.onLoading = function (loading) {
                if (loading === void 0) { loading = _this.loading + 1; }
                _this.loading = loading;
                if (_this.loading === _this.data.framesCount) {
                    _this.controller = new Controller(_this.sceneElement, _this.data.framesCount, _this.onChangeFrame, _this.onZoom);
                    setTimeout(function () {
                        _this.progressbar.remove();
                    }, 1200);
                }
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
            this.container = document.getElementById(this.opts.containerId);
            if (!this.container) {
                console.error('Container not found!');
                return;
            }
            this.baseUrl =
                (this.opts.API_URL || API_URL) +
                    this.opts.panelId +
                    '/' +
                    this.opts.productCode;
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
            var loadFrames = function (i) {
                if (i === void 0) { i = 0; }
                _this.frameElements[i].src = _this.buildURL(i);
                _this.frameElements[i].onload = function () {
                    i < _this.data.framesCount - 1 && loadFrames(i + 1);
                    _this.onLoading();
                    _this.frameElements[i].onload = null;
                };
            };
            loadFrames();
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
            url.searchParams.append('variants', JSON.stringify(this.opts.variants));
            url.searchParams.append('background', this.opts.background || '#FFFFFF');
            return url.toString();
        };
        Scene.prototype.remove = function () {
            this.frameElements = [];
            this.container.innerHTML = '';
            if (this.sceneElement) {
                this.sceneElement.remove();
            }
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

    function Threedily(opts) {
        var scene = new Scene(opts);
        return scene;
    }

    return Threedily;

}));
//# sourceMappingURL=3dily.js.map
