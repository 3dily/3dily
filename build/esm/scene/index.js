import { API_URL } from '../constants.js';
import { Controller } from './Controller.js';
import { Events } from './Events.js';
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
        this.container = document.getElementById(this.opts.containerId);
        if (!this.container) {
            console.error('Container not found!');
            return;
        }
        this.baseUrl = API_URL + this.opts.panelId + '/' + this.opts.productCode;
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
        return "".concat(this.baseUrl, "/image?frame=").concat(frame).concat(this.opts.shadow === true || typeof this.opts.shadow === 'undefined'
            ? ''
            : '&shadow=false', "&size=").concat(JSON.stringify({
            width: quality === '1k' ? 1024 : quality === '2k' ? 1920 : 3840,
        })).concat(this.opts.variants
            ? '&variants=' + JSON.stringify(this.opts.variants)
            : '', "&background=").concat(this.opts.background || '#FFFFFF');
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
export { Scene };
