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
export { Controller };
