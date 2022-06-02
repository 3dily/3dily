/*!
 * 3DILY v1.0.0
 * (c) 2021-2022 Kamran Mokhtari
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Scene = factory());
})(this, (function () { 'use strict';

    var Controller = /** @class */ (function () {
        function Controller(element, framesCount, onChangeFrame) {
            this.pointerPosition = { x: 0, y: 0 };
            this.pointerIsDown = false;
            this.moved = false;
            this.activeIndex = 0;
            this.element = element;
            this.framesCount = framesCount;
            this.onChangeFrame = onChangeFrame;
            this.init();
        }
        Controller.prototype.init = function () {
            var _this = this;
            this.element.onpointerdown = function (e) {
                _this.pointerPosition = { x: e.clientX, y: e.clientY };
                _this.pointerIsDown = true;
            };
            this.element.onpointermove = function (e) {
                if (!_this.pointerIsDown /* || zoomIsEnable */)
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
                _this.onChangeFrame(_this.activeIndex);
                _this.pointerPosition = { x: e.clientX, y: e.clientY };
            };
            this.element.onpointerup = function () {
                _this.pointerIsDown = false;
            };
        };
        return Controller;
    }());

    var API_URL = 'https://dev.api.3dily.com/scene/';
    var Scene$1 = /** @class */ (function () {
        function Scene(opts) {
            var _this = this;
            this.framesCount = 0;
            this.activeFrame = 0;
            this.frameElements = [];
            this.onChangeFrame = function (i) {
                _this.frameElements[_this.activeFrame].classList.remove('_3dily-frame-active');
                _this.frameElements[i].classList.add('_3dily-frame-active');
                _this.activeFrame = i;
            };
            this.opts = opts;
            this.init();
        }
        Scene.prototype.init = function () {
            this.container = document.getElementById(this.opts.containerId);
            if (!this.container) {
                console.error('Container not found');
                return;
            }
            this.wrapper = document.createElement('div');
            this.wrapper.classList.add('_3dily-scene');
            this.container.appendChild(this.wrapper);
            this.baseUrl = API_URL + this.opts.panelId + '/' + this.opts.productCode;
            this.setupScene();
        };
        Scene.prototype.setupScene = function () {
            var _this = this;
            fetch("".concat(this.baseUrl, "/data"))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                _this.framesCount = data.files[0].frames.length;
                _this.controller = new Controller(_this.wrapper, _this.framesCount, _this.onChangeFrame);
                for (var i = 0; i < _this.framesCount; i++) {
                    var img = document.createElement('img');
                    img.classList.add('_3dily-frame');
                    i === _this.activeFrame && img.classList.add('_3dily-frame-active');
                    img.src = "".concat(_this.baseUrl, "/image?shadow=true&frame=").concat(i, "&quality=2k");
                    _this.wrapper.appendChild(img);
                    _this.frameElements.push(img);
                }
            });
        };
        return Scene;
    }());

    function Scene(opts) {
        var Scene = new Scene$1(opts);
        return Scene;
    }

    return Scene;

}));
//# sourceMappingURL=3dily.js.map
