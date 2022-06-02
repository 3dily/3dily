"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var Controller_js_1 = require("./Controller.js");
var API_URL = 'https://dev.api.3dily.com/scene/';
var Scene = /** @class */ (function () {
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
            _this.controller = new Controller_js_1.Controller(_this.wrapper, _this.framesCount, _this.onChangeFrame);
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
exports.Scene = Scene;
