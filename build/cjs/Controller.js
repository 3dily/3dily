"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
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
exports.Controller = Controller;
